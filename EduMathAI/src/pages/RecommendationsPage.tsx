import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Recommendation } from '../types';
import {
  Lightbulb, ArrowRight, CheckCircle2, Target, BookOpen,
  CheckSquare, Sparkles, Check, Clock
} from 'lucide-react';

interface RecommendationsPageProps {
  onNavigate: (route: string) => void;
}

export const RecommendationsPage: React.FC<RecommendationsPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchRecs = async () => {
      setLoading(true);
      try {
        const list = await api.getRecommendations(user.id);
        setRecommendations(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, [user]);

  const handleDismiss = async (id: string) => {
    try {
      await api.dismissRecommendation(id);
      setRecommendations(prev =>
        prev.map(r => (r.id === id ? { ...r, completed: true } : r))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const executeAction = (rec: Recommendation) => {
    if (rec.actionType === 'TEST') {
      onNavigate('/student/tests');
    } else if (rec.actionType === 'REVISE') {
      onNavigate('/student/materials');
    } else {
      onNavigate(`/student/practice?chapterId=${rec.targetChapterId}`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-sky-500/30">
        <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
          Intelligent Learning Guidance
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Personalized Recommendations
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Algorithmic study pathways synthesized from your recent test scores, practice accuracy trends, and weak topic diagnostic signals.
        </p>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className={`glass-card p-6 rounded-3xl border transition-all ${
              rec.completed
                ? 'border-slate-800 opacity-60'
                : rec.priority === 'High'
                ? 'border-amber-500/40 bg-amber-500/5'
                : 'border-sky-500/30'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    rec.priority === 'High'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  }`}>
                    {rec.actionType} • {rec.priority} Priority
                  </span>
                  <span className="text-xs text-slate-400">Target: {rec.targetChapterTitle}</span>
                </div>

                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{rec.title}</span>
                  {rec.completed && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Done
                    </span>
                  )}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {rec.reason}
                </p>
              </div>

              {/* Action */}
              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                {!rec.completed ? (
                  <>
                    <button
                      onClick={() => executeAction(rec)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-md shadow-sky-500/20 transition hover:scale-[1.02]"
                    >
                      <span>Take Action</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDismiss(rec.id)}
                      className="px-3 py-2.5 rounded-2xl bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
                    >
                      Dismiss
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-emerald-400 font-semibold px-3 py-1 rounded-xl bg-emerald-500/10">
                    Goal Completed
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
