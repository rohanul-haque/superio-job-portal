import Spinner from "@/components/ui/spinner";
import React from "react";

interface PageSpinnerProps {
  message?: string;
}

function PageSpinner({
  message = "Loading...",
}: PageSpinnerProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 p-8 text-center">
      <Spinner size="lg" className="text-purple-600" />
      {message && (
        <p className="text-sm font-medium text-slate-500 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}

export default PageSpinner;
