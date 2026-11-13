"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";

export interface CalendarProps {
  mode?: "single";
  selected?: Date | undefined;
  onSelect?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
  initialFocus?: boolean;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function Calendar({
  selected,
  onSelect,
  disabled,
  className,
}: CalendarProps) {
  const [viewDate, setViewDate] = React.useState<Date>(() => {
    return selected ? new Date(selected) : new Date();
  });

  // Keep viewDate in sync if selected changes
  React.useEffect(() => {
    if (selected) {
      setViewDate(new Date(selected));
    }
  }, [selected]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setViewDate(new Date(year, month + 1, 1));
  };

  // Days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // First day of current month (0: Sunday, 1: Monday, ...)
  const firstDayWeekday = new Date(year, month, 1).getDay();

  // Days in previous month
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Grid cells (previous month trailing days, current month days, next month leading days)
  const days: { date: Date; isCurrentMonth: boolean }[] = [];

  // Trailing days from previous month
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({
      date: new Date(year, month, d),
      isCurrentMonth: true,
    });
  }

  // Trailing days to fill 35 or 42 cells (multiples of 7)
  const remaining = 7 - (days.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      days.push({
        date: new Date(year, month + 1, d),
        isCurrentMonth: false,
      });
    }
  }

  const today = new Date();

  return (
    <div className={cn("p-2 select-none w-72", className)}>
      {/* Month & Navigation Header */}
      <div className="flex items-center justify-between pb-3 px-1">
        <h4 className="text-xs font-bold text-slate-900">
          {MONTH_NAMES[month]} {year}
        </h4>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous month"
            onClick={handlePrevMonth}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={handleNextMonth}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {WEEKDAYS.map((day) => (
          <span
            key={day}
            className="text-[11px] font-semibold text-slate-400 py-1"
          >
            {day}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1" role="grid">
        {days.map(({ date, isCurrentMonth }, index) => {
          const isDateSelected = !!selected && isSameDay(date, selected);
          const isDateToday = isSameDay(date, today);
          const isDateDisabled =
            !isCurrentMonth || (disabled ? disabled(date) : false);

          return (
            <button
              key={index}
              type="button"
              disabled={isDateDisabled}
              aria-selected={isDateSelected}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isDateDisabled) {
                  onSelect?.(date);
                }
              }}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg text-xs transition-colors font-medium cursor-pointer",
                !isCurrentMonth && "text-slate-300 opacity-40 cursor-default pointer-events-none",
                isCurrentMonth &&
                  !isDateSelected &&
                  !isDateDisabled &&
                  "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                isDateToday &&
                  !isDateSelected &&
                  "border border-blue-600 text-blue-600 font-semibold",
                isDateSelected &&
                  "bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-xs",
                isDateDisabled &&
                  isCurrentMonth &&
                  "text-slate-300 cursor-not-allowed opacity-50 hover:bg-transparent"
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

