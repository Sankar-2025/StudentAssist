import React, { useEffect, useState, useRef } from 'react';
import {
  Bot,
  Send,
  User,
  Sparkles,
  Copy,
  Check,
  Trash2,
  PlusCircle,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const CareerMentor: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [providerInfo, setProviderInfo] = useState<any>({ provider: 'offline_rule_based_advisor', isFallback: true });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'How should I prepare for a Google SWE Intern technical screen?',
    'What are my biggest skill gaps for Full Stack Developer internships?',
    'Give me a 30-day preparation roadmap for technical coding interviews.',
    'How do I explain my missing skills in Docker during an interview?',
  ];

  const fetchConversations = async () => {
    try {
      const res: any = await api.get('/mentor/conversations');
      if (res.success && res.conversations) {
        setConversations(res.conversations);
        if (res.conversations.length > 0 && !activeConvId) {
          setActiveConvId(res.conversations[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch mentor conversations:', err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!activeConvId) return;
    const fetchMessages = async () => {
      try {
        const res: any = await api.get(`/mentor/conversations/${activeConvId}`);
        if (res.success && res.conversation) {
          setMessages(res.conversation.messages || []);
        }
      } catch (err) {
        console.error('Failed to load conversation messages:', err);
      }
    };
    fetchMessages();
  }, [activeConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (promptToSend?: string) => {
    const text = promptToSend || inputPrompt;
    if (!text.trim() || isLoading) return;

    const userMsg = { id: `temp-${Date.now()}`, role: 'user', content: text, createdAt: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const res: any = await api.post('/mentor/chat', {
        prompt: text,
        conversationId: activeConvId || undefined,
      });

      if (res.success) {
        const assistantMsg = {
          id: `resp-${Date.now()}`,
          role: 'assistant',
          content: res.response,
          createdAt: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setProviderInfo({ provider: res.provider, isFallback: res.isFallback });

        if (!activeConvId && res.conversationId) {
          setActiveConvId(res.conversationId);
          fetchConversations();
        }
      }
    } catch (err: any) {
      alert(err.message || 'Mentor communication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = () => {
    setActiveConvId(null);
    setMessages([]);
  };

  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.delete(`/mentor/conversations/${id}`);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConvId === id) {
        handleNewConversation();
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header & Context Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bot className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            AI Career Mentor
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Context-aware career advice grounded in your target role ({user?.profile?.targetRole || 'Software Engineering'}), university standing, and active applications.
          </p>
        </div>

        {/* AI Provider Transparency Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>
            {providerInfo.provider === 'gemini'
              ? 'Powered by Gemini AI'
              : providerInfo.provider === 'openai'
              ? 'Powered by OpenAI GPT'
              : 'Offline Career Advisor Mode'}
          </span>
        </div>
      </div>

      {/* Main Split Layout: History Sidebar + Chat View */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[600px]">
        {/* Conversations Sidebar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <button
            onClick={handleNewConversation}
            className="w-full py-2.5 px-3 text-xs font-bold rounded-xl bg-brand-600 hover:bg-brand-700 text-white transition flex items-center justify-center gap-2 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            New Conversation
          </button>

          <div className="space-y-1.5 overflow-y-auto max-h-[500px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
              Recent Sessions
            </span>
            {conversations.map((c) => (
              <div
                key={c.id}
                onClick={() => setActiveConvId(c.id)}
                className={`p-2.5 rounded-lg text-xs font-medium cursor-pointer transition flex items-center justify-between group ${
                  activeConvId === c.id
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="truncate pr-2">{c.title}</span>
                <button
                  onClick={(e) => handleDeleteConversation(c.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 transition"
                  title="Delete chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {conversations.length === 0 && (
              <p className="text-xs text-slate-400 px-2 py-4 text-center">
                No past sessions. Ask a question to begin!
              </p>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3 flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 max-h-[500px]">
            {messages.length === 0 ? (
              <div className="py-12 text-center space-y-4 max-w-lg mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto shadow-sm">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    How can I assist your internship journey today?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Ask about eligibility criteria, resume tailoring, interview prep strategies, or closing skill gaps.
                  </p>
                </div>

                {/* Prompt Chips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left pt-2">
                  {suggestedPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(p)}
                      className="p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-brand-500 text-slate-700 dark:text-slate-300 transition text-left"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isAssistant = msg.role === 'assistant';
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 text-xs leading-relaxed ${
                      isAssistant ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    {isAssistant && (
                      <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`relative group p-4 rounded-2xl max-w-2xl whitespace-pre-line ${
                        isAssistant
                          ? 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700'
                          : 'bg-brand-600 text-white font-medium'
                      }`}
                    >
                      {msg.content}

                      {isAssistant && (
                        <button
                          onClick={() => copyToClipboard(msg.content, msg.id || `${idx}`)}
                          className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded opacity-0 group-hover:opacity-100 transition"
                          title="Copy response"
                        >
                          {copiedId === (msg.id || `${idx}`) ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>

                    {!isAssistant && (
                      <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                        U
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {isLoading && (
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <span>Career Mentor is analyzing your request...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Box */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Ask about opportunities, interview prep, resumes, or skill roadmaps..."
                className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                disabled={!inputPrompt.trim() || isLoading}
                className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white transition flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 px-1">
              <span>AI guidance is advisory. Verify formal requirements on official portals.</span>
              {providerInfo.isFallback && (
                <span className="text-amber-500 font-medium">Offline Career Advisor Mode</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
