-- Enable RLS on all tables
ALTER TABLE archetypes ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_visual_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_psych_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

-- Reference tables: public read, no writes from anon
CREATE POLICY "public read archetypes"
  ON archetypes FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "public read images"
  ON images FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "public read image_visual_scores"
  ON image_visual_scores FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "public read image_psych_scores"
  ON image_psych_scores FOR SELECT TO anon, authenticated USING (true);

-- quiz_sessions: anon can create, read, and update (no delete)
-- SELECT/UPDATE are unrestricted by row because sessions have unguessable UUID IDs
-- and the client holds its own session ID. No user auth exists yet.
CREATE POLICY "anon can insert quiz sessions"
  ON quiz_sessions FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon can select quiz sessions"
  ON quiz_sessions FOR SELECT TO anon USING (true);

CREATE POLICY "anon can update quiz sessions"
  ON quiz_sessions FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- quiz_responses: anon can insert only
CREATE POLICY "anon can insert quiz responses"
  ON quiz_responses FOR INSERT TO anon WITH CHECK (true);
