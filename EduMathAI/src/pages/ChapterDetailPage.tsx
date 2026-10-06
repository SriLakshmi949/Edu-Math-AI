import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Chapter, StudyMaterial, Test } from '../types';
import { MaterialModal } from '../components/MaterialModal';
import {
  ArrowLeft, BookOpen, CheckCircle, FileText, Target,
  CheckSquare, Sparkles, ChevronRight, Clock, Download, Eye, Award
} from 'lucide-react';

interface ChapterDetailPageProps {
  chapterId: string;
  onBack: () => void;
  onStartPractice: (chapterId: string) => void;
  onStartTest: (testId: string) => void;
  onOpenTutor: (chapterTitle: string) => void;
}

export const ChapterDetailPage: React.FC<ChapterDetailPageProps> = ({
  chapterId,
  onBack,
  onStartPractice,
  onStartTest,
  onOpenTutor
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'concepts' | 'materials' | 'practice' | 'test'>('overview');
  const [data, setData] = useState<{
    chapter: Chapter;
    materials: StudyMaterial[];
    questionsCount: number;
    tests: Test[];
  } | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await api.getChapterDetails(chapterId);
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [chapterId]);

  const handleDownload = (mat: StudyMaterial) => {
    window.location.href = `/api/materials/${mat.id}/download`;
  };

  if (loading || !data) {
    return (
      <div className="p-12 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs">Loading Class 9 chapter details...</p>
      </div>
    );
  }

  const { chapter, materials, tests } = data;
  const chapterProgress = 65; // Mock progress for details view

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Back button & top header */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-sky-400 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Syllabus</span>
      </button>

      {/* Chapter Hero Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/80">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                Chapter {chapter.number}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {chapter.difficulty}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              {chapter.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              {chapter.description}
            </p>

            {/* Progress bar */}
            <div className="space-y-1.5 max-w-md">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Chapter Completion</span>
                <span className="text-white font-bold">{chapterProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full"
                  style={{ width: `${chapterProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => onStartPractice(chapter.id)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-sky-500/20 transition"
            >
              <Target className="w-4 h-4" />
              <span>Start Practice</span>
            </button>
            <button
              onClick={() => tests.length > 0 ? onStartTest(tests[0].id) : onStartTest('test_1')}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl glass-card hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition"
            >
              <CheckSquare className="w-4 h-4 text-amber-400" />
              <span>Take Chapter Test</span>
            </button>
            <button
              onClick={() => onOpenTutor(chapter.title)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold transition"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Ask AI Tutor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { key: 'overview', label: 'Overview', icon: <BookOpen className="w-4 h-4" /> },
          { key: 'concepts', label: 'Concepts & Topics', icon: <FileText className="w-4 h-4" />, count: chapter.topics.length },
          { key: 'materials', label: 'Study Material', icon: <Download className="w-4 h-4" />, count: materials.length },
          { key: 'practice', label: 'Practice', icon: <Target className="w-4 h-4" /> },
          { key: 'test', label: 'Assessments', icon: <CheckSquare className="w-4 h-4" />, count: tests.length }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition shrink-0 ${
              activeTab === tab.key
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === tab.key ? 'bg-sky-700 text-white' : 'bg-slate-800 text-slate-300'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: 1. Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in">
          {/* Learning Objectives */}
          <div className="glass-card p-6 rounded-3xl border border-slate-700/80">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-sky-400" />
              <span>Learning Objectives</span>
            </h3>
            <div className="space-y-3">
              {chapter.learningObjectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-3 text-xs text-slate-300 leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Formulas and Key Points */}
          <div className="glass-card p-6 rounded-3xl border border-slate-700/80">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Essential Formulas & Theorems</span>
            </h3>
            <div className="space-y-2.5">
              {chapter.formulaSummary.map((formula, i) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 font-mono text-xs text-sky-300">
                  {formula}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. Concepts */}
      {activeTab === 'concepts' && (
        <div className="space-y-3.5 animate-in fade-in">
          {chapter.topics.map((topic) => (
            <div
              key={topic.id}
              className="glass-card p-5 rounded-2xl border border-slate-700/80 flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-sky-400 shrink-0">
                  {topic.order}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{topic.title}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{topic.summary}</p>
                </div>
              </div>
              <button
                onClick={() => onOpenTutor(`${chapter.title} - ${topic.title}`)}
                className="shrink-0 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-sky-500/20 text-sky-400 text-xs font-semibold border border-slate-700 hover:border-sky-500/30 transition flex items-center gap-1.5"
              >
                <span>Explain Topic</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: 3. Study Material */}
      {activeTab === 'materials' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
          {materials.map((mat) => (
            <div
              key={mat.id}
              className="glass-card p-5 rounded-2xl border border-slate-700/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400">
                    {mat.type}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {mat.readTime}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5">{mat.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-4">
                  {mat.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setSelectedMaterial(mat)}
                  className="flex items-center gap-1.5 text-xs font-bold text-sky-400 hover:text-sky-300 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Notes</span>
                </button>
                <button
                  onClick={() => handleDownload(mat)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: 4. Practice */}
      {activeTab === 'practice' && (
        <div className="glass-card p-8 rounded-3xl border border-slate-700/80 text-center max-w-xl mx-auto space-y-4 animate-in fade-in">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto shadow-lg shadow-sky-500/20">
            <Target className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Interactive Practice Session</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Solve questions tailored to {chapter.title}. Receive immediate step-by-step feedback, hints, and explanations on every attempt.
          </p>
          <button
            onClick={() => onStartPractice(chapter.id)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-xs shadow-lg shadow-sky-500/20 hover:scale-[1.02] transition"
          >
            Start Practice Now →
          </button>
        </div>
      )}

      {/* TAB CONTENT: 5. Test */}
      {activeTab === 'test' && (
        <div className="space-y-4 animate-in fade-in">
          {tests.map((test) => (
            <div
              key={test.id}
              className="glass-card p-6 rounded-2xl border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 uppercase">
                  {test.type}
                </span>
                <h4 className="text-base font-bold text-white mt-1">{test.title}</h4>
                <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                  <span>{test.durationMinutes} Minutes</span>
                  <span>•</span>
                  <span>{test.totalMarks} Marks</span>
                  <span>•</span>
                  <span>{test.questionCount} Questions</span>
                </div>
              </div>
              <button
                onClick={() => onStartTest(test.id)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-md shadow-sky-500/20 transition"
              >
                Start Assessment →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Material Modal Dialog */}
      <MaterialModal
        material={selectedMaterial}
        onClose={() => setSelectedMaterial(null)}
        onDownload={handleDownload}
      />
    </div>
  );
};
