import {
  ArchetypeSlug,
  QuizResponse,
  StyleDnaResult,
  IdentityProfileResult,
  IdentityCluster,
  Image,
} from "@/types";
import {
  buildStyleDnaEntries,
  getResultLabel,
  getResultDescription,
} from "./resultLabels";

const TARGET_APPEARANCES = 8;

const IDENTITY_MAP: Record<ArchetypeSlug, IdentityCluster> = {
  adventure: "Explorer",
  workwear: "Maker",
  modern_european: "Urban Refined",
  streetwear: "Creative",
  old_money: "Establishment",
};

export function calculateStyleDna(
  responses: QuizResponse[],
  images: Image[]
): StyleDnaResult {
  const imageMap = new Map(images.map((img) => [img.id, img]));

  const wins: Record<ArchetypeSlug, number> = {
    adventure: 0,
    modern_european: 0,
    old_money: 0,
    streetwear: 0,
    workwear: 0,
  };

  const appearances: Record<ArchetypeSlug, number> = {
    adventure: 0,
    modern_european: 0,
    old_money: 0,
    streetwear: 0,
    workwear: 0,
  };

  for (const response of responses) {
    const leftImage = imageMap.get(response.left_image_id);
    const rightImage = imageMap.get(response.right_image_id);
    const chosenImage = imageMap.get(response.chosen_image_id);

    if (!leftImage?.archetype || !rightImage?.archetype || !chosenImage?.archetype) continue;

    const leftSlug = leftImage.archetype.slug;
    const rightSlug = rightImage.archetype.slug;
    const chosenSlug = chosenImage.archetype.slug;

    appearances[leftSlug] = (appearances[leftSlug] || 0) + 1;
    appearances[rightSlug] = (appearances[rightSlug] || 0) + 1;
    wins[chosenSlug] = (wins[chosenSlug] || 0) + 1;
  }

  const adjusted: Record<ArchetypeSlug, number> = {} as Record<ArchetypeSlug, number>;
  const slugs = Object.keys(wins) as ArchetypeSlug[];

  for (const slug of slugs) {
    const app = appearances[slug] || 0;
    const w = wins[slug] || 0;
    if (app === 0) {
      adjusted[slug] = 0;
    } else {
      const winRate = w / app;
      const confidenceFactor = Math.min(app / TARGET_APPEARANCES, 1);
      adjusted[slug] = Math.max(winRate * confidenceFactor, 0);
    }
  }

  const total = slugs.reduce((sum, slug) => sum + adjusted[slug], 0);
  const normalized: Record<ArchetypeSlug, number> = {} as Record<ArchetypeSlug, number>;
  for (const slug of slugs) {
    normalized[slug] = total > 0 ? (adjusted[slug] / total) * 100 : 20;
  }

  const entries = buildStyleDnaEntries(normalized);
  const primaryArchetype = entries[0].archetype;
  const secondaryArchetype = entries[1].archetype;

  return {
    entries,
    primaryArchetype,
    secondaryArchetype,
    resultLabel: getResultLabel(primaryArchetype, secondaryArchetype),
    resultDescription: getResultDescription(primaryArchetype),
  };
}

export function calculateIdentityProfile(
  styleDna: StyleDnaResult
): IdentityProfileResult {
  const entries = styleDna.entries.map((entry) => ({
    cluster: IDENTITY_MAP[entry.archetype],
    percentage: entry.percentage,
  }));
  return { entries };
}
