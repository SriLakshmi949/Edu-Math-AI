import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ChapterProgressItem, TestAttempt, Recommendation } from '../types';
import {
  TrendingUp, Award, Target, BookOpen, Clock, Flame,
  CheckCircle2, AlertTriangle, ArrowUpRight, BarChart3, PieChart
} from 'lucide-react';

interface ProgressAnalyticsPageProps {
  onNavigate: (route: string) => void;
}

export const ProgressAnalyticsPage: React.FC<ProgressAnalyticsPageProps> = ({ onNavigate }) => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    chapters: ChapterProgressItem[];
    weakTopics: ChapterProgressItem[];
    strongTopics: ChapterProgressItem[];
    recentTests: TestAttempt[];
  } | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await api.getProgress(user.id);
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [user]);

  const overallProgress = profile?.overallProgressPercentage || 68;
  const testAvg = profile?.testAverage || 82;
  const questionsCount = profile?.practiceQuestionsAttempted || 124;
  const correctCount = profile?.practiceQuestionsCorrect || 104;
  const accuracy = Math.round((correctCount / questionsCount) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/80">
        <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
          Student Learning Intelligence
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Progress & Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Comprehensive diagnostic insights into Class 9 mathematics mastery, accuracy trends, and chapter proficiency.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="glass-card p-4 rounded-2xl border border-sky-500/20 bg-sky-500/5">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">Overall Progress</span>
          <div className="text-2xl font-black text-white">{overallProgress}%</div>
          <span className="text-[10px] text-sky-400 mt-1 block">8/15 chapters done</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">Practice Accuracy</span>
          <div className="text-2xl font-black text-emerald-300">{accuracy}%</div>
          <span className="text-[10px] text-emerald-400 mt-1 block">104 / 124 solved</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">Test Average</span>
          <div className="text-2xl font-black text-amber-300">{testAvg}%</div>
          <span className="text-[10px] text-amber-400 mt-1 block">Timed assessments</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">Total Study Time</span>
          <div className="text-2xl font-black text-indigo-300">24.5 <span className="text-xs font-normal">hrs</span></div>
          <span className="text-[10px] text-indigo-400 mt-1 block">This academic term</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">Current Streak</span>
          <div className="text-2xl font-black text-rose-300">{profile?.streakDays || 7} <span className="text-xs font-normal">days</span></div>
          <span className="text-[10px] text-rose-400 mt-1 block">Active study habit</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-purple-500/20 bg-purple-500/5">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">Points Earned</span>
          <div className="text-2xl font-black text-purple-300">{profile?.totalPoints || 1480}</div>
          <span className="text-[10px] text-purple-400 mt-1 block">Academic XP</span>
        </div>
      </div>

      {/* Chapter Progress Chart Grid */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-700/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Curriculum Chapter Completion Chart</h3>
            <p className="text-xs text-slate-400 mt-0.5">Real-time mastery tracking across all Class 9 units</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">15 Chapters Total</span>
        </div>

        <div className="space-y-3 pt-2">
          {data?.chapters.map(({ chapter, progressPercentage, masteryLevel }) => (
            <div key={chapter.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">
                  Ch {chapter.number}: {chapter.title}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    masteryLevel === 'Master' ? 'bg-purple-500/20 text-purple-300' :
                    masteryLevel === 'Proficient' ? 'bg-sky-500/20 text-sky-300' :
                    masteryLevel === 'Intermediate' ? 'bg-indigo-500/20 text-indigo-300' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {masteryLevel}
                  </span>
                  <span className="font-bold text-white w-10 text-right">{progressPercentage}%</span>
                </div>
              </div>

              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    progressPercentage >= 80 ? 'bg-gradient-to-r from-emerald-500 to-sky-400' :
                    progressPercentage >= 60 ? 'bg-gradient-to-r from-sky-500 to-blue-500' :
                    'bg-gradient-to-r from-amber-500 to-rose-400'
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Weaknesses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strong Topics */}
        <div className="glass-card p-6 rounded-3xl border border-emerald-500/30">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Strong Topics (Mastered)</h3>
          </div>
          <div className="space-y-3">
            {[
              { title: 'Number Systems', score: '95% Mastery', desc: 'Rational exponents and irrational numbers on number line' },
              { title: 'Coordinate Geometry', score: '90% Mastery', desc: 'Cartesian axes, quadrants and plotting points' },
              { title: 'Polynomials', score: '88% Mastery', desc: 'Algebraic identities and zeroes of polynomials' }
            ].map((s, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{s.title}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                    {s.score}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Topics */}
        <div className="glass-card p-6 rounded-3xl border border-rose-500/30">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <h3 className="text-sm font-bold text-white">Needs Improvement</h3>
          </div>
          <div className="space-y-3">
            {[
              { title: 'Circles Theorems', score: '45% Accuracy', action: 'chap_9', desc: 'Opposite angles of cyclic quadrilaterals' },
              { title: 'Surface Areas & Volumes', score: '40% Accuracy', action: 'chap_11', desc: 'Curved vs total surface area formulas' },
              { title: 'Triangles Congruence', score: '60% Accuracy', action: 'chap_7', desc: 'SAS vs AAA distinction proofs' }
            ].map((w, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{w.title}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold">
                    {w.score}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{w.desc}</p>
                <button
                  onClick={() => onNavigate(`/student/practice?chapterId=${w.action}`)}
                  className="mt-2 text-[10px] text-sky-400 hover:underline font-bold"
                >
                  Start Focused Practice →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Improved */}
        <div className="glass-card p-6 rounded-3xl border border-sky-500/30">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-bold text-white">Recently Improved</h3>
          </div>
          <div className="space-y-3">
            {[
              { title: 'Polynomials Expansion', boost: '+12% Accuracy', desc: 'Identity (x+y+z)² calculation errors eliminated' },
              { title: 'Lines & Angles', boost: '+8% Accuracy', desc: 'Linear pairs & transversal alternate angle sums' },
              { title: 'Heron\'s Formula', boost: '+15% Speed', desc: 'Semi-perimeter calculations executed twice as fast' }
            ].map((imp, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{imp.title}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">
                    {imp.boost}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{imp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
