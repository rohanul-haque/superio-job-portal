import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import config from "../../config";
import prisma from "../../lib/prisma";
import AppError from "../../utils/AppError";
import type {
  IAIRecommendationRaw,
  IRecommendationsResult,
  IRecommendedJobResponse,
  MatchLevel,
} from "./recommendation.interface";

// In-Memory Recommendation Cache with TTL
interface ICacheEntry {
  result: IRecommendationsResult;
  profileHash: string;
  createdAt: number;
}

const recommendationCache = new Map<string, ICacheEntry>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes TTL

/**
 * Clears recommendation cache for a specific candidate (called on profile updates).
 */
export const clearCandidateCache = (candidateId: string): void => {
  recommendationCache.delete(candidateId);
};

// Zod Schema for Structured AI Recommendation Output
const RecommendationItemSchema = z.object({
  jobId: z.string().describe("The exact ID of the evaluated job"),
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "Match score between 0 and 100 based on technical/domain alignment, skill overlap, title synergy, and experience",
    ),
  matchLevel: z
    .enum(["Excellent Match", "Good Match", "Moderate Match", "Low Match"])
    .describe(
      "Match level: 85-100 Excellent Match, 70-84 Good Match, 50-69 Moderate Match, <50 Low Match",
    ),
  matchedSkills: z
    .array(z.string())
    .describe(
      "Candidate skills that match or are directly relevant to the job requirements",
    ),
  missingSkills: z
    .array(z.string())
    .describe(
      "Important skills required or preferred by the job that the candidate lacks",
    ),
  reason: z
    .string()
    .describe(
      "Short concise explanation (1-2 sentences) of why the job matches the candidate's profile",
    ),
});

const RecommendationOutputSchema = z.object({
  recommendations: z.array(RecommendationItemSchema),
});

/**
 * Helper to compute match level from score consistently.
 */
const getMatchLevelFromScore = (score: number): MatchLevel => {
  if (score >= 85) return "Excellent Match";
  if (score >= 70) return "Good Match";
  if (score >= 50) return "Moderate Match";
  return "Low Match";
};

/**
 * Heuristic fallback matching engine when Gemini API is unconfigured or unavailable.
 */
const runHeuristicMatching = (
  candidate: {
    title: string;
    skills: string[];
    bio: string;
  },
  jobs: Array<{
    id: string;
    title: string;
    description: string;
    level: string;
    jobType: string;
    category?: { name: string } | null;
  }>,
): IAIRecommendationRaw[] => {
  const candidateSkillsNorm = (candidate.skills || []).map((s) =>
    s.trim().toLowerCase(),
  );
  const candidateTitleWords = (candidate.title || "")
    .toLowerCase()
    .split(/[\s,/-]+/)
    .filter((w) => w.length > 2);

  return jobs.map((job) => {
    const jobText =
      `${job.title} ${job.description} ${job.category?.name || ""}`.toLowerCase();

    // 1. Skill Matching
    const matchedSkills: string[] = [];
    for (const rawSkill of candidate.skills || []) {
      const skillLower = rawSkill.trim().toLowerCase();
      if (skillLower && jobText.includes(skillLower)) {
        matchedSkills.push(rawSkill);
      }
    }

    // 2. Title Overlap
    let titleOverlapCount = 0;
    const jobTitleLower = job.title.toLowerCase();
    for (const word of candidateTitleWords) {
      if (jobTitleLower.includes(word)) {
        titleOverlapCount++;
      }
    }
    const titleScoreRatio =
      candidateTitleWords.length > 0
        ? Math.min(
            1,
            titleOverlapCount / Math.min(candidateTitleWords.length, 3),
          )
        : 0;

    // 3. Level alignment bonus
    let levelScore = 10;
    if (
      job.level?.toLowerCase().includes("beginner") ||
      job.level?.toLowerCase().includes("entry")
    ) {
      levelScore = 15;
    } else if (job.level?.toLowerCase().includes("intermediate")) {
      levelScore = 12;
    }

    // Weighted Score: Skills (55%), Title (30%), Level/Category (15%)
    const skillScore =
      candidateSkillsNorm.length > 0
        ? Math.min(
            1,
            matchedSkills.length / Math.min(candidateSkillsNorm.length, 5),
          ) * 55
        : 10;
    const titleScore = titleScoreRatio * 30;

    const rawScore = Math.round(skillScore + titleScore + levelScore);
    const matchScore = Math.min(100, Math.max(10, rawScore));
    const matchLevel = getMatchLevelFromScore(matchScore);

    const missingSkills: string[] = [];
    const commonTech = [
      "TypeScript",
      "React",
      "Node.js",
      "Python",
      "Docker",
      "AWS",
      "PostgreSQL",
      "MongoDB",
      "GraphQL",
      "Next.js",
    ];
    for (const tech of commonTech) {
      if (
        jobText.includes(tech.toLowerCase()) &&
        !candidateSkillsNorm.includes(tech.toLowerCase())
      ) {
        missingSkills.push(tech);
        if (missingSkills.length >= 2) break;
      }
    }

    let reason = "";
    if (matchedSkills.length > 0) {
      reason = `Matches your background in ${matchedSkills.slice(0, 3).join(", ")} with relevant ${job.title} responsibilities.`;
    } else if (titleOverlapCount > 0) {
      reason = `Aligns with your professional focus as ${candidate.title}.`;
    } else {
      reason = `Offers transferable opportunities in ${job.category?.name || "your domain"}.`;
    }

    return {
      jobId: job.id,
      matchScore,
      matchLevel,
      matchedSkills,
      missingSkills,
      reason,
    };
  });
};

