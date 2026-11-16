"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export const HeroSearch: React.FC = () => {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("keyword", keyword.trim());
    if (location.trim()) params.set("location", location.trim());

    const queryString = params.toString();
    router.push(queryString ? `/all-jobs?${queryString}` : "/all-jobs");
  };

  const handleQuickTag = (tag: string) => {
    router.push(`/all-jobs?keyword=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-2 sm:px-0">
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 rounded-2xl border border-[#E5E7EB] bg-white p-2 sm:p-2.5 shadow-none w-full"
      >
        {/* Keyword Input */}
        <div className="relative flex flex-1 items-center w-full px-3 h-11 sm:h-11 border-b sm:border-b-0 border-[#E5E7EB]">
          <Search className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-slate-400 shrink-0" />
          <Input
            type="text"
            placeholder="Job title, keywords, or company..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="border-0 shadow-none focus-visible:ring-0 text-xs sm:text-sm placeholder:text-slate-400 pl-2.5 h-full w-full bg-transparent"
          />
        </div>

        {/* Divider for desktop */}
        <div className="hidden sm:block h-8 w-px bg-[#E5E7EB] shrink-0 mx-1" />

        {/* Location Input */}
        <div className="relative flex flex-1 items-center w-full px-3 h-11 sm:h-11">
          <MapPin className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-slate-400 shrink-0" />
          <Input
            type="text"
            placeholder="City, state, or 'Remote'..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border-0 shadow-none focus-visible:ring-0 text-xs sm:text-sm placeholder:text-slate-400 pl-2.5 h-full w-full bg-transparent"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="h-11 w-full sm:w-auto px-6 sm:px-8 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-medium rounded-xl sm:rounded-full shrink-0 cursor-pointer text-xs sm:text-sm shadow-none"
        >
          Find Jobs
        </Button>
      </form>

      {/* Popular Search Tags */}
      <div className="mt-3.5 sm:mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-500">
        <span className="font-medium text-[#0F172A]">Popular Searches:</span>
        {["Frontend", "Node.js", "Full-time", "Remote", "DevOps", "UI/UX"].map(
          (tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleQuickTag(tag)}
              className="rounded-full bg-[#EEF2FF] px-2.5 sm:px-3 py-1 text-[#4F46E5] hover:bg-[#4F46E5] hover:text-white transition cursor-pointer font-medium"
            >
              {tag}
            </button>
          ),
        )}
      </div>
    </div>
  );
};

export default HeroSearch;
