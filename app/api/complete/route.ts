import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { calculateStyleDna } from "@/lib/scoring";
import { Image } from "@/types";

export async function POST(req: NextRequest) {
  const supabase = createServiceClient();
  const { sessionId } = await req.json();

  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
  }

  // Fetch all responses for this session
  const { data: responses, error: respError } = await supabase
    .from("quiz_responses")
    .select("*")
    .eq("session_id", sessionId);

  if (respError) {
    return NextResponse.json({ error: respError.message }, { status: 500 });
  }

  // Fetch all images with their archetypes
  const { data: images, error: imgError } = await supabase
    .from("images")
    .select("*, archetype:archetypes(*)");

  if (imgError) {
    return NextResponse.json({ error: imgError.message }, { status: 500 });
  }

  const result = calculateStyleDna(responses ?? [], images as Image[]);

  const { error: updateError } = await supabase
    .from("quiz_sessions")
    .update({
      completed_at: new Date().toISOString(),
      result_json: result,
    })
    .eq("id", sessionId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ result });
}
