import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Achievement } from '../types';
import confetti from 'canvas-confetti';
import { Award, Lock, CheckCircle2, Sparkles, Flame, Star, Zap } from 'lucide-react';

export const AchievementsPage: React.FC = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchAchs = async () => {
      setLoading(true);
      try {
        const list = await api.getAchievements(user.id);
        setAchievements(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAchs();
  }, [user]);

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalPoints = achievements
    .filter(a => a.isUnlocked)
    .reduce((sum, a) => sum + a.points, 0);

  const handleCelebrate = () => {
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Academic Milestones & Badges
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Student Achievements
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Earn badges and XP by mastering Class 9 math chapters, maintaining practice streaks, and solving challenges.
          </p>
        </div>

        <div className="flex items-center gap-4 text-center">
          <div className="glass-card px-4 py-2 rounded-2xl border border-slate-700">
            <span className="text-[10px] text-slate-400 block font-semibold">Unlocked</span>
            <span className="text-xl font-black text-amber-300">{unlockedCount} / {achievements.length}</span>
          </div>
          <div className="glass-card px-4 py-2 rounded-2xl border border-slate-700">
            <span className="text-[10px] text-slate-400 block font-semibold">Total XP</span>
            <span className="text-xl font-black text-sky-400">{totalPoints}</span>
          </div>
        </div>
      </div>

      {/* Grid of Achievements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            onClick={() => ach.isUnlocked && handleCelebrate()}
            className={`glass-card p-6 rounded-3xl border transition-all duration-200 flex flex-col justify-between ${
              ach.isUnlocked
                ? 'border-amber-500/40 hover:border-amber-400 bg-amber-500/5 cursor-pointer shadow-lg shadow-amber-500/5'
                : 'border-slate-800 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl p-2 rounded-2xl bg-slate-900 border border-slate-800">
                  {ach.icon}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  ach.isUnlocked
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  +{ach.points} XP
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                <span>{ach.title}</span>
                {ach.isUnlocked ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                )}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {ach.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">{ach.category}</span>
              <span className={`font-semibold ${ach.isUnlocked ? 'text-emerald-400' : 'text-slate-500'}`}>
                {ach.isUnlocked ? 'Unlocked' : 'In Progress'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
