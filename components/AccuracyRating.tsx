"use client";

import { useState } from "react";

interface Props {
  onRate: (rating: number) => void;
  submitted?: boolean;
}

export default function AccuracyRating({ onRate, submitted }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  function handleSelect(rating: number) {
    if (submitted) return;
    setSelected(rating);
    onRate(rating);
  }

  return (
    <div className="text-center">
      <p className="text-sm text-stone-500 tracking-wide mb-4">
        How accurate does this feel?
      </p>
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => handleSelect(n)}
            disabled={submitted}
            className={`w-10 h-10 rounded-sm text-sm font-medium border transition-all duration-150 ${
              selected === n
                ? "bg-stone-900 border-stone-900 text-white"
                : "border-stone-300 text-stone-500 hover:border-stone-500 hover:text-stone-700"
            } disabled:cursor-default`}
          >
            {n}
          </button>
        ))}
      </div>
      {submitted && selected && (
        <p className="text-xs text-stone-400 mt-3 tracking-wide">
          Thank you
        </p>
      )}
    </div>
  );
}
