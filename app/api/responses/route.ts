import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const supabase = createServiceClient();
  const body = await req.json();

  const { sessionId, roundNumber, leftImageId, rightImageId, chosenImageId } = body;

  if (!sessionId || !roundNumber || !leftImageId || !rightImageId || !chosenImageId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { error } = await supabase.from("quiz_responses").insert({
    session_id: sessionId,
    round_number: roundNumber,
    left_image_id: leftImageId,
    right_image_id: rightImageId,
    chosen_image_id: chosenImageId,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
