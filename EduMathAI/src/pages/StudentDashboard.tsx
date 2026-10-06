import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ChapterProgressItem, Recommendation, TestAttempt } from '../types';
import {
  TrendingUp, Award, Target, BookOpen, Clock, Flame,
  AlertTriangle, ArrowRight, CheckCircle2, Sparkles, CheckSquare,
  PlayCircle, RefreshCw, BarChart2, ShieldCheck, ChevronRight, Lightbulb
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (route: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState<{
    chapters: ChapterProgressItem[];
    weakTopics: ChapterProgressItem[];
    strongTopics: ChapterProgressItem[];
    recentTests: TestAttempt[];
  } | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prog, recs] = await Promise.all([
          api.getProgress(user.id),
          api.getRecommendations(user.id)
        ]);
        setProgressData(prog);
        setRecommendations(recs);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Overall metric fallbacks
  const overallProgress = profile?.overallProgressPercentage || 68;
  const chaptersDone = profile?.chaptersCompleted || 8;
  const questionsCount = profile?.practiceQuestionsAttempted || 124;
  const testAvg = profile?.testAverage || 82;
  const streak = profile?.streakDays || 7;

  // Active chapter to continue learning (e.g. Circles or first weak chapter)
  const currentChapter = progressData?.chapters.find(c => c.chapter.id === 'chap_9') || progressData?.chapters[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Welcome Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-sky-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-br from-sky-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Class 9 Mathematics • {profile?.curriculum || 'CBSE'} Syllabus</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Good morning, {user?.firstName || 'Student'}!
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Ready to improve your mathematics today?
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/student/tutor')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-sky-500/20 transition hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask AI Math Tutor</span>
            </button>
            <button
              onClick={() => onNavigate('/student/practice')}
              className="px-4 py-2.5 rounded-2xl glass-card hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700 transition"
            >
              Start Practice
            </button>
          </div>
        </div>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="glass-card p-4 rounded-2xl border border-sky-500/20 bg-sky-500/5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Overall Progress</span>
            <TrendingUp className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white">{overallProgress}%</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-sky-400 h-full rounded-full" style={{ width: `${overallProgress}%` }} />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Chapters Completed</span>
            <BookOpen className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">{chaptersDone} <span className="text-xs font-normal text-slate-400">/ 15</span></div>
          <p className="text-[11px] text-indigo-300 mt-2">7 remaining in Class 9</p>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Practice Questions</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{questionsCount}</div>
          <p className="text-[11px] text-emerald-300 mt-2">84% overall accuracy</p>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Test Average</span>
            <CheckSquare className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{testAvg}%</div>
          <p className="text-[11px] text-amber-300 mt-2">Across timed unit tests</p>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Current Streak</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white">{streak} <span className="text-xs font-normal text-slate-400">days</span></div>
          <p className="text-[11px] text-rose-300 mt-2">Keep it going tomorrow!</p>
        </div>
      </div>

      {/* Continue Learning & Today's Goal Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning Banner (2 cols) */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-slate-700/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                Continue Learning
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Chapter {currentChapter?.chapter.number || 9}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {currentChapter?.chapter.title || 'Circles'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {currentChapter?.chapter.description || 'Chords, perpendicular from center, cyclic quadrilaterals and central angle theorems.'}
            </p>

            <div className="space-y-1.5 mb-5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Chapter Completion</span>
                <span className="text-white font-bold">{currentChapter?.progressPercentage || 45}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full"
                  style={{ width: `${currentChapter?.progressPercentage || 45}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <span className="text-xs text-slate-400">
              Next: Topic 2 - Angle Subtended by an Arc
            </span>
            <button
              onClick={() => onNavigate(`/student/chapter/${currentChapter?.chapter.id || 'chap_9'}`)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-md shadow-sky-500/20 transition"
            >
              <span>Continue Learning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Today's Goal (1 col) */}
        <div className="glass-card p-6 rounded-3xl border border-slate-700/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Today's Goal</h3>
              <span className="text-xs text-sky-400 font-bold">2 / 3 Completed</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="text-xs font-semibold text-white">10 Practice Questions</p>
                    <p className="text-[10px] text-slate-400">10 / 10 attempted</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">Done</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <div>
                    <p className="text-xs font-semibold text-white">30 Minutes Learning</p>
                    <p className="text-[10px] text-slate-400">24 / 30 mins elapsed</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-bold">80%</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <RefreshCw className="w-4 h-4 text-amber-400" />
                  <div>
                    <p className="text-xs font-semibold text-white">Revision Topic</p>
                    <p className="text-[10px] text-slate-400">Circles formula review</p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('/student/materials')}
                  className="text-[10px] text-sky-400 hover:underline font-bold"
                >
                  Start
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 text-center">
            Daily goals reset every morning at 00:00 IST
          </div>
        </div>
      </div>

      {/* Weak Topics Section & Intelligent Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weak Topics */}
        <div className="glass-card p-6 rounded-3xl border border-amber-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Areas Requiring Improvement</h3>
            </div>
            <span className="text-xs text-amber-300 font-medium">Diagnostic Insights</span>
          </div>

          <div className="space-y-3">
            {[
              { title: 'Chapter 9: Circles', issue: 'Central angle and cyclic quadrilateral proofs', accuracy: '45% accuracy', id: 'chap_9' },
              { title: 'Chapter 7: Triangles', issue: 'Congruence criteria (SAS vs AAA distinction)', accuracy: '60% accuracy', id: 'chap_7' },
              { title: 'Chapter 11: Surface Areas', issue: 'Curved vs Total surface area for cones/cylinders', accuracy: '40% accuracy', id: 'chap_11' }
            ].map((topic, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{topic.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{topic.issue}</p>
                  <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-semibold">
                    {topic.accuracy}
                  </span>
                </div>
                <button
                  onClick={() => onNavigate(`/student/practice?chapterId=${topic.id}`)}
                  className="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-white border border-sky-500/30 text-xs font-bold transition"
                >
                  Target Practice
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Personalized Recommendations */}
        <div className="glass-card p-6 rounded-3xl border border-sky-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
                <Lightbulb className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Recommended for You</h3>
            </div>
            <button
              onClick={() => onNavigate('/student/recommendations')}
              className="text-xs text-sky-400 hover:underline font-semibold"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recommendations.slice(0, 3).map((rec) => (
              <div key={rec.id} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 uppercase">
                      {rec.actionType}
                    </span>
                    <h4 className="text-xs font-bold text-white">{rec.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{rec.reason}</p>
                </div>
                <button
                  onClick={() => {
                    if (rec.actionType === 'TEST') onNavigate('/student/tests');
                    else if (rec.actionType === 'REVISE') onNavigate('/student/materials');
                    else onNavigate(`/student/practice?chapterId=${rec.targetChapterId}`);
                  }}
                  className="shrink-0 p-2 rounded-xl bg-slate-800 text-sky-400 hover:bg-sky-500 hover:text-white transition"
                  title="Execute Recommendation"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="glass-card p-6 rounded-3xl border border-slate-700/80">
        <h3 className="text-sm font-bold text-white mb-4">Recent Learning Activity</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { title: 'Practice Completed', desc: '10 questions in Polynomials', time: 'Today, 2:30 PM', icon: <Target className="w-4 h-4 text-emerald-400" /> },
            { title: 'Chapter Test Evaluated', desc: 'Number Systems - 90% Score', time: 'Yesterday', icon: <CheckSquare className="w-4 h-4 text-sky-400" /> },
            { title: 'Achievement Unlocked', desc: '7 Day Streak 🔥 Milestone', time: '2 days ago', icon: <Award className="w-4 h-4 text-amber-400" /> },
            { title: 'AI Tutor Consultation', desc: 'Cyclic Quadrilateral theorem', time: '3 days ago', icon: <Sparkles className="w-4 h-4 text-purple-400" /> }
          ].map((act, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1 rounded-lg bg-slate-800">{act.icon}</div>
                <span className="text-xs font-bold text-white">{act.title}</span>
              </div>
              <p className="text-xs text-slate-300">{act.desc}</p>
              <p className="text-[10px] text-slate-500 mt-1">{act.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
