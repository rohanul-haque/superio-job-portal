import AboutClient from "@/components/about/AboutClient";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "About Us — Hirenest Job Portal",
  description:
    "Learn about Hirenest recruitment ecosystem connecting candidates, employers, and administrators globally.",
};

export default function AboutPage() {
  return <AboutClient />;
}
