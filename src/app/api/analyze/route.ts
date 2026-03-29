import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { AnalysisResult, AnalyzeRequestBody } from '@/lib/types';

/**
 * System prompt that forces the LLM to return strictly formatted JSON
 * matching the AnalysisResult interface. No markdown, no conversational text.
 */
const SYSTEM_PROMPT = `You are an expert algorithm analysis engine for competitive programming and coding interviews. Your SOLE purpose is to deconstruct a given LeetCode-style problem into a structured strategic blueprint.

CRITICAL RULES:
1. You MUST respond with ONLY a single valid JSON object. No markdown code fences, no backticks, no explanation text, no conversational preamble or postscript.
2. The JSON MUST exactly match this TypeScript interface:
{
  "difficulty": "Easy" | "Medium" | "Hard",
  "tags": string[],
  "pattern": string,
  "timeComplexity": string,
  "spaceComplexity": string,
  "strategySteps": string[],
  "edgeCases": string[]
}

FIELD SPECIFICATIONS:
- "difficulty": Classify as "Easy", "Medium", or "Hard". Use exactly one of these three strings.
- "tags": 2-5 relevant algorithmic topic tags (e.g., "Array", "Hash Map", "Two Pointers", "Dynamic Programming", "Binary Search", "Graph", "Tree", "Stack", "Queue", "Greedy", "Backtracking", "Sliding Window", "Linked List", "Heap", "Trie", "Bit Manipulation", "Math", "String").
- "pattern": A single core algorithmic pattern name that best describes the optimal approach (e.g., "Two Pointers", "Sliding Window", "BFS/DFS", "Dynamic Programming - Bottom Up", "Monotonic Stack", "Binary Search on Answer", "Union Find", "Divide and Conquer").
- "timeComplexity": Big-O notation with a brief explanation (e.g., "O(n) — single pass through the array using a hash map for O(1) lookups").
- "spaceComplexity": Big-O notation with a brief explanation (e.g., "O(n) — hash map stores at most n elements").
- "strategySteps": 4-8 clear, sequential, conceptual strategy steps. These describe the THINKING PROCESS, not code. Each step should be a complete sentence explaining WHAT to do and WHY.
- "edgeCases": 3-6 specific edge cases to consider (e.g., "Empty array input", "Single element array", "All elements are the same", "Negative numbers", "Integer overflow").

REMEMBER: Output ONLY the raw JSON object. Any text outside the JSON will cause a system failure.`;

/**
 * Validates that raw parsed JSON matches the AnalysisResult shape.
 * Returns a typed result or throws with a descriptive error.
 */
function validateAnalysisResult(raw: unknown): AnalysisResult {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('Response is not a JSON object');
  }

  const obj = raw as Record<string, unknown>;

  // Validate difficulty
  const validDifficulties = ['Easy', 'Medium', 'Hard'] as const;
  if (!validDifficulties.includes(obj.difficulty as typeof validDifficulties[number])) {
    throw new Error(
      `Invalid difficulty: "${String(obj.difficulty)}". Must be one of: ${validDifficulties.join(', ')}`
    );
  }

  // Validate string arrays
  const stringArrayFields = ['tags', 'strategySteps', 'edgeCases'] as const;
  for (const field of stringArrayFields) {
    if (!Array.isArray(obj[field])) {
      throw new Error(`"${field}" must be an array, got ${typeof obj[field]}`);
    }
    const arr = obj[field] as unknown[];
    if (arr.length === 0) {
      throw new Error(`"${field}" must not be empty`);
    }
    for (let i = 0; i < arr.length; i++) {
      if (typeof arr[i] !== 'string' || (arr[i] as string).trim().length === 0) {
        throw new Error(`"${field}[${i}]" must be a non-empty string`);
      }
    }
  }

  // Validate string fields
  const stringFields = ['pattern', 'timeComplexity', 'spaceComplexity'] as const;
  for (const field of stringFields) {
    if (typeof obj[field] !== 'string' || (obj[field] as string).trim().length === 0) {
      throw new Error(`"${field}" must be a non-empty string, got ${typeof obj[field]}`);
    }
  }

  return {
    difficulty: obj.difficulty as AnalysisResult['difficulty'],
    tags: obj.tags as string[],
    pattern: obj.pattern as string,
    timeComplexity: obj.timeComplexity as string,
    spaceComplexity: obj.spaceComplexity as string,
    strategySteps: obj.strategySteps as string[],
    edgeCases: obj.edgeCases as string[],
  };
}

/**
 * Attempts to extract JSON from a string that may contain markdown fences
 * or surrounding text. Falls back to parsing the raw string.
 */
function extractJSON(text: string): unknown {
  // Try direct parse first
  try {
    return JSON.parse(text);
  } catch {
    // Continue to extraction attempts
  }

  // Strip markdown code fences (```json ... ``` or ``` ... ```)
  const fenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim());
    } catch {
      // Continue
    }
  }

  // Try to find JSON object boundaries
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(text.slice(firstBrace, lastBrace + 1));
    } catch {
      // Give up
    }
  }

  throw new Error('Could not extract valid JSON from LLM response');
}

