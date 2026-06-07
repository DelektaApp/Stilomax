"use client";

import { useState } from "react";
import AccuracyRating from "@/components/AccuracyRating";

interface Props {
  sessionId: string;
  existingRating: number | null;
}

export default function AccuracyRatingClient({ sessionId, existingRating }: Props) {
  const [submitted, setSubmitted] = useState(!!existingRating);

  async function handleRate(rating: number) {
    await fetch("/api/accuracy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, rating }),
    });
    setSubmitted(true);
  }

  return <AccuracyRating onRate={handleRate} submitted={submitted} />;
}
