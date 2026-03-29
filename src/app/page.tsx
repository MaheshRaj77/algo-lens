import Link from 'next/link';
import { ArrowRight, Code2, BrainCircuit, ShieldAlert, Sparkles, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen selection:bg-indigo-500/30">
      {/* ─── Navigation ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">AlgoLens</span>
          </div>
          <Link
            href="/app"
            className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-24">
        {/* ─── Hero Section ─── */}
        <section className="max-w-7xl mx-auto px-6 text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-indigo-300 backdrop-blur-sm shadow-[0_0_15px_rgba(99,102,241,0.1)]">
            <Sparkles className="w-4 h-4" />
            <span>AlgoLens V1 is now live</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-500 max-w-4xl mx-auto leading-tight">
            Deconstruct LeetCode. <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">Don't Just Solve It.</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Stop memorizing syntax and start understanding patterns. AlgoLens uses AI to break down complex competitive programming problems into strategic visual blueprints.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/app"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-black font-semibold text-lg overflow-hidden transition-all hover:scale-[1.02]"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-white to-zinc-200" />
              <span className="relative">Start Deconstructing</span>
              <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/5 text-white font-medium text-lg border border-white/10 hover:bg-white/10 transition-colors"
            >
              How it works
            </a>
          </div>
        </section>

        {/* ─── Features Bento Grid ─── */}
        <section id="features" className="max-w-7xl mx-auto px-6 mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Master the Blueprint</h2>
            <p className="text-zinc-400">Everything you need to truly grok an algorithm.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Big Feature 1 */}
            <div className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-zinc-900/50 border border-white/5 p-8 flex flex-col justify-between hover:border-indigo-500/30 hover:bg-zinc-900 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6">
                <BrainCircuit className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-2">Pattern Recognition</h3>
                <p className="text-zinc-400 max-w-md">Instantly identify the core algorithmic pattern (Hash Map, Two Pointers, BFS) required to solve the problem before writing a single line of code.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative overflow-hidden rounded-3xl bg-zinc-900/50 border border-white/5 p-8 flex flex-col justify-between hover:border-violet-500/30 hover:bg-zinc-900 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 rounded-2xl bg-violet-500/20 flex items-center justify-center mb-6">
                <ShieldAlert className="w-6 h-6 text-violet-400" />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-2">Hidden Edge Cases</h3>
                <p className="text-zinc-400">Never get caught by a tricky test case again. See exactly where your logic might break.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative overflow-hidden rounded-3xl bg-zinc-900/50 border border-white/5 p-8 flex flex-col justify-between hover:border-emerald-500/30 hover:bg-zinc-900 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-2">Complexity Decoding</h3>
                <p className="text-zinc-400">Understand exactly why an algorithm costs O(n) time and O(1) space with simple reasoning.</p>
              </div>
            </div>

            {/* Big Feature 4 */}
            <div className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-zinc-900/50 border border-white/5 p-8 flex flex-col justify-between hover:border-blue-500/30 hover:bg-zinc-900 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <Link href="/app" className="inline-flex items-center gap-1 text-sm font-medium text-blue-400 hover:text-blue-300">
                  Try it now <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-2">Step-by-Step Strategy</h3>
                <p className="text-zinc-400 max-w-md">Detailed execution plans in plain English. No code allowed. Force yourself to map the logic before touching the keyboard.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-white/5 py-12 text-center text-zinc-500">
        <p>© 2026 AlgoLens. Build your logic muscle.</p>
      </footer>
    </div>
  );
}
