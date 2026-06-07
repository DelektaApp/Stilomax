"use client";

import { StyleDnaResult } from "@/types";

interface Props {
  result: StyleDnaResult;
}

export default function ResultSummary({ result }: Props) {
  return (
    <div className="text-center max-w-lg mx-auto">
      <p className="text-xs tracking-widest uppercase text-stone-400 mb-3">
        Your Style
      </p>
      <h1 className="text-3xl font-light text-stone-900 tracking-tight mb-6">
        {result.resultLabel}
      </h1>
      <p className="text-stone-500 leading-relaxed text-sm">
        {result.resultDescription}
      </p>
    </div>
  );
}
