"use client";

import { StyleDnaEntry } from "@/types";

interface Props {
  entries: StyleDnaEntry[];
}

export default function StyleDnaChart({ entries }: Props) {
  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="space-y-4">
      <h3 className="text-xs tracking-widest uppercase text-stone-400 mb-4">
        Style DNA
      </h3>
      {top3.map((entry, i) => (
        <div key={entry.archetype}>
          <div className="flex justify-between items-baseline mb-1">
            <span
              className={`font-medium tracking-wide ${
                i === 0 ? "text-stone-900 text-base" : "text-stone-700 text-sm"
              }`}
            >
              {entry.name}
            </span>
            <span
              className={`font-light tabular-nums ${
                i === 0 ? "text-stone-900 text-base" : "text-stone-500 text-sm"
              }`}
            >
              {entry.percentage}%
            </span>
          </div>
          <div className="h-0.5 bg-stone-100 rounded-full">
            <div
              className="h-full bg-stone-700 rounded-full transition-all duration-700"
              style={{ width: `${entry.percentage}%` }}
            />
          </div>
        </div>
      ))}
      {rest.length > 0 && (
        <div className="pt-2 space-y-2">
          {rest.map((entry) => (
            <div key={entry.archetype} className="flex justify-between items-center">
              <span className="text-xs text-stone-400 tracking-wide">{entry.name}</span>
              <span className="text-xs text-stone-400 tabular-nums">{entry.percentage}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
