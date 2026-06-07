"use client";

import { IdentityProfileResult } from "@/types";

interface Props {
  profile: IdentityProfileResult;
}

export default function IdentityProfile({ profile }: Props) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs tracking-widest uppercase text-stone-400 mb-4">
        Identity Profile
      </h3>
      {profile.entries.map((entry, i) => (
        <div key={entry.cluster} className="flex justify-between items-center">
          <span
            className={`tracking-wide ${
              i === 0 ? "text-stone-800 font-medium" : "text-stone-500 text-sm"
            }`}
          >
            {entry.cluster}
          </span>
          <span
            className={`tabular-nums ${
              i === 0 ? "text-stone-800 font-medium" : "text-stone-400 text-sm"
            }`}
          >
            {entry.percentage}%
          </span>
        </div>
      ))}
    </div>
  );
}
