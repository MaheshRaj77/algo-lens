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
    <div className="w-full max-w-3xl mx-auto animate-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">
            Blueprint
          </h2>
          <p className="text-sm text-neutral-500">
            Strategic analysis complete
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-neutral-400 bg-neutral-800/50 border border-neutral-700/50 hover:text-white hover:bg-neutral-800 hover:border-neutral-600 transition-all duration-200 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Analyze Another
        </button>
      </div>

      {/* ── Top Cards: Difficulty + Pattern + Complexities ────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {/* Difficulty */}
        <div
          className={`flex flex-col items-center justify-center p-4 rounded-xl border ${difficultyStyle.bg} ${difficultyStyle.border} shadow-lg ${difficultyStyle.glow}`}
        >
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
            Difficulty
          </span>
          <span className={`text-lg font-bold ${difficultyStyle.text}`}>
            {result.difficulty}
          </span>
        </div>

        {/* Time Complexity */}
        <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-neutral-800 bg-neutral-900/50">
          <div className="flex items-center gap-1.5 mb-1">
            <Clock className="w-3 h-3 text-blue-400" />
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
              Time
            </span>
          </div>
          <span className="text-sm font-semibold text-neutral-200 text-center">
            {result.timeComplexity}
          </span>
        </div>

        {/* Space Complexity */}
        <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-neutral-800 bg-neutral-900/50">
          <div className="flex items-center gap-1.5 mb-1">
            <HardDrive className="w-3 h-3 text-teal-400" />
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
              Space
            </span>
          </div>
          <span className="text-sm font-semibold text-neutral-200 text-center">
            {result.spaceComplexity}
          </span>
        </div>
      </div>

      {/* ── Core Pattern ──────────────────────────────────────── */}
      <div className="mb-6 p-5 rounded-xl border border-violet-500/20 bg-violet-500/5">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-4 h-4 text-violet-400" />
          <span className="text-xs font-semibold text-violet-400 uppercase tracking-wide">
            Core Pattern
          </span>
        </div>
        <p className="text-lg font-bold text-white">{result.pattern}</p>
      </div>

      {/* ── Tags ──────────────────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="w-3.5 h-3.5 text-neutral-500" />
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
            Tags
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {result.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-800 text-neutral-300 border border-neutral-700/50"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── Progressive Disclosure Sections ────────────────────── */}
      <div className="space-y-3">
        {/* Strategy Steps */}
        <AccordionSection
          title={`Strategy Steps (${result.strategySteps.length})`}
          icon={Footprints}
          accentColor="blue"
        >
          <ol className="space-y-3">
            {result.strategySteps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400">
                  {index + 1}
                </span>
                <p className="text-sm text-neutral-300 leading-relaxed pt-0.5">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </AccordionSection>

        {/* Edge Cases */}
        <AccordionSection
          title={`Edge Cases (${result.edgeCases.length})`}
          icon={AlertTriangle}
          accentColor="amber"
        >
          <ul className="space-y-2.5">
            {result.edgeCases.map((edgeCase, index) => (
              <li key={index} className="flex items-start gap-3">
                <Zap className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-neutral-300 leading-relaxed">
                  {edgeCase}
                </p>
              </li>
            ))}
          </ul>
        </AccordionSection>
      </div>
    </div>
  );
}
