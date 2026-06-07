export type ArchetypeSlug =
  | "adventure"
  | "modern_european"
  | "old_money"
  | "streetwear"
  | "workwear";

export type IdentityCluster =
  | "Explorer"
  | "Maker"
  | "Urban Refined"
  | "Creative"
  | "Establishment";

export interface VisualScores {
  formal: number;
  classic: number;
  minimalist: number;
  refined: number;
  practical: number;
  urban: number;
  visibility: number;
  tailored: number;
}

export interface PsychScores {
  adventure: number;
  status: number;
  creativity: number;
  tradition: number;
  practicality: number;
  individualism: number;
  social: number;
}

export interface Archetype {
  id: string;
  slug: ArchetypeSlug;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Image {
  id: string;
  archetype_id: string;
  slug: string;
  image_url: string;
  prompt: string | null;
  created_at: string;
  archetype?: Archetype;
  visual_scores?: VisualScores;
  psych_scores?: PsychScores;
}

export interface QuizSession {
  id: string;
  created_at: string;
  completed_at: string | null;
  result_json: StyleDnaResult | null;
  accuracy_rating: number | null;
}

export interface QuizResponse {
  id: string;
  session_id: string;
  round_number: number;
  left_image_id: string;
  right_image_id: string;
  chosen_image_id: string;
  created_at: string;
}

export interface StyleDnaEntry {
  archetype: ArchetypeSlug;
  name: string;
  percentage: number;
}

export interface StyleDnaResult {
  entries: StyleDnaEntry[];
  resultLabel: string;
  resultDescription: string;
  primaryArchetype: ArchetypeSlug;
  secondaryArchetype: ArchetypeSlug;
}

export interface IdentityEntry {
  cluster: IdentityCluster;
  percentage: number;
}

export interface IdentityProfileResult {
  entries: IdentityEntry[];
}

export interface QuizPair {
  leftImage: Image;
  rightImage: Image;
}

export interface SessionState {
  sessionId: string;
  roundNumber: number;
  appearances: Record<ArchetypeSlug, number>;
  wins: Record<ArchetypeSlug, number>;
  shownImageIds: Set<string>;
  responses: QuizResponse[];
}
