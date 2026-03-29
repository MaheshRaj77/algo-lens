'use client';

import { useState, useCallback } from 'react';
import AnalyzerInput from '@/components/AnalyzerInput';
import BlueprintView from '@/components/BlueprintView';
import type { AnalysisResult, AnalyzeResponse } from '@/lib/types';

/**
 * AlgoLens — Home Page
 *
 * Manages state switching between:
 * 1. AnalyzerInput (default) — user pastes a problem description
 * 2. BlueprintView (after successful analysis) — structured blueprint display
 *
 * Also handles error display and loading state.
 */
export default function HomePage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async (problemText: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemText }),
      });

      const data: AnalyzeResponse = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          !data.success ? data.error : 'Analysis failed. Please try again.'
        );
      }

      setResult(data.data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-24">
      {result ? (
        <BlueprintView result={result} onReset={handleReset} />
      ) : (
        <AnalyzerInput onAnalyze={handleAnalyze} isLoading={isLoading} />
      )}

      {error && (
        <div className="mt-6 w-full max-w-3xl animate-in">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}
    </main>
  );
}
