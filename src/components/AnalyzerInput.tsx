'use client';

import { useState, type FormEvent } from 'react';
import { Search, Loader2, Sparkles } from 'lucide-react';
import type { AnalyzerInputProps } from '@/lib/types';

/**
 * AnalyzerInput — The primary input interface for AlgoLens.
 *
 * Renders a premium dark-themed card with:
 * - A resizable textarea for pasting LeetCode problem descriptions
 * - A "Deconstruct" submit button with icon + loading states
 * - Character count and input validation
 */
export default function AnalyzerInput({ onAnalyze, isLoading }: AnalyzerInputProps) {
  const [problemText, setProblemText] = useState<string>('');

  const trimmedText = problemText.trim();
  const canSubmit = trimmedText.length > 0 && !isLoading;
  const characterCount = trimmedText.length;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    onAnalyze(trimmedText);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-xs font-medium tracking-wide text-violet-300 uppercase">
            AI-Powered Strategy Tool
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-b from-white via-white to-neutral-400 bg-clip-text text-transparent mb-4">
          AlgoLens
        </h1>
        <p className="text-neutral-400 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
          Paste a LeetCode problem. Get a structured blueprint — 
          <span className="text-neutral-300"> pattern, strategy, complexity, edge cases.</span>
        </p>
      </div>

      {/* Input Card */}
      <form onSubmit={handleSubmit} className="relative group">
        {/* Ambient glow behind card */}
        <div
          className="absolute -inset-1 rounded-3xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-xl"
          style={{
            background:
              'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1), rgba(99,102,241,0.08))',
          }}
          aria-hidden
        />

        <div className="relative bg-zinc-900/60 backdrop-blur-2xl border border-white/5 p-2 rounded-3xl shadow-2xl shadow-black/50">
          <div className="bg-zinc-950/50 border border-white/5 rounded-2xl p-4 sm:p-6 transition-colors group-focus-within:border-white/10">
            {/* Textarea */}
            <div className="relative">
              <textarea
                id="problem-input"
                value={problemText}
                onChange={(e) => setProblemText(e.target.value)}
                disabled={isLoading}
                placeholder="Paste a LeetCode problem description here...&#10;&#10;Example: Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target..."
                rows={8}
                className="w-full bg-transparent border-none text-sm text-zinc-200 placeholder:text-zinc-600 resize-y min-h-[180px] max-h-[500px] focus:outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed font-mono leading-relaxed"
              />
            </div>

            {/* Bottom Row: Character count + Submit */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-mono transition-colors duration-200 ${
                    characterCount > 0 ? 'text-zinc-400' : 'text-zinc-600'
                  }`}
                >
                  {characterCount.toLocaleString()} chars
                </span>
                {characterCount > 0 && characterCount < 50 && (
                  <span className="text-xs text-amber-500/80">
                    Tip: longer descriptions yield better results
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className="relative inline-flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 bg-white text-black hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-zinc-900 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Deconstruct</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="mt-8 flex flex-col items-center gap-3 animate-in fade-in duration-500">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-violet-500 animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
          <p className="text-sm text-neutral-500 animate-pulse">
            Querying LLM for strategic analysis...
          </p>
        </div>
      )}
    </div>
  );
}
