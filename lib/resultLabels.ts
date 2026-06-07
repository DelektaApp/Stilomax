import { ArchetypeSlug, StyleDnaEntry } from "@/types";

const RESULT_TITLES: Partial<Record<ArchetypeSlug, Partial<Record<ArchetypeSlug, string>>>> = {
  adventure: {
    workwear: "Adventure Explorer",
    modern_european: "Urban Adventurer",
    old_money: "Classic Adventurer",
    streetwear: "Street Explorer",
  },
  modern_european: {
    adventure: "Modern European Explorer",
    old_money: "Refined European Classic",
    workwear: "European Utility",
    streetwear: "Urban European",
  },
  workwear: {
    adventure: "Rugged Explorer",
    old_money: "Traditional Utility",
    modern_european: "Urban Craftsman",
    streetwear: "Street Utility",
  },
  old_money: {
    modern_european: "Refined Classic",
    workwear: "Country Traditionalist",
    adventure: "Heritage Explorer",
    streetwear: "Classic Disruptor",
  },
  streetwear: {
    modern_european: "Urban Creative",
    workwear: "Street Utility",
    adventure: "Street Explorer",
    old_money: "Creative Classicist",
  },
};

const ARCHETYPE_DESCRIPTIONS: Record<ArchetypeSlug, string> = {
  adventure:
    "You are drawn to clothes that feel capable, practical, and ready for movement. Your style leans functional rather than flashy, with a strong preference for outdoor-inspired pieces, technical fabrics, and rugged simplicity.",
  modern_european:
    "You prefer clean, contemporary clothing that looks considered without appearing overdone. Your style is urban, refined, and versatile, with a strong preference for understated pieces that work across many situations.",
  old_money:
    "You are drawn to tradition, refinement, and clothes that feel timeless rather than trendy. Your style favors classic tailoring, heritage pieces, and understated signals of polish and belonging.",
  streetwear:
    "You are drawn to expressive, urban clothing with cultural energy. Your style favors bold silhouettes, sneakers, relaxed proportions, and clothes that feel current, creative, and socially aware.",
  workwear:
    "You prefer clothing that feels honest, durable, and useful. Your style leans rugged and practical, with a preference for denim, canvas, boots, chore coats, and pieces that look better with age.",
};

const ARCHETYPE_NAMES: Record<ArchetypeSlug, string> = {
  adventure: "Adventure",
  modern_european: "Modern European",
  old_money: "Old Money",
  streetwear: "Streetwear",
  workwear: "Workwear",
};

export function getArchetypeName(slug: ArchetypeSlug): string {
  return ARCHETYPE_NAMES[slug];
}

export function getResultLabel(top: ArchetypeSlug, second: ArchetypeSlug): string {
  return RESULT_TITLES[top]?.[second] ?? `${ARCHETYPE_NAMES[top]} Style`;
}

export function getResultDescription(topArchetype: ArchetypeSlug): string {
  return ARCHETYPE_DESCRIPTIONS[topArchetype];
}

export function buildStyleDnaEntries(
  normalized: Record<ArchetypeSlug, number>
): StyleDnaEntry[] {
  const slugs = Object.keys(normalized) as ArchetypeSlug[];
  return slugs
    .map((slug) => ({
      archetype: slug,
      name: ARCHETYPE_NAMES[slug],
      percentage: Math.round(normalized[slug]),
    }))
    .sort((a, b) => b.percentage - a.percentage);
}
