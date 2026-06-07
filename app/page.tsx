import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-2">
          <p className="text-xs tracking-widest uppercase text-stone-400">
            Style Finder
          </p>
          <h1 className="text-4xl font-light text-stone-900 tracking-tight leading-tight">
            Discover your style<br />in 2 minutes.
          </h1>
        </div>

        <p className="text-stone-500 leading-relaxed">
          Choose between outfit illustrations and get your personal Style DNA.
        </p>

        <Link
          href="/quiz"
          className="inline-block w-full bg-stone-900 text-white text-sm tracking-widest uppercase py-4 hover:bg-stone-700 transition-colors duration-200"
        >
          Find My Style
        </Link>

        <p className="text-xs text-stone-400">
          25 quick choices. No account needed.
        </p>
      </div>
    </main>
  );
}
