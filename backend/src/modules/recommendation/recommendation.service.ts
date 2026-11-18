import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import config from "../../config";
import { getGeminiClient } from "../../lib/gemini";
import prisma from "../../lib/prisma";
import AppError from "../../utils/AppError";
import type {
  IAICandidateMatchRaw,
  IAIRecommendationRaw,
  ICandidateMatchResponse,
  ICandidateMatchingResult,
  IRecommendationsResult,
  IRecommendedJobResponse,
  MatchLevel,
} from "./recommendation.interface";

// ============================================================================
// 1. IN-MEMORY CACHE WITH TTL (15 MINUTES)
// ============================================================================
interface ICacheEntry {
  result: IRecommendationsResult;
  profileHash: string;
  createdAt: number;
}

interface ICandidateMatchingCacheEntry {
  result: ICandidateMatchingResult;
  jobHash: string;
  createdAt: number;
}

const recommendationCache = new Map<string, ICacheEntry>();
const candidateMatchingCache = new Map<string, ICandidateMatchingCacheEntry>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes TTL

export const clearCandidateCache = (candidateId: string): void => {
  recommendationCache.delete(candidateId);
};

export const clearJobCandidateMatchingCache = (jobId: string): void => {
  candidateMatchingCache.delete(jobId);
};

// ============================================================================
// 2. SKILL ALIASES & ROLE DOMAIN DICTIONARIES (DETERMINISTIC VALIDATION)
// ============================================================================

const SKILL_ALIASES: Record<string, string> = {
  // Frontend
  react: "React",
  "react.js": "React",
  reactjs: "React",
  "react native": "React Native",
  next: "Next.js",
  "next.js": "Next.js",
  nextjs: "Next.js",
  vue: "Vue.js",
  "vue.js": "Vue.js",
  vuejs: "Vue.js",
  nuxt: "Nuxt.js",
  "nuxt.js": "Nuxt.js",
  angular: "Angular",
  angularjs: "Angular",
  svelte: "Svelte",
  html: "HTML",
  html5: "HTML",
  css: "CSS",
  css3: "CSS",
  sass: "Sass",
  scss: "Sass",
  tailwind: "Tailwind CSS",
  tailwindcss: "Tailwind CSS",
  bootstrap: "Bootstrap",
  javascript: "JavaScript",
  js: "JavaScript",
  typescript: "TypeScript",
  ts: "TypeScript",
  redux: "Redux",
  zustand: "Zustand",

  // Backend
  node: "Node.js",
  "node.js": "Node.js",
  nodejs: "Node.js",
  express: "Express.js",
  "express.js": "Express.js",
  nest: "NestJS",
  nestjs: "NestJS",
  fastify: "Fastify",
  python: "Python",
  django: "Django",
  fastapi: "FastAPI",
  flask: "Flask",
  java: "Java",
  spring: "Spring Boot",
  "spring boot": "Spring Boot",
  csharp: "C#",
  "c#": "C#",
  dotnet: ".NET",
  ".net": ".NET",
  aspnet: "ASP.NET",
  "asp.net": "ASP.NET",
  php: "PHP",
  laravel: "Laravel",
  ruby: "Ruby",
  rails: "Ruby on Rails",
  "ruby on rails": "Ruby on Rails",
  golang: "Go",
  go: "Go",
  rust: "Rust",

  // Databases & ORMs
  mongodb: "MongoDB",
  mongo: "MongoDB",
  mongoose: "Mongoose",
  postgresql: "PostgreSQL",
  postgres: "PostgreSQL",
  mysql: "MySQL",
  sql: "SQL",
  sqlite: "SQLite",
  redis: "Redis",
  prisma: "Prisma",
  typeorm: "TypeORM",
  sequelize: "Sequelize",

  // API & Architecture
  rest: "REST API",
  "rest api": "REST API",
  "restful api": "REST API",
  graphql: "GraphQL",
  grpc: "gRPC",
  microservices: "Microservices",
  websocket: "WebSocket",
  websockets: "WebSockets",

  // Cloud & DevOps
  docker: "Docker",
  kubernetes: "Kubernetes",
  k8s: "Kubernetes",
  aws: "AWS",
  gcp: "Google Cloud",
  azure: "Azure",
  linux: "Linux",
  git: "Git",
  github: "GitHub",
  gitlab: "GitLab",
  "ci/cd": "CI/CD",
  cicd: "CI/CD",
  jenkins: "Jenkins",
  "github actions": "GitHub Actions",
  terraform: "Terraform",

  // Mobile
  ios: "iOS",
  swift: "Swift",
  android: "Android",
  kotlin: "Kotlin",
  flutter: "Flutter",
  dart: "Dart",

  // Testing & Quality
  jest: "Jest",
  vitest: "Vitest",
  cypress: "Cypress",
  playwright: "Playwright",
  selenium: "Selenium",
  testing: "Testing",

  // Professional / Soft Skills
  agile: "Agile",
  scrum: "Scrum",
  kanban: "Kanban",
  leadership: "Leadership",
  "team leadership": "Team Leadership",
  communication: "Communication",
  collaboration: "Collaboration",
  teamwork: "Teamwork",
  "problem solving": "Problem Solving",
  "critical thinking": "Critical Thinking",
  "code review": "Code Review",
  mentoring: "Mentoring",
  "project management": "Project Management",
  "time management": "Time Management",
  "product delivery": "Product Delivery",
};

const PROFESSIONAL_SKILL_KEYWORDS = new Set([
  "agile",
  "scrum",
  "kanban",
  "leadership",
  "team leadership",
  "communication",
  "collaboration",
  "teamwork",
  "problem solving",
  "critical thinking",
  "code review",
  "mentoring",
  "project management",
  "time management",
  "product delivery",
]);

type RoleDomain =
  | "frontend"
  | "backend"
  | "fullstack"
  | "mobile"
  | "devops"
  | "data_ai"
  | "design"
  | "qa"
  | "management"
  | "general";

