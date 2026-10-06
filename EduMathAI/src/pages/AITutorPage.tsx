import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Chapter, ChatMessage } from '../types';
import {
  Sparkles, Send, Trash2, BookOpen, Lightbulb, CheckCircle2,
  HelpCircle, Calculator, ChevronRight, User as UserIcon, Bot
} from 'lucide-react';

interface AITutorPageProps {
  initialContext?: string;
}

export const AITutorPage: React.FC<AITutorPageProps> = ({ initialContext }) => {
  const { user } = useAuth();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapterTitle, setSelectedChapterTitle] = useState<string>(initialContext || 'General Mathematics');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick prompt buttons
  const quickPrompts = [
    'Explain this concept',
    'Solve this problem',
    'Give me a hint',
    'Give me practice questions',
    'Explain this formula',
    'Test me on this chapter'
  ];

  // Load chapters & initial greeting
  useEffect(() => {
    const init = async () => {
      try {
        const chaps = await api.getChapters();
        setChapters(chaps);
      } catch (e) {
        console.error(e);
      }
    };
    init();

    // Set welcome message
    setMessages([
      {
        id: 'msg_welcome',
        sessionId: 'initial',
        role: 'assistant',
        text: `Hello ${user?.firstName || 'there'}! I am **EduMathAI Tutor**, your personal 24/7 Class 9 Mathematics mentor.\n\nWhether you need step-by-step help with CBSE algebra, geometric proofs for circles, or AP State Board theorems, I'm here to guide you!\n\n**Select a chapter above or try asking:**\n- "Can you explain the Mid-Point Theorem in Quadrilaterals?"\n- "How do I rationalize $\\frac{1}{\\sqrt{5} + \\sqrt{2}}$?"\n- "Give me a hint on solving cyclic quadrilaterals."`,
        timestamp: new Date().toISOString(),
        stepByStep: [
          'State your problem or formula question',
          'Review step-by-step breakdown and geometric logic',
          'Test your understanding with practice checks'
        ],
        formulaReference: 'Learn • Practice • Grow'
      }
    ]);
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    setInputMessage('');
    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sessionId: sessionId || 'temp',
      role: 'user',
      text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = messages.slice(-6).map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await api.sendTutorMessage({
        studentId: user?.id,
        message: text,
        chapterTitle: selectedChapterTitle,
        sessionId,
        history
      });

      if (!sessionId) {
        setSessionId(res.sessionId);
      }

      setMessages(prev => [...prev, res.reply]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          sessionId: sessionId || 'temp',
          role: 'assistant',
          text: 'I encountered an issue connecting to the tutoring engine. Please try asking again in a moment!',
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg_welcome_${Date.now()}`,
        sessionId: 'initial',
        role: 'assistant',
        text: `Chat cleared! Ready for your next Class 9 mathematics doubt. What topic would you like to explore?`,
        timestamp: new Date().toISOString()
      }
    ]);
    setSessionId(undefined);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300 max-w-5xl mx-auto flex flex-col h-[calc(100vh-120px)]">
      {/* Top Tutor Controls Bar */}
      <div className="glass-card rounded-2xl p-4 border border-sky-500/30 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-white">EduMathAI Tutor</h2>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300">
                Gemini 3.8
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Class 9 Mathematics • CBSE & AP State</p>
          </div>
        </div>

        {/* Chapter Context Selector */}
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-sky-400" />
          <select
            value={selectedChapterTitle}
            onChange={(e) => setSelectedChapterTitle(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-500"
          >
            <option value="General Mathematics">General Class 9 Mathematics</option>
            {chapters.map(c => (
              <option key={c.id} value={`Chapter ${c.number}: ${c.title}`}>
                Ch {c.number}: {c.title}
              </option>
            ))}
          </select>

          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Prompts Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Quick Prompts:
        </span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(`${prompt} for ${selectedChapterTitle}`)}
            className="shrink-0 px-3 py-1 rounded-xl bg-slate-900/80 hover:bg-sky-500/20 text-slate-300 hover:text-sky-300 border border-slate-700/60 hover:border-sky-500/40 text-xs font-medium transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto glass-card rounded-3xl border border-slate-700/80 p-5 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 items-start ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                isUser
                  ? 'bg-sky-500 text-white font-bold'
                  : 'bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md'
              }`}>
                {isUser ? <UserIcon className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] rounded-3xl p-4 sm:p-5 space-y-3 leading-relaxed text-xs sm:text-sm ${
                isUser
                  ? 'bg-sky-600 text-white rounded-tr-none'
                  : 'bg-slate-900/90 text-slate-200 border border-slate-700/80 rounded-tl-none'
              }`}>
                <div className="whitespace-pre-line leading-relaxed">
                  {msg.text}
                </div>

                {/* Formatted step-by-step logic box */}
                {!isUser && msg.stepByStep && msg.stepByStep.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-sky-950/40 border border-sky-500/30 text-xs space-y-1.5">
                    <span className="font-bold text-sky-300 block uppercase text-[10px] tracking-wider">
                      Step-by-Step Breakdown:
                    </span>
                    {msg.stepByStep.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sky-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Formula pill */}
                {!isUser && msg.formulaReference && (
                  <div className="text-[11px] font-mono text-amber-300/90 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                    Formula applied: {msg.formulaReference}
                  </div>
                )}

                <div className={`text-[10px] ${isUser ? 'text-sky-200' : 'text-slate-500'} text-right`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 items-center text-slate-400 text-xs pl-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white animate-spin">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span>EduMathAI Tutor is formulating step-by-step solution...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="glass-card p-2.5 rounded-2xl border border-slate-700/80 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={`Ask about ${selectedChapterTitle} or paste a math problem...`}
          className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !inputMessage.trim()}
          className="p-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white shadow-md shadow-sky-500/25 transition disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
