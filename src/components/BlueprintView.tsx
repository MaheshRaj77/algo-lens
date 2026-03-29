'use client';

import { useState } from 'react';
import {
  RotateCcw,
  ChevronDown,
  Zap,
  Clock,
  HardDrive,
  Target,
  AlertTriangle,
  Footprints,
  Tag,
} from 'lucide-react';
import type { BlueprintViewProps, Difficulty } from '@/lib/types';

/** Color map for difficulty badges */
const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { bg: string; text: string; border: string; glow: string }
> = {
  Easy: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    glow: 'shadow-emerald-500/10',
  },
  Medium: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
    glow: 'shadow-amber-500/10',
  },
  Hard: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/20',
    glow: 'shadow-rose-500/10',
  },
};

/**
 * Accordion section with animated expand/collapse.
 */
function AccordionSection({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
  accentColor = 'violet',
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  defaultOpen?: boolean;
  accentColor?: string;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-neutral-800 rounded-xl overflow-hidden transition-colors duration-200 hover:border-neutral-700">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors duration-200 cursor-pointer ${
          isOpen ? 'bg-neutral-800/50' : 'bg-neutral-900/50 hover:bg-neutral-800/30'
        }`}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg bg-${accentColor}-500/10`}>
            <Icon className={`w-4 h-4 text-${accentColor}-400`} />
          </div>
          <span className="font-semibold text-sm text-neutral-200">{title}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-neutral-500 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 py-4 border-t border-neutral-800/50">{children}</div>
      </div>
    </div>
  );
}

/**
 * BlueprintView — Displays the structured analysis result.
 *
 * Features:
 * - Difficulty badge, pattern, and complexity cards at the top
 * - Tags displayed as pills
 * - Progressive disclosure: strategy steps and edge cases hidden in accordions
 * - "Analyze Another" reset button
 */
export default function BlueprintView({ result, onReset }: BlueprintViewProps) {
  const difficultyStyle = DIFFICULTY_CONFIG[result.difficulty];

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Analysis <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-500">Blueprint</span>
          </h2>
          <p className="text-zinc-500 mt-1">
            Strategic breakdown complete
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-400 bg-zinc-900 border border-white/10 hover:text-white hover:bg-zinc-800 hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Deconstruct Another
        </button>
      </div>

      {/* ── Bento Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-auto">
        
        {/* Top Left: Core Assessment (Span 1) */}
        <div className="lg:col-span-1 rounded-3xl bg-zinc-900/50 border border-white/5 p-6 flex flex-col gap-6 relative overflow-hidden group hover:bg-zinc-900 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative z-10 flex flex-col gap-4">
            <div className={`self-start inline-flex items-center px-4 py-1.5 rounded-full border ${difficultyStyle.bg} ${difficultyStyle.border} ${difficultyStyle.glow}`}>
              <span className={`text-sm font-bold ${difficultyStyle.text}`}>
                {result.difficulty}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  Core Pattern
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white leading-tight">
                {result.pattern}
              </h3>
            </div>
            
            <div className="pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                  Tags
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Right: Complexity Metrics (Span 2) */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Time Complexity */}
          <div className="rounded-3xl bg-zinc-900/50 border border-white/5 p-6 relative overflow-hidden group hover:bg-zinc-900 transition-colors hover:border-blue-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 h-full flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
                Time Complexity
              </span>
              <p className="text-lg font-medium text-white leading-relaxed">
                {result.timeComplexity}
              </p>
            </div>
          </div>

          {/* Space Complexity */}
          <div className="rounded-3xl bg-zinc-900/50 border border-white/5 p-6 relative overflow-hidden group hover:bg-zinc-900 transition-colors hover:border-teal-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 h-full flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center mb-4">
                <HardDrive className="w-5 h-5 text-teal-400" />
              </div>
              <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider mb-2">
                Space Complexity
              </span>
              <p className="text-lg font-medium text-white leading-relaxed">
                {result.spaceComplexity}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Left: Strategy Steps (Span 2) */}
        <div className="lg:col-span-2 rounded-3xl bg-zinc-900/50 border border-white/5 p-6 lg:p-8 flex flex-col relative overflow-hidden group">
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
              <Footprints className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Execution Strategy</h3>
          </div>
          
          <div className="relative z-10 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
            <ol className="space-y-4">
              {result.strategySteps.map((step, index) => (
                <li key={index} className="flex gap-4 p-4 rounded-2xl bg-zinc-800/30 border border-white/5 hover:border-white/10 transition-colors">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-sm font-bold text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                    {index + 1}
                  </span>
                  <p className="text-zinc-300 leading-relaxed pt-1">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Bottom Right: Edge Cases (Span 1) */}
        <div className="lg:col-span-1 rounded-3xl bg-zinc-900/50 border border-white/5 p-6 lg:p-8 flex flex-col relative overflow-hidden group hover:border-amber-500/20 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Edge Cases</h3>
          </div>

          <div className="relative z-10 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
            <ul className="space-y-3">
              {result.edgeCases.map((edgeCase, index) => (
                <li key={index} className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                  <Zap className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {edgeCase}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
