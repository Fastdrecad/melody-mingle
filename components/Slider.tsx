"use client";

import * as RadixSlider from "@radix-ui/react-slider";
import { useState } from "react";

interface SliderProps {
  value?: number;
  onChange?: (value: number) => void;
  showThumb?: boolean;
}

const Slider: React.FC<SliderProps> = ({
  value = 1,
  onChange,
  showThumb = true
}) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <RadixSlider.Root
      className="relative flex items-center select-none touch-none w-full h-10 cursor-pointer"
      defaultValue={[1]}
      value={[value]}
      onValueChange={(values) => onChange?.(values[0])}
      onPointerDown={() => setIsDragging(true)}
      onPointerUp={() => setIsDragging(false)}
      max={1}
      step={0.01}
      aria-label="Volume"
    >
      <RadixSlider.Track className="bg-neutral-600 relative grow rounded-full h-[3px]">
        <RadixSlider.Range
          className={`absolute rounded-full h-full transition-colors ${
            isDragging || showThumb ? "bg-green-500" : "bg-white"
          }`}
        />
      </RadixSlider.Track>
      {(showThumb || isDragging) && (
        <RadixSlider.Thumb
          className={`
            block w-3 h-3 bg-white rounded-full 
            transition-transform
            hover:scale-110 focus:outline-none
            ${isDragging ? "scale-110" : "scale-100"}
          `}
          aria-label="Volume"
        />
      )}
    </RadixSlider.Root>
  );
};

export default Slider;