const DOMAIN_KEYWORDS: Record<RoleDomain, string[]> = {
  frontend: [
    "frontend",
    "front-end",
    "front end",
    "react",
    "vue",
    "angular",
    "next.js",
    "ui engineer",
    "web developer",
    "css",
    "html",
  ],
  backend: [
    "backend",
    "back-end",
    "back end",
    "node",
    "express",
    "python",
    "django",
    "fastapi",
    "golang",
    "java",
    "spring",
    "c#",
    ".net",
    "api",
    "database",
    "server",
  ],
  fullstack: [
    "full stack",
    "fullstack",
    "full-stack",
    "mern",
    "mean",
    "software engineer",
    "web developer",
  ],
  mobile: [
    "mobile",
    "ios",
    "android",
    "swift",
    "kotlin",
    "react native",
    "flutter",
  ],
  devops: [
    "devops",
    "cloud",
    "aws",
    "sre",
    "platform",
    "infrastructure",
    "kubernetes",
    "docker",
  ],
  data_ai: [
    "data",
    "machine learning",
    "ml",
    "ai",
    "artificial intelligence",
    "analytics",
    "nlp",
    "python",
  ],
  design: [
    "ui/ux",
    "ux/ui",
    "product designer",
    "ui designer",
    "ux designer",
    "graphic designer",
    "figma",
  ],
  qa: ["qa", "quality assurance", "test automation", "tester", "sdet"],
  management: [
    "product manager",
    "project manager",
    "scrum master",
    "engineering manager",
    "lead",
  ],
  general: [],
};

const normalizeSkill = (raw: string): string => {
  const trimmed = raw.trim().toLowerCase();
  return SKILL_ALIASES[trimmed] || raw.trim();
};

const detectDomain = (text: string): RoleDomain => {
  const lower = text.toLowerCase();
  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    if (domain === "general") continue;
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        return domain as RoleDomain;
      }
    }
  }
  return "general";
};

const areDomainsCompatible = (
  candDomain: RoleDomain,
  jobDomain: RoleDomain,
): { compatible: boolean; penaltyRatio: number } => {
  if (candDomain === "general" || jobDomain === "general") {
    return { compatible: true, penaltyRatio: 0.8 };
  }
  if (candDomain === jobDomain) {
    return { compatible: true, penaltyRatio: 1.0 };
  }
  if (
    (candDomain === "fullstack" &&
      (jobDomain === "frontend" || jobDomain === "backend")) ||
    (jobDomain === "fullstack" &&
      (candDomain === "frontend" || candDomain === "backend"))
  ) {
    return { compatible: true, penaltyRatio: 0.85 };
  }
  return { compatible: false, penaltyRatio: 0.2 };
};

/**
 * Maps numerical score strictly to MatchLevel according to Section 6 of requirements:
 * 90-100: Excellent Match (Recommend)
 * 80-89:  Strong Match (Recommend)
 * 70-79:  Moderate Match (Exclude by default)
 * <70:    Weak Match (Exclude)
 */
export const getMatchLevelFromScore = (score: number): MatchLevel => {
  if (score >= 90) return "Excellent Match";
  if (score >= 80) return "Strong Match";
  if (score >= 70) return "Moderate Match";
  return "Weak Match";
};

/**
 * Calculates weighted score strictly following Section 6 weighting framework:
 * - Required Technical Skills: 30%
 * - Professional Title Compatibility: 20%
 * - Bio / Description Relevance: 15%
 * - Professional Skills: 10%
 * - Experience Compatibility: 10%
 * - Responsibilities Compatibility: 10%
 * - Preferred Skills: 5%
 * Total: 100%
 *
 * Enforces mandatory guardrail: A high numerical score must never override
 * a failed mandatory requirement (score capped <= 65).
 */
export const computeStrictCompositeScore = (
  techScore: number,
  titleScore: number,
  bioScore: number,
  profScore: number,
  expScore: number,
  respScore: number,
  prefScore: number,
  mandatoryPassed: boolean,
): { finalScore: number; matchLevel: MatchLevel } => {
  let score = Math.round(
    0.3 * techScore +
      0.2 * titleScore +
      0.15 * bioScore +
      0.1 * profScore +
      0.1 * expScore +
      0.1 * respScore +
      0.05 * prefScore,
  );

  // Strict Guardrails: Failed mandatory requirement caps score at 65 (Weak/Moderate)
  if (!mandatoryPassed) {
    score = Math.min(score, 65);
  }
  if (techScore < 50) {
    score = Math.min(score, 69);
  }
  if (titleScore < 40) {
    score = Math.min(score, 69);
  }

  score = Math.min(100, Math.max(0, score));
  const matchLevel = getMatchLevelFromScore(score);
  return { finalScore: score, matchLevel };
};

// ============================================================================
// 3. DETERMINISTIC ANALYSIS PIPELINE
// ============================================================================

interface IDeterministicCheckResult {
  matchedTechnicalSkills: string[];
  missingRequiredSkills: string[];
  matchedProfessionalSkills: string[];
  matchedPreferredSkills: string[];
  technicalSkillsScore: number;
  titleScore: number;
  bioScore: number;
  professionalSkillsScore: number;
  experienceScore: number;
  responsibilityScore: number;
  preferredSkillsScore: number;
  mandatoryRequirementsPassed: boolean;
  rejectionReasons: string[];
}

/**
 * Extracts and categorizes requirements from a Job posting.
 */
