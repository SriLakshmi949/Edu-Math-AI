import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  HeartHandshake, TrendingUp, CheckSquare, Target, Clock,
  Flame, CheckCircle2, AlertTriangle, BookOpen, Lightbulb, Sparkles, Check
} from 'lucide-react';

export const ParentDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.getParentChildData();
        setData(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !data) {
    return (
      <div className="p-12 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs">Loading child academic performance...</p>
      </div>
    );
  }

  const { child, metrics, recentTests, weakAreas, strengths, teacherRecommendations, aiRecommendations } = data;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Parent Oversight Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {child.name}'s Learning Progress
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {child.grade} • {child.school} ({child.curriculum} Board)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="glass-card px-4 py-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-center">
            <span className="text-[10px] text-emerald-300 block font-semibold">Active Streak</span>
            <span className="text-xl font-black text-white flex items-center gap-1 justify-center">
              {metrics.studyStreakDays} days <Flame className="w-4 h-4 text-rose-400" />
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="glass-card p-4 rounded-2xl border border-sky-500/20 bg-sky-500/5">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">Overall Progress</span>
          <div className="text-2xl font-black text-white">{metrics.overallProgress}%</div>
          <span className="text-[10px] text-sky-400 mt-1 block">Class 9 Syllabus</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">Chapters Completed</span>
          <div className="text-2xl font-black text-indigo-300">
            {metrics.chaptersCompleted} <span className="text-xs text-slate-400">/ {metrics.totalChapters}</span>
          </div>
          <span className="text-[10px] text-indigo-400 mt-1 block">8 units mastered</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">Test Average</span>
          <div className="text-2xl font-black text-emerald-300">{metrics.testAverage}%</div>
          <span className="text-[10px] text-emerald-400 mt-1 block">High academic standing</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">Practice Accuracy</span>
          <div className="text-2xl font-black text-amber-300">{metrics.practiceAccuracy}%</div>
          <span className="text-[10px] text-amber-400 mt-1 block">Problem solving rate</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-purple-500/20 bg-purple-500/5 col-span-2 sm:col-span-1">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">Study Hours Logged</span>
          <div className="text-2xl font-black text-purple-300">{metrics.totalStudyHours} <span className="text-xs font-normal">hrs</span></div>
          <span className="text-[10px] text-purple-400 mt-1 block">Diligently spent learning</span>
        </div>
      </div>

      {/* Progress Chart & Recent Tests Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tests */}
        <div className="glass-card p-6 rounded-3xl border border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              <span>Recent Proctored Assessments</span>
            </h3>
            <span className="text-xs text-slate-400">Class 9 Tests</span>
          </div>

          <div className="space-y-3">
            {recentTests.map((t: any) => (
              <div key={t.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{t.testTitle}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Completed: {new Date(t.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-emerald-300">{t.score} / {t.maxScore}</div>
                  <span className="text-[10px] text-sky-400 font-bold">{t.percentage}% Score</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Weak Areas Comparison */}
        <div className="glass-card p-6 rounded-3xl border border-slate-700/80 space-y-4">
          <h3 className="text-sm font-bold text-white">Curriculum Competency Radar</h3>

          <div className="space-y-3">
            <div>
              <span className="text-xs font-bold text-emerald-400 block mb-2">Strengths (Above 80%)</span>
              <div className="space-y-1.5">
                {strengths.map((s: any) => (
                  <div key={s.chapterId} className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
                    <span className="text-white font-medium">{s.name}</span>
                    <span className="text-emerald-300 font-bold">{s.progress}% Mastered</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs font-bold text-amber-400 block mb-2">Areas Needing Home Encouragement</span>
              <div className="space-y-1.5">
                {weakAreas.map((w: any) => (
                  <div key={w.chapterId} className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs">
                    <span className="text-white font-medium">{w.name}</span>
                    <span className="text-amber-300 font-bold">{w.progress}% (Practice Recommended)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations from Teacher and AI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-purple-500/30 space-y-3">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
            <BookOpen className="w-4 h-4" />
            <span>Teacher Recommendations (Dr. Sunita Rao)</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
            {teacherRecommendations.map((rec: string, i: number) => (
              <li key={i} className="flex items-start gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <Check className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-sky-500/30 space-y-3">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>EduMathAI Smart Study Guidance</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
            {aiRecommendations.slice(0, 2).map((rec: any) => (
              <li key={rec.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <strong className="text-white block mb-0.5">{rec.title}</strong>
                <span className="text-slate-400">{rec.reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
