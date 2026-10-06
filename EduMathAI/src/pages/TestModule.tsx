import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Test, TestAttempt, Question } from '../types';
import confetti from 'canvas-confetti';
import {
  CheckSquare, Clock, AlertTriangle, ArrowRight, ArrowLeft,
  Bookmark, CheckCircle2, XCircle, Award, RefreshCw, BarChart2
} from 'lucide-react';

interface TestModuleProps {
  initialTestId?: string;
  onNavigateToResult: (attemptId: string) => void;
  onNavigate: (route: string) => void;
}

export const TestModule: React.FC<TestModuleProps> = ({
  initialTestId,
  onNavigateToResult,
  onNavigate
}) => {
  const { user, curriculum } = useAuth();
  const [tests, setTests] = useState<Test[]>([]);
  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load available tests
  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      try {
        const data = await api.getTests(curriculum);
        setTests(data);
        if (initialTestId) {
          const matched = data.find(t => t.id === initialTestId);
          if (matched) {
            startTest(matched);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, [curriculum, initialTestId]);

  // Timer countdown
  useEffect(() => {
    if (!activeTest || timeLeftSeconds <= 0) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTest, timeLeftSeconds]);

  const startTest = (test: Test) => {
    setActiveTest(test);
    setCurrentQuestionIdx(0);
    setAnswers({});
    setMarkedForReview({});
    setTimeLeftSeconds(test.durationMinutes * 60);
  };

  const handleSelectAnswer = (qId: string, val: string) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleToggleReview = (qId: string) => {
    setMarkedForReview(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleSubmitTest = async () => {
    if (!activeTest || !user || submitting) return;
    setSubmitting(true);
    try {
      const timeTaken = (activeTest.durationMinutes * 60) - timeLeftSeconds;
      const attempt = await api.submitTest(activeTest.id, {
        studentId: user.id,
        answers,
        timeTakenSeconds: timeTaken > 0 ? timeTaken : 120
      });
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      onNavigateToResult(attempt.id);
    } catch (e) {
      console.error('Failed to submit test:', e);
      alert('Failed to submit test. Please check network.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // 1. TEST LIST VIEW
  if (!activeTest) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/80">
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
            Standardized Assessments
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Class 9 Mathematics Tests
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Timed chapter assessments, unit tests, and full syllabus mock exams calibrated to CBSE and AP State Board standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tests.map(test => (
            <div
              key={test.id}
              className="glass-card p-6 rounded-3xl border border-slate-700/80 flex flex-col justify-between hover:border-sky-500/40 transition group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    {test.type}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    {test.durationMinutes} mins
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                  {test.title}
                </h3>

                <div className="space-y-1.5 mb-5 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    <span>Total Marks: {test.totalMarks} Marks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    <span>Questions: {test.questionCount} Questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    <span>Negative Marking: None</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500">Class 9 Exam Engine</span>
                <button
                  onClick={() => startTest(test)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition hover:scale-[1.02]"
                >
                  Start Assessment →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. ACTIVE TEST RUNNER VIEW
  const currentQuestion = activeTest.questions[currentQuestionIdx];
  const isMarked = markedForReview[currentQuestion?.id];
  const isAnswered = !!answers[currentQuestion?.id];

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Test Running Header */}
      <div className="glass-card rounded-2xl px-5 py-3 border border-slate-700/80 flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
            {activeTest.type}
          </span>
          <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-md">
            {activeTest.title}
          </h2>
        </div>

        {/* Live Timer */}
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-sm font-bold border shadow-inner ${
            timeLeftSeconds < 180
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
              : 'bg-slate-900 text-sky-300 border-slate-700'
          }`}>
            <Clock className="w-4 h-4 text-sky-400" />
            <span>{formatTimer(timeLeftSeconds)}</span>
          </div>

          <button
            onClick={handleSubmitTest}
            disabled={submitting}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Test'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Question Panel (3 cols) */}
        <div className="lg:col-span-3 glass-card rounded-3xl border border-slate-700/80 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs font-bold text-sky-400">
                Question {currentQuestionIdx + 1} of {activeTest.questions.length}
              </span>
              <button
                onClick={() => handleToggleReview(currentQuestion.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition ${
                  isMarked
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isMarked ? 'Marked for Review' : 'Mark for Review'}</span>
              </button>
            </div>

            <div className="text-base sm:text-lg font-medium text-white leading-relaxed mb-6">
              {currentQuestion.questionText}
            </div>

            {/* Answer Options */}
            {currentQuestion.options && currentQuestion.options.length > 0 ? (
              <div className="space-y-3">
                {currentQuestion.options.map(opt => {
                  const isSelected = answers[currentQuestion.id] === opt.label;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectAnswer(currentQuestion.id, opt.label)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3 transition ${
                        isSelected
                          ? 'bg-sky-500/20 border-sky-500 text-white font-semibold shadow-md shadow-sky-500/10'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {opt.label}
                      </span>
                      <span className="text-xs sm:text-sm pt-0.5 leading-relaxed">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="max-w-md">
                <label className="block text-xs text-slate-400 mb-1">Enter your final answer:</label>
                <input
                  type="text"
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleSelectAnswer(currentQuestion.id, e.target.value)}
                  placeholder="Numerical value or algebraic term"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            )}
          </div>

          {/* Navigation between questions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              disabled={currentQuestionIdx === 0}
              onClick={() => setCurrentQuestionIdx(currentQuestionIdx - 1)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold disabled:opacity-40"
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const copy = { ...answers };
                  delete copy[currentQuestion.id];
                  setAnswers(copy);
                }}
                className="text-xs text-slate-400 hover:text-rose-400 transition"
              >
                Clear Response
              </button>

              <button
                onClick={() => {
                  if (currentQuestionIdx < activeTest.questions.length - 1) {
                    setCurrentQuestionIdx(currentQuestionIdx + 1);
                  }
                }}
                disabled={currentQuestionIdx === activeTest.questions.length - 1}
                className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition disabled:opacity-40"
              >
                Save & Next
              </button>
            </div>
          </div>
        </div>

        {/* Question Palette Sidebar (1 col) */}
        <div className="glass-card rounded-3xl border border-slate-700/80 p-5 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Question Palette
          </h3>

          <div className="grid grid-cols-4 gap-2">
            {activeTest.questions.map((q, idx) => {
              const answered = !!answers[q.id];
              const reviewed = !!markedForReview[q.id];
              const isCurrent = idx === currentQuestionIdx;

              let bg = 'bg-slate-900 text-slate-400 border-slate-800';
              if (reviewed) bg = 'bg-amber-500/20 text-amber-300 border-amber-500';
              else if (answered) bg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500';

              if (isCurrent) bg += ' ring-2 ring-sky-400';

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIdx(idx)}
                  className={`h-9 rounded-xl border text-xs font-bold flex items-center justify-center transition ${bg}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="pt-3 border-t border-slate-800 space-y-2 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500" />
              <span>Answered ({Object.keys(answers).length})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-amber-500/30 border border-amber-500" />
              <span>Marked for Review ({Object.values(markedForReview).filter(Boolean).length})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-slate-900 border border-slate-800" />
              <span>Unanswered ({activeTest.questions.length - Object.keys(answers).length})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