const extractJobRequirements = (job: {
  title: string;
  description: string;
  level: string;
  category?: { name: string } | null;
}): {
  requiredSkills: string[];
  preferredSkills: string[];
  jobDomain: RoleDomain;
  seniorityRequired: "Senior" | "Intermediate" | "Beginner" | "Any";
} => {
  const cleanDesc = job.description
    .replace(/<[^>]*>?/gm, " ")
    .replace(/\s+/g, " ");
  const textLower =
    `${job.title} ${cleanDesc} ${job.category?.name || ""}`.toLowerCase();
  const jobDomain =
    detectDomain(job.title) !== "general"
      ? detectDomain(job.title)
      : detectDomain(textLower);

  const requiredSkillsSet = new Set<string>();
  const preferredSkillsSet = new Set<string>();

  // Check section boundaries for Preferred/Bonus vs Required
  const preferredIndex = Math.max(
    textLower.indexOf("preferred"),
    textLower.indexOf("nice to have"),
    textLower.indexOf("bonus"),
    textLower.indexOf("plus if"),
  );

  for (const [alias, canonical] of Object.entries(SKILL_ALIASES)) {
    const regex = new RegExp(
      `\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
      "i",
    );
    const match = regex.exec(textLower);
    if (match) {
      if (preferredIndex !== -1 && match.index > preferredIndex) {
        preferredSkillsSet.add(canonical);
      } else {
        requiredSkillsSet.add(canonical);
      }
    }
  }

  // Ensure title technologies are strictly required
  for (const [alias, canonical] of Object.entries(SKILL_ALIASES)) {
    if (job.title.toLowerCase().includes(alias)) {
      requiredSkillsSet.add(canonical);
      preferredSkillsSet.delete(canonical);
    }
  }

  let seniorityRequired: "Senior" | "Intermediate" | "Beginner" | "Any" = "Any";
  const levelLower = (job.level || "").toLowerCase();
  if (
    levelLower.includes("senior") ||
    job.title.toLowerCase().includes("senior") ||
    job.title.toLowerCase().includes("lead")
  ) {
    seniorityRequired = "Senior";
  } else if (
    levelLower.includes("intermediate") ||
    levelLower.includes("mid")
  ) {
    seniorityRequired = "Intermediate";
  } else if (
    levelLower.includes("beginner") ||
    levelLower.includes("entry") ||
    levelLower.includes("junior")
  ) {
    seniorityRequired = "Beginner";
  }

  return {
    requiredSkills: Array.from(requiredSkillsSet),
    preferredSkills: Array.from(preferredSkillsSet),
    jobDomain,
    seniorityRequired,
  };
};

/**
 * Runs deterministic multi-factor validation on a candidate against a job.
 */
export const runDeterministicEvaluation = (
  candidate: {
    title: string;
    bio: string;
    skills: string[];
    socialLinks?: unknown;
    resume?: unknown;
  },
  job: {
    title: string;
    description: string;
    level: string;
    category?: { name: string } | null;
  },
): IDeterministicCheckResult => {
  const rejectionReasons: string[] = [];
  const candDomain =
    detectDomain(candidate.title) !== "general"
      ? detectDomain(candidate.title)
      : detectDomain(candidate.bio);

  const jobReqs = extractJobRequirements(job);
  const domainCheck = areDomainsCompatible(candDomain, jobReqs.jobDomain);

  // Normalize candidate skills into technical vs professional
  const candNormalizedSkills = (candidate.skills || []).map(normalizeSkill);
  const candSkillsLowerSet = new Set(
    (candidate.skills || []).map((s) => s.trim().toLowerCase()),
  );

  const matchedTechSet = new Set<string>();
  const matchedProfSet = new Set<string>();
  const matchedPrefSet = new Set<string>();
  const missingReqSet = new Set<string>();

  // Compare candidate skills with required job skills
  for (const req of jobReqs.requiredSkills) {
    const isProfessional = PROFESSIONAL_SKILL_KEYWORDS.has(req.toLowerCase());
    const hasSkill =
      candNormalizedSkills.includes(req) ||
      candSkillsLowerSet.has(req.toLowerCase());

    if (hasSkill) {
      if (isProfessional) {
        matchedProfSet.add(req);
      } else {
        matchedTechSet.add(req);
      }
    } else {
      if (!isProfessional) {
        missingReqSet.add(req);
      }
    }
  }

  // Compare candidate skills with preferred skills
  for (const pref of jobReqs.preferredSkills) {
    const hasSkill =
      candNormalizedSkills.includes(pref) ||
      candSkillsLowerSet.has(pref.toLowerCase());
    if (hasSkill) {
      matchedPrefSet.add(pref);
    }
  }

  // Additional check: candidate technical skills mentioned anywhere in job text
  const cleanJobText = `${job.title} ${job.description}`.toLowerCase();
  for (const rawSkill of candidate.skills || []) {
    const canonical = normalizeSkill(rawSkill);
    const isProf = PROFESSIONAL_SKILL_KEYWORDS.has(rawSkill.toLowerCase());
    if (cleanJobText.includes(rawSkill.trim().toLowerCase())) {
      if (isProf) {
        matchedProfSet.add(canonical);
      } else {
        matchedTechSet.add(canonical);
      }
    }
  }

  // 1. Technical Skills Score (30% weight component)
  let technicalSkillsScore = 50;
  if (jobReqs.requiredSkills.length > 0) {
    const requiredTechCount = jobReqs.requiredSkills.filter(
      (s) => !PROFESSIONAL_SKILL_KEYWORDS.has(s.toLowerCase()),
    ).length;

    if (requiredTechCount > 0) {
      const techRatio = matchedTechSet.size / requiredTechCount;
      technicalSkillsScore = Math.min(100, Math.round(techRatio * 100));
    } else {
      technicalSkillsScore = matchedTechSet.size > 0 ? 80 : 50;
    }
  } else {
    technicalSkillsScore = matchedTechSet.size > 0 ? 85 : 50;
  }

  // 2. Title Compatibility Score (20% weight component)
  let titleScore = 40;
  if (!domainCheck.compatible) {
    titleScore = Math.round(15 * domainCheck.penaltyRatio);
    rejectionReasons.push(
      `Professional title (${candidate.title || "Not specified"}) does not align with role domain (${jobReqs.jobDomain}).`,
    );
  } else {
    const candTitleLower = (candidate.title || "").toLowerCase();
    const jobTitleLower = job.title.toLowerCase();

    // Check direct role overlap
    const jobWords = jobTitleLower
      .split(/[\s,/-]+/)
      .filter((w) => w.length > 2);
    let matchedWordCount = 0;
    for (const jWord of jobWords) {
      if (candTitleLower.includes(jWord)) matchedWordCount++;
    }

    const overlapRatio =
      jobWords.length > 0 ? matchedWordCount / Math.min(jobWords.length, 3) : 0;
    titleScore = Math.round(
      Math.min(100, overlapRatio * 70 + domainCheck.penaltyRatio * 30),
    );
  }

  // 3. Bio / Description Relevance (15% weight component)
  const bioLower = (candidate.bio || "").toLowerCase();
  let bioScore = 50;
  if (bioLower.length > 30) {
    let bioOverlap = 0;
    const bioKeywords = bioLower.split(/[\s,.-]+/).filter((w) => w.length > 3);
    for (const kw of bioKeywords.slice(0, 25)) {
      if (cleanJobText.includes(kw)) bioOverlap++;
    }
    bioScore = Math.min(
      95,
      Math.round((bioOverlap / Math.min(bioKeywords.length || 1, 10)) * 95),
    );
  }

  // 4. Professional Skills (10% weight component)
  let professionalSkillsScore = 60;
  if (matchedProfSet.size >= 2) professionalSkillsScore = 95;
  else if (matchedProfSet.size === 1) professionalSkillsScore = 80;

  // 5. Experience / Seniority Compatibility (10% weight component)
  let experienceScore = 75;
  const candTitleLower = (candidate.title || "").toLowerCase();
  const candBioLower = (candidate.bio || "").toLowerCase();
  const isCandidateSenior =
    candTitleLower.includes("senior") ||
    candTitleLower.includes("lead") ||
    candTitleLower.includes("principal") ||
    candBioLower.includes("years of experience") ||
    candBioLower.includes("senior");
  const isCandidateJunior =
    candTitleLower.includes("junior") ||
    candTitleLower.includes("intern") ||
    candTitleLower.includes("entry");

  if (jobReqs.seniorityRequired === "Senior") {
    if (isCandidateSenior) {
      experienceScore = 95;
    } else if (isCandidateJunior) {
      experienceScore = 20;
      rejectionReasons.push(
        "Candidate junior seniority does not satisfy Senior role requirement.",
      );
    } else {
      experienceScore = 65;
    }
  } else if (jobReqs.seniorityRequired === "Beginner") {
    experienceScore = 90;
  } else {
    experienceScore = isCandidateJunior ? 65 : 85;
  }

  // 6. Responsibilities Compatibility (10% weight component)
  const responsibilityScore = Math.round(
    0.6 * titleScore + 0.4 * technicalSkillsScore,
  );

  // 7. Preferred Skills (5% weight component)
  const preferredSkillsScore =
    jobReqs.preferredSkills.length > 0
      ? Math.round((matchedPrefSet.size / jobReqs.preferredSkills.length) * 100)
      : 80;

  // Mandatory Requirements Check
  let mandatoryRequirementsPassed = true;
  if (!domainCheck.compatible) {
    mandatoryRequirementsPassed = false;
  }
  if (jobReqs.seniorityRequired === "Senior" && isCandidateJunior) {
    mandatoryRequirementsPassed = false;
  }
  // If role explicitly requires technical skills and candidate has 0 matched
  if (jobReqs.requiredSkills.length >= 2 && matchedTechSet.size === 0) {
    mandatoryRequirementsPassed = false;
    rejectionReasons.push("Missing core mandatory required technical skills.");
  }

  return {
    matchedTechnicalSkills: Array.from(matchedTechSet),
    missingRequiredSkills: Array.from(missingReqSet),
    matchedProfessionalSkills: Array.from(matchedProfSet),
    matchedPreferredSkills: Array.from(matchedPrefSet),
    technicalSkillsScore,
    titleScore,
    bioScore,
    professionalSkillsScore,
    experienceScore,
    responsibilityScore,
    preferredSkillsScore,
    mandatoryRequirementsPassed,
    rejectionReasons,
  };
};

// ============================================================================
// 4. ZOD SCHEMAS FOR STRUCTURED GEMINI EVALUATIONS
// ============================================================================

const StrictRecommendationItemSchema = z.object({
  jobId: z.string().describe("Exact ID of the evaluated job"),
  titleCompatibility: z
    .number()
    .min(0)
    .max(100)
    .describe("0-100 score on how well candidate title matches the job title"),
  technicalSkillsCompatibility: z
    .number()
    .min(0)
    .max(100)
    .describe("0-100 score on coverage of required technical skills"),
  professionalSkillsCompatibility: z
    .number()
    .min(0)
    .max(100)
    .describe("0-100 score on soft skills, teamwork, communication, agile"),
  bioCompatibility: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "0-100 contextual alignment between candidate bio and job description",
    ),
  experienceCompatibility: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "0-100 alignment with seniority and experience level requirements",
    ),
  responsibilityCompatibility: z
    .number()
    .min(0)
    .max(100)
    .describe("0-100 capability to handle day-to-day responsibilities"),
  preferredSkillsCompatibility: z
    .number()
    .min(0)
    .max(100)
    .describe("0-100 coverage of preferred/bonus skills"),
  matchedTechnicalSkills: z
    .array(z.string())
    .describe("Candidate technical skills directly matching job requirements"),
  missingRequiredSkills: z
    .array(z.string())
    .describe(
      "Critical mandatory skills required by the job that candidate lacks",
    ),
  matchedProfessionalSkills: z
    .array(z.string())
    .describe("Candidate professional skills matching job needs"),
  matchedPreferredSkills: z
    .array(z.string())
    .describe("Candidate skills matching nice-to-have qualifications"),
  mandatoryRequirementsPassed: z
    .boolean()
    .describe(
      "true ONLY if candidate satisfies all mandatory core skills, domain, and seniority requirements",
    ),
  explanation: z
    .string()
    .describe("Concise 1-2 sentence evidence-based rationale of match quality"),
  rejectionReasons: z
    .array(z.string())
    .describe("Specific shortcomings or reasons if candidate is disqualified"),
});

const StrictRecommendationOutputSchema = z.object({
  evaluations: z.array(StrictRecommendationItemSchema),
});

const StrictCandidateMatchItemSchema = z.object({
  candidateId: z.string().describe("Exact ID of the evaluated candidate"),
  titleCompatibility: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "0-100 score on candidate professional title synergy with job title",
    ),
  technicalSkillsCompatibility: z
    .number()
    .min(0)
    .max(100)
    .describe("0-100 score on coverage of required technical skills"),
  professionalSkillsCompatibility: z
    .number()
    .min(0)
    .max(100)
    .describe("0-100 score on soft skills, teamwork, leadership"),
  bioCompatibility: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "0-100 contextual alignment between candidate bio and job description",
    ),
  experienceCompatibility: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "0-100 alignment with seniority and experience level requirements",
    ),
  responsibilityCompatibility: z
    .number()
    .min(0)
    .max(100)
    .describe("0-100 capability to fulfill job responsibilities"),
  preferredSkillsCompatibility: z
    .number()
    .min(0)
    .max(100)
    .describe("0-100 coverage of preferred/bonus skills"),
  matchedTechnicalSkills: z
    .array(z.string())
    .describe("Candidate technical skills directly matching job requirements"),
  missingRequiredSkills: z
    .array(z.string())
    .describe(
      "Critical mandatory skills required by the job that candidate lacks",
    ),
  matchedProfessionalSkills: z
    .array(z.string())
    .describe("Candidate professional skills matching job needs"),
  matchedPreferredSkills: z
    .array(z.string())
    .describe("Candidate skills matching nice-to-have qualifications"),
  mandatoryRequirementsPassed: z
    .boolean()
    .describe(
      "true ONLY if candidate satisfies all mandatory core skills, domain, and seniority",
    ),
  explanation: z
    .string()
    .describe("Concise 1-2 sentence evidence-based rationale of match quality"),
  rejectionReasons: z
    .array(z.string())
    .describe("Specific shortcomings or reasons if candidate is disqualified"),
});

const StrictCandidateMatchOutputSchema = z.object({
  evaluations: z.array(StrictCandidateMatchItemSchema),
});

// ============================================================================
// 5. UPGRADED HEURISTIC ENGINE (PARITY FALLBACK)
// ============================================================================

const runStrictHeuristicMatching = (
  candidate: {
    title: string;
    skills: string[];
    bio: string;
    socialLinks?: unknown;
    resume?: unknown;
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
  return jobs.map((job) => {
    const evalResult = runDeterministicEvaluation(candidate, job);
    const { finalScore, matchLevel } = computeStrictCompositeScore(
      evalResult.technicalSkillsScore,
      evalResult.titleScore,
      evalResult.bioScore,
      evalResult.professionalSkillsScore,
      evalResult.experienceScore,
      evalResult.responsibilityScore,
      evalResult.preferredSkillsScore,
      evalResult.mandatoryRequirementsPassed,
    );

    let reason = "";
    if (evalResult.matchedTechnicalSkills.length > 0) {
      reason = `Direct match in ${evalResult.matchedTechnicalSkills.slice(0, 3).join(", ")} aligning with role title and responsibilities.`;
    } else if (evalResult.titleScore >= 70) {
      reason = `Strong title alignment with professional focus as ${candidate.title}.`;
    } else if (!evalResult.mandatoryRequirementsPassed) {
      reason =
        evalResult.rejectionReasons[0] ||
        "Does not satisfy mandatory requirements.";
    } else {
      reason = "Moderate background alignment with role domain.";
    }

    return {
      jobId: job.id,
      matchScore: finalScore,
      matchLevel,
      matchedSkills: [
        ...evalResult.matchedTechnicalSkills,
        ...evalResult.matchedProfessionalSkills,
      ],
      missingSkills: evalResult.missingRequiredSkills,
      reason,
      matchedTechnicalSkills: evalResult.matchedTechnicalSkills,
      missingRequiredSkills: evalResult.missingRequiredSkills,
      matchedProfessionalSkills: evalResult.matchedProfessionalSkills,
      matchedPreferredSkills: evalResult.matchedPreferredSkills,
      titleCompatibility: evalResult.titleScore,
      bioCompatibility: evalResult.bioScore,
      experienceCompatibility: evalResult.experienceScore,
      qualificationCompatibility: evalResult.experienceScore,
      responsibilityCompatibility: evalResult.responsibilityScore,
      mandatoryRequirementsPassed: evalResult.mandatoryRequirementsPassed,
      explanation: reason,
      rejectionReasons: evalResult.rejectionReasons,
    };
  });
};

const runStrictHeuristicCandidateMatching = (
  job: {
    title: string;
    description: string;
    level: string;
    jobType: string;
    category?: { name: string } | null;
  },
  candidates: Array<{
    id: string;
    name: string;
    title: string;
    bio: string;
    skills: string[];
    socialLinks?: unknown;
    resume?: unknown;
  }>,
): IAICandidateMatchRaw[] => {
  return candidates.map((candidate) => {
    const evalResult = runDeterministicEvaluation(candidate, job);
    const { finalScore, matchLevel } = computeStrictCompositeScore(
      evalResult.technicalSkillsScore,
      evalResult.titleScore,
      evalResult.bioScore,
      evalResult.professionalSkillsScore,
      evalResult.experienceScore,
      evalResult.responsibilityScore,
      evalResult.preferredSkillsScore,
      evalResult.mandatoryRequirementsPassed,
    );

    let reason = "";
    if (evalResult.matchedTechnicalSkills.length > 0) {
      reason = `Candidate demonstrates verified expertise in ${evalResult.matchedTechnicalSkills.slice(0, 3).join(", ")} directly matching requirements.`;
    } else if (evalResult.titleScore >= 70) {
      reason = `Candidate's title (${candidate.title}) closely aligns with the role title.`;
    } else if (!evalResult.mandatoryRequirementsPassed) {
      reason =
        evalResult.rejectionReasons[0] ||
        "Candidate profile lacks mandatory criteria.";
    } else {
      reason = "Candidate exhibits transferable skills for this opening.";
    }

    return {
      candidateId: candidate.id,
      matchScore: finalScore,
      matchLevel,
      matchedSkills: [
        ...evalResult.matchedTechnicalSkills,
        ...evalResult.matchedProfessionalSkills,
      ],
      missingSkills: evalResult.missingRequiredSkills,
      reason,
      matchedTechnicalSkills: evalResult.matchedTechnicalSkills,
      missingRequiredSkills: evalResult.missingRequiredSkills,
      matchedProfessionalSkills: evalResult.matchedProfessionalSkills,
      matchedPreferredSkills: evalResult.matchedPreferredSkills,
      titleCompatibility: evalResult.titleScore,
      bioCompatibility: evalResult.bioScore,
      experienceCompatibility: evalResult.experienceScore,
      qualificationCompatibility: evalResult.experienceScore,
      responsibilityCompatibility: evalResult.responsibilityScore,
      mandatoryRequirementsPassed: evalResult.mandatoryRequirementsPassed,
      explanation: reason,
      rejectionReasons: evalResult.rejectionReasons,
    };
  });
};

