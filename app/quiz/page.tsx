"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { selectNextPair, initSessionState, applyChoice } from "@/lib/quizEngine";
import { Image as ImageType, QuizPair, SessionState } from "@/types";
import OutfitCard from "@/components/OutfitCard";
import QuizProgress from "@/components/QuizProgress";

const TOTAL_ROUNDS = 25;

export default function QuizPage() {
  const router = useRouter();
  const [images, setImages] = useState<ImageType[]>([]);
  const [sessionState, setSessionState] = useState<SessionState | null>(null);
  const [currentPair, setCurrentPair] = useState<QuizPair | null>(null);
  const [loading, setLoading] = useState(true);
  const [choosing, setChoosing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load images and create session on mount
  useEffect(() => {
    async function init() {
      const { data: imgs, error: imgError } = await supabase
        .from("images")
        .select("*, archetype:archetypes(*)");

      if (imgError || !imgs || imgs.length === 0) {
        setError("Could not load quiz images. Make sure the database is seeded.");
        setLoading(false);
        return;
      }

      setImages(imgs as ImageType[]);

      const res = await fetch("/api/sessions", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setError("Could not create quiz session.");
        setLoading(false);
        return;
      }

      const state = initSessionState(data.sessionId);
      setSessionState(state);

      const pair = selectNextPair(state, imgs as ImageType[]);
      setCurrentPair(pair);
      setLoading(false);
    }

    init();
  }, []);

  const handleChoice = useCallback(
    async (chosen: ImageType) => {
      if (!sessionState || !currentPair || choosing) return;
      setChoosing(true);

      const { leftImage, rightImage } = currentPair;

      // Persist response
      await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionState.sessionId,
          roundNumber: sessionState.roundNumber,
          leftImageId: leftImage.id,
          rightImageId: rightImage.id,
          chosenImageId: chosen.id,
        }),
      });

      const newState = applyChoice(sessionState, leftImage, rightImage, chosen);

      if (newState.roundNumber > TOTAL_ROUNDS) {
        // Complete the quiz
        const res = await fetch("/api/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sessionState.sessionId }),
        });

        if (res.ok) {
          router.push(`/results/${sessionState.sessionId}`);
        } else {
          setError("Something went wrong calculating your results.");
          setChoosing(false);
        }
        return;
      }

      const nextPair = selectNextPair(newState, images);
      setSessionState(newState);
      setCurrentPair(nextPair);
      setChoosing(false);
    },
    [sessionState, currentPair, choosing, images, router]
  );

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-stone-400 text-sm tracking-wide">Loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center space-y-4">
          <p className="text-stone-500">{error}</p>
          <a href="/" className="text-sm underline text-stone-400">Go home</a>
        </div>
      </main>
    );
  }

  if (!currentPair || !sessionState) return null;

  const round = sessionState.roundNumber;

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-2xl space-y-8">
        <QuizProgress current={round} total={TOTAL_ROUNDS} />

        <p className="text-center text-stone-500 text-sm tracking-wide">
          Which look would you rather wear?
        </p>

        <div className="flex gap-4 sm:gap-6">
          <OutfitCard
            image={currentPair.leftImage}
            onSelect={() => handleChoice(currentPair.leftImage)}
            disabled={choosing}
          />
          <OutfitCard
            image={currentPair.rightImage}
            onSelect={() => handleChoice(currentPair.rightImage)}
            disabled={choosing}
          />
        </div>
      </div>
    </main>
  );
}