/**
 * Retrieves AI-powered job recommendations for the authenticated Candidate.
 */
const getRecommendations = async (
  candidateId: string,
  forceRefresh = false,
): Promise<IRecommendationsResult> => {
  // 1. Fetch Candidate Profile
  const candidate = await prisma.user.findUnique({
    where: {
      id: candidateId,
      role: "candidate",
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      title: true,
      bio: true,
      skills: true,
      updatedAt: true,
    },
  });

  if (!candidate) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Candidate profile not found or inactive.",
    );
  }

  // 2. Validate Profile Completeness
  const hasTitle = Boolean(
    candidate.title && candidate.title.trim().length > 0,
  );
  const hasSkills = Boolean(
    Array.isArray(candidate.skills) && candidate.skills.length > 0,
  );
  const hasBio = Boolean(candidate.bio && candidate.bio.trim().length > 0);

  if (!hasTitle && !hasSkills && !hasBio) {
    return {
      recommendations: [],
      meta: {
        total: 0,
        profileCompleted: false,
        cached: false,
        evaluatedCount: 0,
        timestamp: new Date().toISOString(),
        message:
          "Please complete your profile by adding your professional title, skills, or bio to receive personalized AI job recommendations.",
      },
    };
  }

  // 3. Check In-Memory Cache
  const profileHash = `${candidate.title}|${(candidate.skills || []).slice().sort().join(",")}|${candidate.bio}|${candidate.updatedAt.getTime()}`;
  if (!forceRefresh) {
    const cachedEntry = recommendationCache.get(candidateId);
    if (
      cachedEntry &&
      cachedEntry.profileHash === profileHash &&
      Date.now() - cachedEntry.createdAt < CACHE_TTL_MS
    ) {
      return {
        ...cachedEntry.result,
        meta: {
          ...cachedEntry.result.meta,
          cached: true,
        },
      };
    }
  }

  // 4. Retrieve Active, Eligible Jobs
  const eligibleJobs = await prisma.job.findMany({
    where: {
      isDeleted: false,
      visible: true,
      hiringStatus: "Ongoing",
      deadline: { gte: new Date() },
      company: {
        isDeleted: false,
        status: "active",
      },
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      company: {
        select: {
          id: true,
          name: true,
          image: true,
          location: true,
          website: true,
          companySize: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 40, // Evaluate up to 40 latest active job postings
  });

  if (eligibleJobs.length === 0) {
    return {
      recommendations: [],
      meta: {
        total: 0,
        profileCompleted: true,
        cached: false,
        evaluatedCount: 0,
        timestamp: new Date().toISOString(),
        message:
          "No active job openings are available at this moment. Please check back later.",
      },
    };
  }

  const jobsMap = new Map(eligibleJobs.map((job) => [job.id, job]));

  // 5. Semantic AI Evaluation via LangChain & Google Gemini
  let rawRecommendations: IAIRecommendationRaw[] = [];
  const geminiApiKey = config.GOOGLE_GEMINI_API_KEY;

  if (geminiApiKey && geminiApiKey.trim().length > 0) {
    try {
      const llm = new ChatGoogleGenerativeAI({
        model: "gemini-3.5-flash-lite",
        apiKey: geminiApiKey,
        temperature: 0.2,
        maxRetries: 2,
      });

      const structuredLlm = llm.withStructuredOutput(
        RecommendationOutputSchema,
      );

      const jobSummaries = eligibleJobs.map((j) => ({
        id: j.id,
        title: j.title,
        category: j.category?.name || "General",
        level: j.level,
        jobType: j.jobType,
        location: j.location,
        descriptionSnippet: j.description
          .replace(/<[^>]*>?/gm, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 400),
      }));

      const systemPrompt = `You are an expert technical talent matching AI for the HireNest job portal.
Evaluate how well the Candidate's profile matches each available Job opening based on:
1. Skills: Direct technical skills and related frameworks/technologies.
2. Title: Alignment between candidate's professional title and job title.
3. Description: Candidate's background and core responsibilities in job description.
4. Score Calibration:
   - 85-100: "Excellent Match" (strong alignment in core skills and role)
   - 70-84: "Good Match" (solid overlap with minor skill gaps)
   - 50-69: "Moderate Match" (transferable skills or partial overlap)
   - <50: "Low Match" (incompatible domain or missing critical requirements)

Strict Rules:
- Only evaluate the exact jobs provided in the list.
- Use the exact jobId for each job.
- Never invent skills the candidate does not have.
- Never mark a skill as missing if the job does not require or mention it.
- Keep the reason concise (1-2 sentences).`;

      const userPrompt = `Candidate Profile:
- Title: ${candidate.title || "Not specified"}
- Skills: ${(candidate.skills || []).join(", ") || "None specified"}
- Bio: ${candidate.bio || "None provided"}

Available Jobs to Evaluate:
${JSON.stringify(jobSummaries, null, 2)}`;

      const aiResponse = await structuredLlm.invoke([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ]);

      if (aiResponse && Array.isArray(aiResponse.recommendations)) {
        rawRecommendations = aiResponse.recommendations.map((item) => ({
          jobId: item.jobId,
          matchScore: Math.min(100, Math.max(0, Math.round(item.matchScore))),
          matchLevel: getMatchLevelFromScore(item.matchScore),
          matchedSkills: Array.isArray(item.matchedSkills)
            ? item.matchedSkills
            : [],
          missingSkills: Array.isArray(item.missingSkills)
            ? item.missingSkills
            : [],
          reason: item.reason || "Matches your background and skills.",
        }));
      }
    } catch (aiError) {
      console.error(
        "[AI Recommendation] LangChain Gemini evaluation failed, falling back to heuristic engine:",
        aiError,
      );
      rawRecommendations = runHeuristicMatching(candidate, eligibleJobs);
    }
  } else {
    // Graceful fallback when GEMINI API Key is not yet configured
    rawRecommendations = runHeuristicMatching(candidate, eligibleJobs);
  }

  // 6. Filter, De-duplicate, Rank and Hydrate
  const seenJobIds = new Set<string>();
  const hydratedRecommendations: IRecommendedJobResponse[] = [];

  for (const rec of rawRecommendations) {
    if (!rec.jobId || seenJobIds.has(rec.jobId)) continue;
    const matchedJob = jobsMap.get(rec.jobId);
    if (!matchedJob) continue; // Ignore hallucinated IDs

    // Exclude jobs below 50 match score by default as per specification
    if (rec.matchScore < 50) continue;

    seenJobIds.add(rec.jobId);
    hydratedRecommendations.push({
      jobId: rec.jobId,
      matchScore: rec.matchScore,
      matchLevel: rec.matchLevel,
      matchedSkills: rec.matchedSkills,
      missingSkills: rec.missingSkills,
      reason: rec.reason,
      job: {
        id: matchedJob.id,
        title: matchedJob.title,
        description: matchedJob.description,
        categoryId: matchedJob.categoryId,
        category: matchedJob.category,
        companyId: matchedJob.companyId,
        company: matchedJob.company,
        location: matchedJob.location,
        level: matchedJob.level,
        salary: matchedJob.salary,
        vacancy: matchedJob.vacancy,
        jobType: matchedJob.jobType,
        hiringStatus: matchedJob.hiringStatus,
        deadline: matchedJob.deadline,
        visible: matchedJob.visible,
        createdAt: matchedJob.createdAt,
        updatedAt: matchedJob.updatedAt,
      },
    });
  }

  // Sort descending by match score
  hydratedRecommendations.sort((a, b) => b.matchScore - a.matchScore);

  // Return top 10 recommendations
  const topRecommendations = hydratedRecommendations.slice(0, 10);

  const result: IRecommendationsResult = {
    recommendations: topRecommendations,
    meta: {
      total: topRecommendations.length,
      profileCompleted: true,
      cached: false,
      evaluatedCount: eligibleJobs.length,
      timestamp: new Date().toISOString(),
      message:
        topRecommendations.length === 0
          ? "No jobs currently meet the minimum 50% match score for your profile. Try updating your skills or check back soon."
          : undefined,
    },
  };

  // Cache in memory
  recommendationCache.set(candidateId, {
    result,
    profileHash,
    createdAt: Date.now(),
  });

  return result;
};

const recommendationService = {
  getRecommendations,
  clearCandidateCache,
};

export default recommendationService;