// ============================================================================
// 6. CANDIDATE -> AI JOB RECOMMENDATIONS
// ============================================================================

const getRecommendations = async (
  candidateId: string,
  forceRefresh = false,
): Promise<IRecommendationsResult> => {
  // 1. Fetch Complete Candidate Profile
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
      socialLinks: true,
      resume: true,
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
    take: 40,
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

  // 5. Deterministic Pre-check Map
  const deterministicMap = new Map<string, IDeterministicCheckResult>();
  for (const job of eligibleJobs) {
    deterministicMap.set(job.id, runDeterministicEvaluation(candidate, job));
  }

  // 6. Semantic AI Evaluation via LangChain & Google Gemini
  let rawRecommendations: IAIRecommendationRaw[] = [];
  const geminiApiKey = config.GOOGLE_GEMINI_API_KEY;

  if (geminiApiKey && geminiApiKey.trim().length > 0) {
    try {
      const llm = getGeminiClient(geminiApiKey);

      const structuredLlm = llm.withStructuredOutput(
        StrictRecommendationOutputSchema,
      );

      const jobSummaries = eligibleJobs.map((j) => ({
        id: j.id,
        title: j.title,
        category: j.category?.name || "General",
        level: j.level,
        jobType: j.jobType,
        location: j.location,
        description: j.description
          .replace(/<[^>]*>?/gm, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 1500),
      }));

      // Extract legitimate social/portfolio links if present
      const socialLinksRecord =
        (candidate.socialLinks as Record<string, string>) || {};
      const portfolioEvidence = [
        socialLinksRecord.portfolio
          ? `Portfolio: ${socialLinksRecord.portfolio}`
          : null,
        socialLinksRecord.github ? `GitHub: ${socialLinksRecord.github}` : null,
        candidate.resume?.url ? "Verified PDF Resume on file" : null,
      ]
        .filter(Boolean)
        .join("; ");

      const systemPrompt = `You are a strict, evidence-based technical talent matching AI for HireNest.
Your role is to rigorously evaluate how accurately a Candidate's actual profile matches Job openings.

Scoring Weights:
- Required Technical Skills: 30%
- Professional Title Compatibility: 20%
- Bio / Description Relevance: 15%
- Professional Skills: 10%
- Experience Compatibility: 10%
- Responsibilities Compatibility: 10%
- Preferred Skills: 5%

Strict Matching Rules:
1. Candidate's actual title and technical skills must strongly influence match quality.
2. A candidate with an unrelated background (e.g., Designer applying for Backend, or Mobile Dev for Data Analyst) MUST receive low titleCompatibility (< 30) and mandatoryRequirementsPassed = false.
3. Missing mandatory required skills must prevent Strong (80+) or Excellent (90+) matches and set mandatoryRequirementsPassed = false.
4. Related technologies are NOT automatically equivalent (e.g., Vue is NOT React; Python is NOT Node.js).
5. If mandatory requirements are NOT met, set mandatoryRequirementsPassed = false.
6. Provide a concise 1-2 sentence evidence-based explanation and list specific rejectionReasons if disqualified.`;

      const userPrompt = `CANDIDATE PROFILE:
- Name: ${candidate.name}
- Title: ${candidate.title || "Not specified"}
- Skills: ${(candidate.skills || []).join(", ") || "None specified"}
- Bio: ${candidate.bio || "None provided"}
- Portfolio / Resume Evidence: ${portfolioEvidence || "None provided"}

JOBS TO EVALUATE:
${JSON.stringify(jobSummaries, null, 2)}`;

      const aiResponse = await structuredLlm.invoke([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ]);

      if (aiResponse && Array.isArray(aiResponse.evaluations)) {
        rawRecommendations = aiResponse.evaluations.map((item) => {
          const det = deterministicMap.get(item.jobId);
          const mandatoryPassed =
            item.mandatoryRequirementsPassed &&
            (det ? det.mandatoryRequirementsPassed : true);

          const { finalScore, matchLevel } = computeStrictCompositeScore(
            item.technicalSkillsCompatibility,
            item.titleCompatibility,
            item.bioCompatibility,
            item.professionalSkillsCompatibility,
            item.experienceCompatibility,
            item.responsibilityCompatibility,
            item.preferredSkillsCompatibility,
            mandatoryPassed,
          );

          const matchedSkills = Array.from(
            new Set([
              ...(item.matchedTechnicalSkills || []),
              ...(item.matchedProfessionalSkills || []),
              ...(det?.matchedTechnicalSkills || []),
            ]),
          );

          const missingSkills = Array.from(
            new Set([
              ...(item.missingRequiredSkills || []),
              ...(det?.missingRequiredSkills || []),
            ]),
          );

          return {
            jobId: item.jobId,
            matchScore: finalScore,
            matchLevel,
            matchedSkills,
            missingSkills,
            reason:
              item.explanation || "Evaluated against profile qualifications.",
            matchedTechnicalSkills: item.matchedTechnicalSkills,
            missingRequiredSkills: missingSkills,
            matchedProfessionalSkills: item.matchedProfessionalSkills,
            matchedPreferredSkills: item.matchedPreferredSkills,
            titleCompatibility: item.titleCompatibility,
            bioCompatibility: item.bioCompatibility,
            experienceCompatibility: item.experienceCompatibility,
            qualificationCompatibility: item.experienceCompatibility,
            responsibilityCompatibility: item.responsibilityCompatibility,
            mandatoryRequirementsPassed: mandatoryPassed,
            explanation: item.explanation,
            rejectionReasons: item.rejectionReasons,
          };
        });
      }
    } catch (aiError) {
      console.error(
        "[AI Recommendation] LangChain Gemini evaluation failed, falling back to strict heuristic engine:",
        aiError,
      );
      rawRecommendations = runStrictHeuristicMatching(candidate, eligibleJobs);
    }
  } else {
    rawRecommendations = runStrictHeuristicMatching(candidate, eligibleJobs);
  }

  // 7. Filter, De-duplicate, Rank, and Hydrate
  // Strict rule: Only include matches with matchScore >= 80 (Strong or Excellent Match) and mandatoryPassed
  const seenJobIds = new Set<string>();
  const hydratedRecommendations: IRecommendedJobResponse[] = [];

  for (const rec of rawRecommendations) {
    if (!rec.jobId || seenJobIds.has(rec.jobId)) continue;
    const matchedJob = jobsMap.get(rec.jobId);
    if (!matchedJob) continue;

    // Strict Threshold: Exclude Moderate (70-79) and Weak (<70)
    if (rec.matchScore < 80 || rec.mandatoryRequirementsPassed === false)
      continue;

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
      matchedTechnicalSkills: rec.matchedTechnicalSkills,
      missingRequiredSkills: rec.missingRequiredSkills,
      matchedProfessionalSkills: rec.matchedProfessionalSkills,
      matchedPreferredSkills: rec.matchedPreferredSkills,
      titleCompatibility: rec.titleCompatibility,
      bioCompatibility: rec.bioCompatibility,
      experienceCompatibility: rec.experienceCompatibility,
      qualificationCompatibility: rec.qualificationCompatibility,
      responsibilityCompatibility: rec.responsibilityCompatibility,
      mandatoryRequirementsPassed: rec.mandatoryRequirementsPassed,
      explanation: rec.explanation,
      rejectionReasons: rec.rejectionReasons,
    });
  }

  // Sort descending by match score
  hydratedRecommendations.sort((a, b) => b.matchScore - a.matchScore);

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
          ? "No active job openings currently meet the strict 80% suitability threshold for your profile. Try updating your skills or check back soon."
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

