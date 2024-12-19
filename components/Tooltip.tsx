"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";

interface TooltipProps {
  children: React.ReactNode;
  text: string;
  delay?: number;
}

const Tooltip: React.FC<TooltipProps> = ({ children, text, delay = 0.3 }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      <div
        className={twMerge(
          "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 transition-all duration-200",
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-1 pointer-events-none"
        )}
      >
        <div className="px-2 py-1 text-xs text-white bg-neutral-800 rounded-md whitespace-nowrap">
          {text}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-neutral-800" />
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
