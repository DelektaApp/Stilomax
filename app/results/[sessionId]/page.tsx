import { createServiceClient } from "@/lib/supabase";
import { calculateIdentityProfile } from "@/lib/scoring";
import { StyleDnaResult } from "@/types";
import ResultSummary from "@/components/ResultSummary";
import StyleDnaChart from "@/components/StyleDnaChart";
import IdentityProfile from "@/components/IdentityProfile";
import AccuracyRatingClient from "./AccuracyRatingClient";
import Link from "next/link";

interface Props {
  params: Promise<{ sessionId: string }>;
}

export default async function ResultsPage({ params }: Props) {
  const { sessionId } = await params;
  const supabase = createServiceClient();

  const { data: session, error } = await supabase
    .from("quiz_sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (error || !session || !session.result_json) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center space-y-4">
          <p className="text-stone-500">Results not found.</p>
          <Link href="/" className="text-sm underline text-stone-400">
            Start over
          </Link>
        </div>
      </main>
    );
  }

  const result = session.result_json as StyleDnaResult;
  const identity = calculateIdentityProfile(result);

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-16">
      <div className="w-full max-w-md space-y-14">
        <ResultSummary result={result} />

        <div className="h-px bg-stone-200" />

        <StyleDnaChart entries={result.entries} />

        <div className="h-px bg-stone-200" />

        <IdentityProfile profile={identity} />

        <div className="h-px bg-stone-200" />

        <AccuracyRatingClient
          sessionId={sessionId}
          existingRating={session.accuracy_rating}
        />

        <div className="text-center">
          <Link
            href="/quiz"
            className="text-xs text-stone-400 underline tracking-wide hover:text-stone-600"
          >
            Take the quiz again
          </Link>
        </div>
      </div>
    </main>
  );
}
