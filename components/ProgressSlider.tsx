"use client";

import * as RadixSlider from "@radix-ui/react-slider";
import { useCallback, useEffect, useRef, useState } from "react";

interface ProgressSliderProps {
  value?: number;
  onChange?: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  max?: number;
  className?: string;
}

const ProgressSlider: React.FC<ProgressSliderProps> = ({
  value = 0,
  onChange,
  onChangeEnd,
  max = 1,
  className = ""
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [sliderValue, setSliderValue] = useState(value);
  const [tooltipValue, setTooltipValue] = useState(value);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDragging) {
      setSliderValue(value);
    }
  }, [value, isDragging]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (trackRef.current) {
        const rect = trackRef.current.getBoundingClientRect();
        const percent = Math.min(
          Math.max((e.clientX - rect.left) / rect.width, 0),
          1
        );
        setTooltipValue(percent * max);
      }
    },
    [max]
  );

  const handleValueChange = useCallback((values: number[]) => {
    const newValue = values[0];
    setSliderValue(newValue);
  }, []);

  const handleValueCommit = useCallback(
    (values: number[]) => {
      const newValue = values[0];
      onChange?.(newValue);
      onChangeEnd?.(newValue);
      setIsDragging(false);
    },
    [onChange, onChangeEnd]
  );

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full"
      onMouseMove={handleMouseMove}
    >
      <RadixSlider.Root
        className={`relative flex items-center select-none touch-none w-full h-2 ${className}`}
        value={[sliderValue]}
        onValueChange={handleValueChange}
        onValueCommit={handleValueCommit}
        onPointerDown={handleDragStart}
        max={max}
        step={0.1}
        aria-label="Progress"
      >
        <RadixSlider.Track
          className="bg-neutral-600 relative grow rounded-full h-[2px] cursor-pointer"
          ref={trackRef}
        >
          <RadixSlider.Range
            className={`absolute rounded-full h-full transition-colors ${
              isDragging || isHovered ? "bg-green-500" : "bg-white"
            }`}
          />
        </RadixSlider.Track>

        {(isHovered || isDragging) && (
          <RadixSlider.Thumb
            className={`block w-3 h-3 bg-white rounded-full transition-transform hover:scale-110 focus:outline-none ${
              isDragging ? "scale-110" : "scale-100"
            }`}
            aria-label="Progress"
          />
        )}

        {isHovered && !isDragging && (
          <div
            className="absolute top-[-40px] bg-slate-700 text-white px-2 py-1 rounded text-sm pointer-events-none"
            style={{
              left: `calc(${(tooltipValue / max) * 100}% - 20px)`,
              transform: "translateX(0)",
              transition: "none"
            }}
          >
            {formatTime(tooltipValue)}
          </div>
        )}
      </RadixSlider.Root>
    </div>
  );
};

export default ProgressSlider;
