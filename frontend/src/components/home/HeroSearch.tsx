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
    <div className="mx-auto w-full max-w-3xl">
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row items-center gap-2 rounded-2xl border border-slate-200/90 bg-white p-2.5 shadow-xl shadow-slate-200/40"
      >
        {/* Keyword Input */}
        <div className="relative flex flex-1 items-center w-full px-3">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <Input
            type="text"
            placeholder="Job title, keywords, or company..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="border-0 shadow-none focus-visible:ring-0 text-sm placeholder:text-slate-400 pl-2.5 h-11"
          />
        </div>

        <div className="hidden sm:block h-8 w-px bg-slate-200" />

        {/* Location Input */}
        <div className="relative flex flex-1 items-center w-full px-3">
          <MapPin className="h-5 w-5 text-slate-400 shrink-0" />
          <Input
            type="text"
            placeholder="City, state, or 'Remote'..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border-0 shadow-none focus-visible:ring-0 text-sm placeholder:text-slate-400 pl-2.5 h-11"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="h-11 w-full sm:w-auto px-7 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shrink-0 cursor-pointer"
        >
          Find Jobs
        </Button>
      </form>

      {/* Popular Search Tags */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
        <span className="font-semibold text-slate-700">Popular Searches:</span>
        {["Frontend", "Node.js", "Full-time", "Remote", "DevOps", "UI/UX"].map(
          (tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleQuickTag(tag)}
              className="rounded-full bg-slate-100/80 px-2.5 py-1 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer"
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

