import { ArchetypeSlug, Image, QuizPair, SessionState } from "@/types";

const ALL_ARCHETYPES: ArchetypeSlug[] = [
  "adventure",
  "modern_european",
  "old_money",
  "streetwear",
  "workwear",
];

function getAdjustedScores(state: SessionState): Record<ArchetypeSlug, number> {
  const scores = {} as Record<ArchetypeSlug, number>;
  for (const slug of ALL_ARCHETYPES) {
    const app = state.appearances[slug] || 0;
    const w = state.wins[slug] || 0;
    if (app === 0) {
      scores[slug] = 0;
    } else {
      const winRate = w / app;
      const confidenceFactor = Math.min(app / 8, 1);
      scores[slug] = winRate * confidenceFactor;
    }
  }
  return scores;
}

function rankArchetypes(
  scores: Record<ArchetypeSlug, number>
): ArchetypeSlug[] {
  return [...ALL_ARCHETYPES].sort((a, b) => scores[b] - scores[a]);
}

function pickRandomImage(
  archetype: ArchetypeSlug,
  images: Image[],
  shownIds: Set<string>
): Image | null {
  const candidates = images.filter(
    (img) => img.archetype?.slug === archetype && !shownIds.has(img.id)
  );
  if (candidates.length === 0) {
    // Fall back to any image of this archetype if all have been shown
    const fallbacks = images.filter((img) => img.archetype?.slug === archetype);
    if (fallbacks.length === 0) return null;
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function selectNextPair(
  state: SessionState,
  images: Image[]
): QuizPair | null {
  const round = state.roundNumber;
  const scores = getAdjustedScores(state);
  const ranked = rankArchetypes(scores);

  let archetypeA: ArchetypeSlug;
  let archetypeB: ArchetypeSlug;

  if (round <= 10) {
    // Broad sampling: pick the two least-seen archetypes
    const byAppearance = [...ALL_ARCHETYPES].sort(
      (a, b) => (state.appearances[a] || 0) - (state.appearances[b] || 0)
    );
    archetypeA = byAppearance[0];
    archetypeB = byAppearance[1];
  } else if (round <= 18) {
    // Retesting: one from top 3, one from bottom 2 or under-tested
    const top3 = ranked.slice(0, 3);
    const bottom2 = ranked.slice(3);
    const underTested = ALL_ARCHETYPES.filter(
      (s) => (state.appearances[s] || 0) < 6
    );
    const poolB = underTested.length > 0 ? underTested : bottom2;

    archetypeA = top3[Math.floor(Math.random() * top3.length)];
    const candidatesB = poolB.filter((s) => s !== archetypeA);
    archetypeB =
      candidatesB.length > 0
        ? candidatesB[Math.floor(Math.random() * candidatesB.length)]
        : bottom2[0] !== archetypeA
        ? bottom2[0]
        : bottom2[1] ?? ranked[4];
  } else {
    // Confidence testing: compare top archetypes, bring in under-tested as challenger
    const underTested = ALL_ARCHETYPES.find(
      (s) => (state.appearances[s] || 0) < 8
    );
    const top3 = ranked.slice(0, 3);
    archetypeA = top3[0];
    archetypeB =
      underTested && underTested !== archetypeA
        ? underTested
        : top3[1] !== archetypeA
        ? top3[1]
        : top3[2];
  }

  // Ensure they're different
  if (archetypeA === archetypeB) {
    archetypeB = ALL_ARCHETYPES.find((s) => s !== archetypeA) ?? ALL_ARCHETYPES[1];
  }

  const imageA = pickRandomImage(archetypeA, images, state.shownImageIds);
  const imageB = pickRandomImage(archetypeB, images, state.shownImageIds);

  if (!imageA || !imageB) return null;

  // Randomly assign left/right
  const flip = Math.random() < 0.5;
  return {
    leftImage: flip ? imageB : imageA,
    rightImage: flip ? imageA : imageB,
  };
}

export function initSessionState(sessionId: string): SessionState {
  return {
    sessionId,
    roundNumber: 1,
    appearances: {
      adventure: 0,
      modern_european: 0,
      old_money: 0,
      streetwear: 0,
      workwear: 0,
    },
    wins: {
      adventure: 0,
      modern_european: 0,
      old_money: 0,
      streetwear: 0,
      workwear: 0,
    },
    shownImageIds: new Set(),
    responses: [],
  };
}

export function applyChoice(
  state: SessionState,
  leftImage: Image,
  rightImage: Image,
  chosenImage: Image
): SessionState {
  const chosenSlug = chosenImage.archetype!.slug;
  const leftSlug = leftImage.archetype!.slug;
  const rightSlug = rightImage.archetype!.slug;

  return {
    ...state,
    roundNumber: state.roundNumber + 1,
    appearances: {
      ...state.appearances,
      [leftSlug]: (state.appearances[leftSlug] || 0) + 1,
      [rightSlug]: (state.appearances[rightSlug] || 0) + 1,
    },
    wins: {
      ...state.wins,
      [chosenSlug]: (state.wins[chosenSlug] || 0) + 1,
    },
    shownImageIds: new Set([
      ...state.shownImageIds,
      leftImage.id,
      rightImage.id,
    ]),
  };
}
