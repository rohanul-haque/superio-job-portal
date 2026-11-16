"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

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
    }),
  );

  return (
    <div className="mt-10 sm:mt-14 pt-4 w-full max-w-5xl mx-auto px-2 sm:px-0">
      <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 text-center mb-4 sm:mb-6">
        Trusted by hiring leaders at top organizations
      </p>

      <div className="relative overflow-hidden w-full">
        {/* Soft edge fades for smooth visual transitions */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 md:w-20 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 md:w-20 bg-gradient-to-l from-white to-transparent z-10" />

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[autoplayPlugin.current]}
          className="w-full"
        >
          <CarouselContent className="-ml-3 sm:-ml-4 items-center">
            {CAROUSEL_COMPANIES.map((company, index) => (
              <CarouselItem
                key={`${company}-${index}`}
                className="pl-3 sm:pl-4 basis-1/2 min-[450px]:basis-1/3 md:basis-1/4 lg:basis-1/6"
              >
                <div className="flex items-center justify-center h-12 sm:h-14 select-none opacity-60 hover:opacity-100 transition-opacity px-2">
                  <span className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-[#0F172A] whitespace-nowrap truncate">
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
