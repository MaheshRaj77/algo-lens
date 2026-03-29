import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase';

// OpenRouter setup via the OpenAI compatibility layer
const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const maxDuration = 60; // Max execution time

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const userId = session.user.id;
    const { messages, chatId }: { messages: { role: 'user' | 'assistant' | 'system', content: string, id?: string }[], chatId?: string } = await req.json();

    // 1. Check if the user has credits left
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('messages_remaining')
      .eq('id', userId)
      .single();

    if (!user || user.messages_remaining <= 0) {
      return new Response('Credit Limit Reached', { status: 403 });
    }

    const resolvedChatId = chatId || crypto.randomUUID();

    // 2. Define the System Prompt for a Coding Assistant
    const systemPrompt = `You are AlgoLens, an elite AI Coding Companion.
You help engineers deconstruct coding problems, debug applications, and write production-grade code.
Always format your responses in neat Markdown. 
Always use language identifiers (like \`\`\`typescript) for code blocks.
When explaining algorithms, clearly detail the Time and Space Complexity.
Be concise but extremely highly technical and accurate.`;

    const modelString = process.env.OPENROUTER_MODEL || 'nvidia/nemotron-4-340b-instruct';

    // 3. Stream the AI response
    const result = streamText({
      model: openrouter(modelString),
      system: systemPrompt,
      messages,
      async onFinish({ text }) {
        try {
          // 4. Post-processing: Deduct 1 credit
          await supabaseAdmin
            .from('users')
            .update({ messages_remaining: user.messages_remaining - 1 })
            .eq('id', userId);

          // 5. Post-processing: Save chat history to JSONB
          const fullConversation = [...messages, { id: crypto.randomUUID(), role: 'assistant', content: text }];
          
          if (!chatId) {
            // New chat
            await supabaseAdmin.from('chats').insert({
              id: resolvedChatId,
              user_id: userId,
              title: messages[0].content.substring(0, 40) + '...',
              messages: fullConversation,
            });
          } else {
            // Existing chat update
            await supabaseAdmin.from('chats').update({
              messages: fullConversation,
            }).eq('id', resolvedChatId);
          }
        } catch (e) {
          console.error("Error saving chat or deducting credits:", e);
        }
      }
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("AI Route Error:", error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
