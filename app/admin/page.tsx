import { createServiceClient } from "@/lib/supabase";
import Link from "next/link";

export default async function AdminPage() {
  const supabase = createServiceClient();

  const [{ data: imageStats }, { data: sessions }, { data: archetypes }] =
    await Promise.all([
      supabase
        .from("image_stats")
        .select("*")
        .order("archetype_slug")
        .order("slug"),
      supabase
        .from("quiz_sessions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50),
      supabase.from("archetypes").select("*").order("name"),
    ]);

  const completedSessions = sessions?.filter((s) => s.completed_at) ?? [];
  const avgRating =
    completedSessions.filter((s) => s.accuracy_rating).length > 0
      ? (
          completedSessions
            .filter((s) => s.accuracy_rating)
            .reduce((sum, s) => sum + s.accuracy_rating, 0) /
          completedSessions.filter((s) => s.accuracy_rating).length
        ).toFixed(1)
      : "—";

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-light text-stone-900 tracking-tight">
            Admin
          </h1>
          <Link href="/" className="text-xs text-stone-400 underline">
            ← Home
          </Link>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border border-stone-200 p-5 rounded-sm">
            <p className="text-xs text-stone-400 tracking-wide mb-1">Total Sessions</p>
            <p className="text-2xl font-light text-stone-900">{sessions?.length ?? 0}</p>
          </div>
          <div className="bg-white border border-stone-200 p-5 rounded-sm">
            <p className="text-xs text-stone-400 tracking-wide mb-1">Completed</p>
            <p className="text-2xl font-light text-stone-900">{completedSessions.length}</p>
          </div>
          <div className="bg-white border border-stone-200 p-5 rounded-sm">
            <p className="text-xs text-stone-400 tracking-wide mb-1">Avg Accuracy</p>
            <p className="text-2xl font-light text-stone-900">{avgRating}</p>
          </div>
        </div>

        {/* Archetypes */}
        <section>
          <h2 className="text-xs tracking-widest uppercase text-stone-400 mb-4">
            Archetypes
          </h2>
          <div className="bg-white border border-stone-200 rounded-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="text-left px-4 py-3 text-stone-500 font-normal text-xs tracking-wide">Name</th>
                  <th className="text-left px-4 py-3 text-stone-500 font-normal text-xs tracking-wide">Slug</th>
                </tr>
              </thead>
              <tbody>
                {archetypes?.map((a) => (
                  <tr key={a.id} className="border-b border-stone-50">
                    <td className="px-4 py-3 text-stone-700">{a.name}</td>
                    <td className="px-4 py-3 text-stone-400 font-mono text-xs">{a.slug}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Image library */}
        <section>
          <h2 className="text-xs tracking-widest uppercase text-stone-400 mb-4">
            Image Library ({imageStats?.length ?? 0} images)
          </h2>
          <div className="bg-white border border-stone-200 rounded-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="text-left px-4 py-3 text-stone-500 font-normal text-xs tracking-wide">Slug</th>
                  <th className="text-left px-4 py-3 text-stone-500 font-normal text-xs tracking-wide">Archetype</th>
                  <th className="text-right px-4 py-3 text-stone-500 font-normal text-xs tracking-wide">Shown</th>
                  <th className="text-right px-4 py-3 text-stone-500 font-normal text-xs tracking-wide">Chosen</th>
                  <th className="text-right px-4 py-3 text-stone-500 font-normal text-xs tracking-wide">Win Rate</th>
                </tr>
              </thead>
              <tbody>
                {imageStats?.map((img) => {
                  const winRate =
                    img.times_shown > 0
                      ? ((img.times_chosen / img.times_shown) * 100).toFixed(0) + "%"
                      : "—";
                  return (
                    <tr key={img.id} className="border-b border-stone-50">
                      <td className="px-4 py-2.5 font-mono text-xs text-stone-500">{img.slug}</td>
                      <td className="px-4 py-2.5 text-stone-700">{img.archetype_name}</td>
                      <td className="px-4 py-2.5 text-right text-stone-500 tabular-nums">{img.times_shown}</td>
                      <td className="px-4 py-2.5 text-right text-stone-500 tabular-nums">{img.times_chosen}</td>
                      <td className="px-4 py-2.5 text-right text-stone-500 tabular-nums">{winRate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Quiz sessions */}
        <section>
          <h2 className="text-xs tracking-widest uppercase text-stone-400 mb-4">
            Recent Sessions
          </h2>
          <div className="bg-white border border-stone-200 rounded-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="text-left px-4 py-3 text-stone-500 font-normal text-xs tracking-wide">Session</th>
                  <th className="text-left px-4 py-3 text-stone-500 font-normal text-xs tracking-wide">Completed</th>
                  <th className="text-left px-4 py-3 text-stone-500 font-normal text-xs tracking-wide">Top Style</th>
                  <th className="text-right px-4 py-3 text-stone-500 font-normal text-xs tracking-wide">Rating</th>
                </tr>
              </thead>
              <tbody>
                {sessions?.map((s) => {
                  const result = s.result_json as { resultLabel?: string } | null;
                  return (
                    <tr key={s.id} className="border-b border-stone-50">
                      <td className="px-4 py-2.5 font-mono text-xs text-stone-400">
                        <Link
                          href={`/results/${s.id}`}
                          className="hover:text-stone-600 underline"
                        >
                          {s.id.slice(0, 8)}…
                        </Link>
                      </td>
                      <td className="px-4 py-2.5 text-stone-500 text-xs">
                        {s.completed_at
                          ? new Date(s.completed_at).toLocaleString()
                          : "—"}
                      </td>
                      <td className="px-4 py-2.5 text-stone-700">
                        {result?.resultLabel ?? "—"}
                      </td>
                      <td className="px-4 py-2.5 text-right text-stone-500">
                        {s.accuracy_rating ?? "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
