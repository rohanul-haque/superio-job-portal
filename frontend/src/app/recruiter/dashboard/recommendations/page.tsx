import { AIRecommendationsTeaser } from "@/components/recruiter/recommendations/AIRecommendationsTeaser";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "AI Candidate Recommendations — HireNest",
  description: "Automated semantic profile-to-job matching, candidate suitability scoring, and intelligent resume insights.",
};

export default function RecruiterRecommendationsPage() {
  return <AIRecommendationsTeaser />;
}
