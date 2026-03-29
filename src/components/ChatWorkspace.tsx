'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { PanelLeft, Plus, Send, SendHorizonal, Bot, User as UserIcon, Loader2 } from 'lucide-react';

interface Chat {
  id: string;
  title: string;
  created_at: string;
}

export default function ChatWorkspace({
  user,
  initialChats = [],
}: {
  user: { id: string; email?: string | null };
  initialChats?: Chat[];
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: '/api/chat',
    body: { chatId: activeChatId },
    onResponse: (response) => {
      // Handles 403 (No Credits Left) gracefully
      if (response.status === 403) {
        alert("You have exhausted your 15 complimentary messages. Upgrade to continue.");
      }
    },
    onFinish: (message) => {
      // Refetch history or update client state if needed
    }
  });

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Sidebar */}
      <div 
        className={`transition-all duration-300 ease-in-out border-r border-white/5 bg-zinc-950/50 backdrop-blur-3xl flex flex-col
          ${sidebarOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 overflow-hidden border-transparent'}`}
      >
        <div className="p-4 flex flex-col gap-4 h-full w-64">
          <button 
            onClick={startNewChat}
            className="flex items-center gap-2 w-full px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-5 h-5" />
            New Chat
          </button>

          <div className="flex-1 overflow-y-auto space-y-2 mt-4 custom-scrollbar">
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-2">History</div>
            {initialChats.length === 0 ? (
              <p className="text-zinc-600 text-sm px-2">No past chats yet.</p>
            ) : (
              initialChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors truncate
                    ${activeChatId === chat.id ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'}
                  `}
                >
                  {chat.title}
                </button>
              ))
            )}
          </div>
          
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-sm text-zinc-400 px-2 mt-auto">
            <span className="truncate max-w-[150px]">{user.email}</span>
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              {user.email?.[0].toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Header */}
        <header className="h-16 flex items-center px-4 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md z-10 sticky top-0">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 flex items-center justify-center rounded-lg transition-colors"
          >
            <PanelLeft className="w-5 h-5" />
          </button>
          <div className="ml-4 font-semibold text-zinc-200">AlgoLens AI</div>
        </header>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-60">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">How can I help you code today?</h2>
                <p className="text-zinc-400 max-w-md mx-auto">
                  Paste a problem description, algorithmic challenge, or ask for a specific code solution. I'll deconstruct it.
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-8 pb-32">
              {messages.map((m) => (
                <div 
                  key={m.id} 
                  className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-5 h-5 text-indigo-400" />
                    </div>
                  )}
                  
                  <div 
                    className={`max-w-[85%] rounded-2xl p-5 ${
                      m.role === 'user' 
                        ? 'bg-zinc-800 text-zinc-100 rounded-tr-sm' 
                        : 'bg-transparent text-zinc-300'
                    }`}
                  >
                    {m.role === 'user' ? (
                      <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                    ) : (
                      <div className="prose prose-invert max-w-none text-zinc-300 prose-pre:bg-zinc-900/50 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                        >
                          {m.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>

                  {m.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 mt-1">
                      <UserIcon className="w-5 h-5 text-zinc-400" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Floating Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent pb-6 pt-10">
          <div className="max-w-4xl mx-auto">
            <form 
              onSubmit={handleSubmit}
              className="relative bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl flex items-end p-2 shadow-2xl transition-all focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20"
            >
              <textarea
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (input.trim() && !isLoading) {
                      const form = e.target as HTMLTextAreaElement;
                      form.form?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                    }
                  }
                }}
                placeholder="Message AlgoLens..."
                className="w-full max-h-48 min-h-[44px] bg-transparent resize-none outline-none py-3 px-4 text-zinc-200 placeholder:text-zinc-500 custom-scrollbar"
                rows={1}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="m-2 p-2.5 rounded-xl bg-white text-zinc-900 hover:bg-zinc-200 disabled:opacity-30 disabled:hover:bg-white transition-all disabled:cursor-not-allowed flex items-center justify-center group shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <SendHorizonal className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                )}
              </button>
            </form>
            <p className="text-center text-xs text-zinc-500 mt-3 font-medium tracking-wide">
              GPT-4 / Nemotron Engine • Code generated may be imperfect.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
