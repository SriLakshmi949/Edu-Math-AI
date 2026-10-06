import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Chapter, Curriculum, Difficulty } from '../types';
import {
  BookOpen, Calculator, Compass, TrendingUp, Shapes, Spline,
  Triangle, Square, Circle, Hash, Box, BarChart2, Percent, FileCheck,
  Search, ArrowRight, CheckCircle2, Filter
} from 'lucide-react';

interface SyllabusPageProps {
  onSelectChapter: (chapterId: string) => void;
}

export const SyllabusPage: React.FC<SyllabusPageProps> = ({ onSelectChapter }) => {
  const { curriculum, setCurriculum } = useAuth();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  // Mock progress map for Class 9 chapters
  const progressMap: Record<string, number> = {
    chap_1: 95, chap_2: 88, chap_3: 90, chap_4: 75, chap_5: 80,
    chap_6: 70, chap_7: 60, chap_8: 55, chap_9: 45, chap_10: 65,
    chap_11: 40, chap_12: 70, chap_13: 85, chap_14: 30
  };

  useEffect(() => {
    const fetchChapters = async () => {
      setLoading(true);
      try {
        const data = await api.getChapters(curriculum);
        setChapters(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChapters();
  }, [curriculum]);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Binary': return <Calculator className="w-5 h-5 text-sky-400" />;
      case 'Calculator': return <Calculator className="w-5 h-5 text-indigo-400" />;
      case 'Compass': return <Compass className="w-5 h-5 text-emerald-400" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-amber-400" />;
      case 'Shapes': return <Shapes className="w-5 h-5 text-rose-400" />;
      case 'Spline': return <Spline className="w-5 h-5 text-purple-400" />;
      case 'Triangle': return <Triangle className="w-5 h-5 text-cyan-400" />;
      case 'Square': return <Square className="w-5 h-5 text-lime-400" />;
      case 'Circle': return <Circle className="w-5 h-5 text-fuchsia-400" />;
      case 'Hash': return <Hash className="w-5 h-5 text-orange-400" />;
      case 'Box': return <Box className="w-5 h-5 text-teal-400" />;
      case 'BarChart2': return <BarChart2 className="w-5 h-5 text-blue-400" />;
      case 'Percent': return <Percent className="w-5 h-5 text-pink-400" />;
      default: return <FileCheck className="w-5 h-5 text-sky-400" />;
    }
  };

  const filtered = chapters.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'ALL' || c.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
            Academic Curriculum
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Class 9 Mathematics Syllabus
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Comprehensive curriculum coverage for CBSE and AP State Board.
          </p>
        </div>

        {/* Curriculum Selector */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setCurriculum('CBSE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              curriculum === 'CBSE'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            CBSE (NCERT)
          </button>
          <button
            onClick={() => setCurriculum('AP_STATE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              curriculum === 'AP_STATE'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            AP State Board
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chapters or topics..."
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-slate-900/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400 font-medium">Difficulty:</span>
          {['ALL', 'Easy', 'Medium', 'Hard'].map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficultyFilter(diff)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                difficultyFilter === diff
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((chapter) => {
          const progress = progressMap[chapter.id] || 50;
          return (
            <div
              key={chapter.id}
              onClick={() => onSelectChapter(chapter.id)}
              className="glass-card p-5 rounded-3xl border border-slate-700/80 flex flex-col justify-between cursor-pointer group hover:border-sky-500/50 hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 group-hover:scale-105 transition-transform">
                      {getIcon(chapter.iconName)}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wide">
                        Chapter {chapter.number}
                      </span>
                      <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                        {chapter.title}
                      </h3>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      chapter.difficulty === 'Easy'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : chapter.difficulty === 'Medium'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {chapter.difficulty}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-4">
                  {chapter.description}
                </p>

                {/* Progress bar */}
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Mastery Progress</span>
                    <span className="text-white font-bold">{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span>{chapter.totalLessons} Lessons</span>
                  <span>•</span>
                  <span>{chapter.totalQuestions} Questions</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectChapter(chapter.id);
                  }}
                  className="flex items-center gap-1 text-xs font-bold text-sky-400 group-hover:text-sky-300"
                >
                  <span>{progress > 0 ? 'Continue' : 'Start'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