/**
 * Logs a successful analysis to Supabase.
 * Non-blocking — errors here don't affect the API response.
 */
async function logToSupabase(
  problemText: string,
  result: AnalysisResult
): Promise<void> {
  try {
    const { error } = await supabase.from('analyses').insert({
      problem_text: problemText,
      difficulty: result.difficulty,
      tags: result.tags,
      pattern: result.pattern,
      time_complexity: result.timeComplexity,
      space_complexity: result.spaceComplexity,
      strategy_steps: result.strategySteps,
      edge_cases: result.edgeCases,
    });

    if (error) {
      console.error('[Supabase] Failed to log analysis:', error.message);
    }
  } catch (err) {
    console.error('[Supabase] Unexpected error logging analysis:', err);
  }
}

/**
 * POST /api/analyze
 *
 * Accepts a problem description, queries an LLM via OpenRouter,
 * validates the response, logs to Supabase, and returns the blueprint.
 */
export async function POST(request: NextRequest) {
  try {
    // ── Parse & validate request body ───────────────────────────
    const body = (await request.json()) as AnalyzeRequestBody;

    if (!body.problemText || typeof body.problemText !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid "problemText" in request body.' },
        { status: 400 }
      );
    }

    const problemText = body.problemText.trim();
    if (problemText.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Problem text is too short. Please provide a full problem description.' },
        { status: 400 }
      );
    }

    if (problemText.length > 15000) {
      return NextResponse.json(
        { success: false, error: 'Problem text is too long (max 15,000 characters).' },
        { status: 400 }
      );
    }

    // ── Resolve API key & model ─────────────────────────────────
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const nvidiaKey = process.env.NVIDIA_API_KEY;

    if (!openRouterKey && !nvidiaKey) {
      console.error('[API] No AI provider API key configured');
      return NextResponse.json(
        { success: false, error: 'AI provider not configured. Set OPENROUTER_API_KEY or NVIDIA_API_KEY.' },
        { status: 500 }
      );
    }

    let apiUrl: string;
    let apiKey: string;
    let model: string;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (openRouterKey) {
      apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
      apiKey = openRouterKey;
      model = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.1-70b-instruct';
      headers['Authorization'] = `Bearer ${apiKey}`;
      headers['HTTP-Referer'] = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      headers['X-Title'] = 'AlgoLens';
    } else {
      apiUrl = 'https://integrate.api.nvidia.com/v1/chat/completions';
      apiKey = nvidiaKey!;
      model = process.env.NVIDIA_MODEL || 'meta/llama-3.1-70b-instruct';
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    // ── Call the LLM ────────────────────────────────────────────
    const llmResponse = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: `Analyze the following LeetCode problem and return the JSON blueprint:\n\n${problemText}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
        top_p: 0.9,
      }),
    });

    if (!llmResponse.ok) {
      const errorText = await llmResponse.text().catch(() => 'Unknown error');
      console.error(`[LLM] API returned ${llmResponse.status}: ${errorText}`);
      return NextResponse.json(
        {
          success: false,
          error: `AI provider returned an error (${llmResponse.status}). Please try again.`,
        },
        { status: 502 }
      );
    }

    const llmData = await llmResponse.json();
    const rawContent: string | undefined =
      llmData?.choices?.[0]?.message?.content;

    if (!rawContent || typeof rawContent !== 'string') {
      console.error('[LLM] Empty or invalid response content:', JSON.stringify(llmData));
      return NextResponse.json(
        { success: false, error: 'AI returned an empty response. Please try again.' },
        { status: 502 }
      );
    }

    // ── Parse & validate the LLM output ─────────────────────────
    let parsedJSON: unknown;
    try {
      parsedJSON = extractJSON(rawContent);
    } catch (parseErr) {
      console.error('[LLM] JSON extraction failed:', parseErr, '\nRaw:', rawContent);
      return NextResponse.json(
        { success: false, error: 'AI returned malformed data. Please try again.' },
        { status: 500 }
      );
    }

    let result: AnalysisResult;
    try {
      result = validateAnalysisResult(parsedJSON);
    } catch (validationErr) {
      console.error('[LLM] Validation failed:', validationErr, '\nParsed:', parsedJSON);
      return NextResponse.json(
        {
          success: false,
          error: `AI response failed validation: ${validationErr instanceof Error ? validationErr.message : 'Unknown'}. Please try again.`,
        },
        { status: 500 }
      );
    }

    // ── Log to Supabase (non-blocking) ──────────────────────────
    logToSupabase(problemText, result).catch(() => {
      // Silently ignore — logging should never block the response
    });

    // ── Return the validated blueprint ──────────────────────────
    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (err) {
    console.error('[API] Unexpected error:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected server error occurred. Please try again.',
      },
      { status: 500 }
    );
  }
}
