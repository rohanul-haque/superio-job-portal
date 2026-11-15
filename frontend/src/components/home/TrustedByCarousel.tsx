"use client";

import React, { useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const PARTNER_COMPANIES = [
  "Google",
  "Microsoft",
  "Amazon",
  "Spotify",
  "Airbnb",
  "Stripe",
];

// Replicate list to guarantee smooth continuous looping across all viewports
const CAROUSEL_COMPANIES = [
  ...PARTNER_COMPANIES,
  ...PARTNER_COMPANIES,
  ...PARTNER_COMPANIES,
];

export default function TrustedByCarousel() {
  const autoplayPlugin = useRef(
    Autoplay({
      delay: 2000,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
    })
  );

  return (
    <div className="mt-14 border-t border-[#E5E7EB] pt-8 w-full max-w-5xl mx-auto">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 text-center mb-6">
        Trusted by hiring leaders at top organizations
      </p>

      <div className="relative overflow-hidden w-full">
        {/* Soft edge fades for smooth visual transitions */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-white to-transparent z-10" />

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[autoplayPlugin.current]}
          className="w-full"
        >
          <CarouselContent className="-ml-4 items-center">
            {CAROUSEL_COMPANIES.map((company, index) => (
              <CarouselItem
                key={`${company}-${index}`}
                className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
              >
                <div className="flex items-center justify-center h-14 select-none opacity-60 hover:opacity-100 transition-opacity">
                  <span className="text-lg sm:text-xl font-bold tracking-tight text-[#0F172A]">
                    {company}
                  </span>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}