// ============================================================================
// 7. RECRUITER -> AI CANDIDATE MATCHING
// ============================================================================

const matchCandidatesForJob = async (
  companyId: string,
  jobId: string,
  forceRefresh = false,
): Promise<ICandidateMatchingResult> => {
  // 1. Verify Job Existence & Ownership
  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
      companyId,
      isDeleted: false,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!job) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Job vacancy not found or does not belong to your company.",
    );
  }

  // 2. Check Cache
  const jobCacheKey = `job_match_${jobId}`;
  const jobHash = `${job.title}|${job.level}|${job.jobType}|${job.updatedAt.getTime()}`;

  if (!forceRefresh) {
    const cachedEntry = candidateMatchingCache.get(jobCacheKey);
    if (
      cachedEntry &&
      cachedEntry.jobHash === jobHash &&
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

  // 3. Retrieve Eligible Candidate Profiles
  const candidateUsers = await prisma.user.findMany({
    where: {
      role: "candidate",
      isDeleted: false,
      status: "active",
    },
    select: {
      id: true,
      name: true,
      email: true,
      profilePicture: true,
      title: true,
      bio: true,
      skills: true,
      socialLinks: true,
      resume: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
    take: 50,
  });

  // Filter out completely empty profiles
  const eligibleCandidates = candidateUsers.filter(
    (c) =>
      (c.title && c.title.trim().length > 0) ||
      (c.bio && c.bio.trim().length > 0) ||
      (Array.isArray(c.skills) && c.skills.length > 0),
  );

  const formattedJob = {
    id: job.id,
    title: job.title,
    location: job.location,
    level: job.level,
    jobType: job.jobType,
    hiringStatus: job.hiringStatus,
    category: job.category?.name,
  };

  if (eligibleCandidates.length === 0) {
    return {
      jobId: job.id,
      job: formattedJob,
      matches: [],
      meta: {
        total: 0,
        cached: false,
        evaluatedCount: 0,
        timestamp: new Date().toISOString(),
        message: "No active candidate profiles available for matching.",
      },
    };
  }

  const candidatesMap = new Map(
    eligibleCandidates.map((cand) => [cand.id, cand]),
  );

  // 4. Deterministic Pre-check Map
  const deterministicMap = new Map<string, IDeterministicCheckResult>();
  for (const cand of eligibleCandidates) {
    deterministicMap.set(cand.id, runDeterministicEvaluation(cand, job));
  }

  // 5. Semantic AI Candidate Matching via LangChain & Google Gemini
  let rawMatches: IAICandidateMatchRaw[] = [];
  const geminiApiKey = config.GOOGLE_GEMINI_API_KEY;

  if (geminiApiKey && geminiApiKey.trim().length > 0) {
    try {
      const llm = getGeminiClient(geminiApiKey);

      const structuredLlm = llm.withStructuredOutput(
        StrictCandidateMatchOutputSchema,
      );

      const candidateSummaries = eligibleCandidates.map((c) => {
        const socialLinksRecord =
          (c.socialLinks as Record<string, string>) || {};
        const portfolioEvidence = [
          socialLinksRecord.portfolio
            ? `Portfolio: ${socialLinksRecord.portfolio}`
            : null,
          socialLinksRecord.github
            ? `GitHub: ${socialLinksRecord.github}`
            : null,
          c.resume?.url ? "Verified Resume on file" : null,
        ]
          .filter(Boolean)
          .join("; ");

        return {
          id: c.id,
          name: c.name,
          title: c.title || "Not specified",
          skills: c.skills || [],
          bio: (c.bio || "")
            .replace(/<[^>]*>?/gm, " ")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 1000),
          portfolioEvidence: portfolioEvidence || "None provided",
        };
      });

      const systemPrompt = `You are an expert technical talent matching AI for HireNest.
Evaluate how well each Candidate's profile matches the specified Job Posting.

Scoring Weights:
- Required Technical Skills: 30%
- Professional Title Compatibility: 20%
- Bio / Description Relevance: 15%
- Professional Skills: 10%
- Experience Compatibility: 10%
- Responsibilities Compatibility: 10%
- Preferred Skills: 5%

Strict Matching Rules:
1. Candidate's actual title and technical skills must strongly influence match quality.
2. A candidate with an unrelated background (e.g. Graphic Designer for Backend, or Mobile Dev for Data Analyst) MUST receive low titleCompatibility (< 30) and mandatoryRequirementsPassed = false.
3. Missing mandatory required skills must prevent Strong (80+) or Excellent (90+) matches and set mandatoryRequirementsPassed = false.
4. Related technologies are NOT automatically equivalent (Vue is NOT React; Python is NOT Node.js).
5. If mandatory requirements are NOT met, set mandatoryRequirementsPassed = false.
6. Provide a concise 1-2 sentence evidence-based explanation and list specific rejectionReasons if disqualified.`;

      const userPrompt = `JOB VACANCY TO FILL:
- Title: ${job.title}
- Category: ${job.category?.name || "General"}
- Experience Level: ${job.level}
- Employment Type: ${job.jobType}
- Location: ${job.location}
- Description: ${job.description.replace(/<[^>]*>?/gm, " ").slice(0, 1500)}

CANDIDATES TO EVALUATE:
${JSON.stringify(candidateSummaries, null, 2)}`;

      const aiResponse = await structuredLlm.invoke([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ]);

      if (aiResponse && Array.isArray(aiResponse.evaluations)) {
        rawMatches = aiResponse.evaluations.map((item) => {
          const det = deterministicMap.get(item.candidateId);
          const mandatoryPassed =
            item.mandatoryRequirementsPassed &&
            (det ? det.mandatoryRequirementsPassed : true);

          const { finalScore, matchLevel } = computeStrictCompositeScore(
            item.technicalSkillsCompatibility,
            item.titleCompatibility,
            item.bioCompatibility,
            item.professionalSkillsCompatibility,
            item.experienceCompatibility,
            item.responsibilityCompatibility,
            item.preferredSkillsCompatibility,
            mandatoryPassed,
          );

          const matchedSkills = Array.from(
            new Set([
              ...(item.matchedTechnicalSkills || []),
              ...(item.matchedProfessionalSkills || []),
              ...(det?.matchedTechnicalSkills || []),
            ]),
          );

          const missingSkills = Array.from(
            new Set([
              ...(item.missingRequiredSkills || []),
              ...(det?.missingRequiredSkills || []),
            ]),
          );

          return {
            candidateId: item.candidateId,
            matchScore: finalScore,
            matchLevel,
            matchedSkills,
            missingSkills,
            reason: item.explanation || "Matches role requirements.",
            matchedTechnicalSkills: item.matchedTechnicalSkills,
            missingRequiredSkills: missingSkills,
            matchedProfessionalSkills: item.matchedProfessionalSkills,
            matchedPreferredSkills: item.matchedPreferredSkills,
            titleCompatibility: item.titleCompatibility,
            bioCompatibility: item.bioCompatibility,
            experienceCompatibility: item.experienceCompatibility,
            qualificationCompatibility: item.experienceCompatibility,
            responsibilityCompatibility: item.responsibilityCompatibility,
            mandatoryRequirementsPassed: mandatoryPassed,
            explanation: item.explanation,
            rejectionReasons: item.rejectionReasons,
          };
        });
      }
    } catch (aiError) {
      console.error(
        "[AI Candidate Matching] LangChain Gemini evaluation failed, falling back to strict heuristic engine:",
        aiError,
      );
      rawMatches = runStrictHeuristicCandidateMatching(job, eligibleCandidates);
    }
  } else {
    rawMatches = runStrictHeuristicCandidateMatching(job, eligibleCandidates);
  }

  // 6. Filter, Deduplicate, Rank, and Hydrate
  // Strict rule: Only include candidates with matchScore >= 80 (Strong or Excellent Match) and mandatoryPassed
  const seenCandidateIds = new Set<string>();
  const hydratedMatches: ICandidateMatchResponse[] = [];

  for (const match of rawMatches) {
    if (!match.candidateId || seenCandidateIds.has(match.candidateId)) continue;
    const candidateData = candidatesMap.get(match.candidateId);
    if (!candidateData) continue;

    // Strict Threshold: Exclude Moderate (70-79) and Weak (<70)
    if (match.matchScore < 80 || match.mandatoryRequirementsPassed === false)
      continue;

    seenCandidateIds.add(match.candidateId);
    hydratedMatches.push({
      candidateId: match.candidateId,
      matchScore: match.matchScore,
      matchLevel: match.matchLevel,
      matchedSkills: match.matchedSkills,
      missingSkills: match.missingSkills,
      reason: match.reason,
      candidate: {
        id: candidateData.id,
        name: candidateData.name,
        email: candidateData.email,
        profilePicture: candidateData.profilePicture,
        title: candidateData.title,
        bio: candidateData.bio,
        skills: candidateData.skills,
        socialLinks:
          (candidateData.socialLinks as Record<string, string>) || null,
        resume: candidateData.resume?.url || "",
        createdAt: candidateData.createdAt,
      },
      matchedTechnicalSkills: match.matchedTechnicalSkills,
      missingRequiredSkills: match.missingRequiredSkills,
      matchedProfessionalSkills: match.matchedProfessionalSkills,
      matchedPreferredSkills: match.matchedPreferredSkills,
      titleCompatibility: match.titleCompatibility,
      bioCompatibility: match.bioCompatibility,
      experienceCompatibility: match.experienceCompatibility,
      qualificationCompatibility: match.qualificationCompatibility,
      responsibilityCompatibility: match.responsibilityCompatibility,
      mandatoryRequirementsPassed: match.mandatoryRequirementsPassed,
      explanation: match.explanation,
      rejectionReasons: match.rejectionReasons,
    });
  }

  // Sort descending by matchScore
  hydratedMatches.sort((a, b) => b.matchScore - a.matchScore);

  const topMatches = hydratedMatches.slice(0, 20);

  const result: ICandidateMatchingResult = {
    jobId: job.id,
    job: formattedJob,
    matches: topMatches,
    meta: {
      total: topMatches.length,
      cached: false,
      evaluatedCount: eligibleCandidates.length,
      timestamp: new Date().toISOString(),
      message:
        topMatches.length === 0
          ? "No candidates currently meet the strict 80% suitability threshold for this job vacancy."
          : undefined,
    },
  };

  // Cache in memory
  candidateMatchingCache.set(jobCacheKey, {
    result,
    jobHash,
    createdAt: Date.now(),
  });

  return result;
};

const recommendationService = {
  getRecommendations,
  clearCandidateCache,
  matchCandidatesForJob,
  clearJobCandidateMatchingCache,
};

export default recommendationService;
