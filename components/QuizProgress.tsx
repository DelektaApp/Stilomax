"use client";

interface Props {
  current: number;
  total: number;
}

export default function QuizProgress({ current, total }: Props) {
  const pct = (current / total) * 100;
  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-stone-400 tracking-wide">
          Round {current} of {total}
        </span>
        <span className="text-sm text-stone-400">{Math.round(pct)}%</span>
      </div>
      <div className="h-0.5 bg-stone-200 rounded-full">
        <div
          className="h-full bg-stone-700 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
