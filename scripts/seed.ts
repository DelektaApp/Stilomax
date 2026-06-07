import { createClient } from "@supabase/supabase-js";
import { ARCHETYPE_BASE_SCORES, IMAGE_PROMPTS } from "../lib/seedData";
import { ArchetypeSlug } from "../types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, serviceRoleKey);

const ARCHETYPES: { slug: ArchetypeSlug; name: string; description: string }[] = [
  {
    slug: "adventure",
    name: "Adventure",
    description:
      "Capable, practical, and ready for movement. Outdoor-inspired pieces, technical fabrics, rugged simplicity.",
  },
  {
    slug: "modern_european",
    name: "Modern European",
    description:
      "Clean, contemporary clothing that looks considered without appearing overdone. Urban, refined, versatile.",
  },
  {
    slug: "old_money",
    name: "Old Money",
    description:
      "Timeless refinement. Classic tailoring, heritage pieces, understated signals of polish.",
  },
  {
    slug: "streetwear",
    name: "Streetwear",
    description:
      "Expressive, urban clothing with cultural energy. Bold silhouettes, sneakers, relaxed proportions.",
  },
  {
    slug: "workwear",
    name: "Workwear",
    description:
      "Honest, durable, useful. Denim, canvas, boots, chore coats, pieces that look better with age.",
  },
];

async function seed() {
  console.log("Seeding archetypes...");

  const { data: archetypeRows, error: archetypeError } = await supabase
    .from("archetypes")
    .upsert(ARCHETYPES, { onConflict: "slug" })
    .select();

  if (archetypeError) {
    console.error("Error seeding archetypes:", archetypeError);
    process.exit(1);
  }

  console.log(`Seeded ${archetypeRows?.length} archetypes`);

  const archetypeMap = new Map(
    archetypeRows!.map((a: { slug: string; id: string }) => [a.slug, a.id])
  );

  console.log("Seeding images...");

  for (const slug of Object.keys(IMAGE_PROMPTS) as ArchetypeSlug[]) {
    const archetypeId = archetypeMap.get(slug);
    if (!archetypeId) continue;

    const prompts = IMAGE_PROMPTS[slug];
    const scores = ARCHETYPE_BASE_SCORES[slug];

    for (let i = 0; i < prompts.length; i++) {
      const imageSlug = `${slug}_${String(i + 1).padStart(2, "0")}`;
      const imageUrl = `/images/placeholders/${imageSlug}.png`;
      const fullPrompt = `${prompts[i]} Full-body male fashion illustration, neutral standing pose, adult male age 35-45, average build, face minimally detailed, white background, no props, no text, no logos, no scenery, consistent lighting, editorial fashion illustration, clean modern drawing style, clothing is the focus.`;

      const { data: imageRow, error: imageError } = await supabase
        .from("images")
        .upsert(
          {
            archetype_id: archetypeId,
            slug: imageSlug,
            image_url: imageUrl,
            prompt: fullPrompt,
          },
          { onConflict: "slug" }
        )
        .select()
        .single();

      if (imageError) {
        console.error(`Error seeding image ${imageSlug}:`, imageError);
        continue;
      }

      await supabase
        .from("image_visual_scores")
        .upsert({ image_id: imageRow.id, ...scores.visual }, { onConflict: "image_id" });

      await supabase
        .from("image_psych_scores")
        .upsert({ image_id: imageRow.id, ...scores.psych }, { onConflict: "image_id" });

      process.stdout.write(".");
    }
  }

  console.log("\nSeed complete.");
}

seed().catch(console.error);
