import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { TestAttempt, Test } from '../types';
import {
  Award, CheckCircle2, XCircle, Clock, AlertCircle,
  ArrowRight, RefreshCw, Target, LayoutDashboard, Check, BookOpen
} from 'lucide-react';

interface TestResultPageProps {
  attemptId: string;
  onRetry: (testId: string) => void;
  onPracticeWeak: () => void;
  onBackToDashboard: () => void;
}

export const TestResultPage: React.FC<TestResultPageProps> = ({
  attemptId,
  onRetry,
  onPracticeWeak,
  onBackToDashboard
}) => {
  const [data, setData] = useState<{ attempt: TestAttempt; test: Test } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttempt = async () => {
      setLoading(true);
      try {
        const res = await api.getTestAttemptById(attemptId);
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttempt();
  }, [attemptId]);

  if (loading || !data) {
    return (
      <div className="p-12 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs">Calculating score and compiling review...</p>
      </div>
    );
  }

  const { attempt, test } = data;
  const isPassed = attempt.percentage >= 60;
  const isDistinction = attempt.percentage >= 85;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem}s`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner with Score */}
      <div className={`glass-card rounded-3xl p-6 sm:p-8 border ${
        isDistinction ? 'border-amber-500/40 bg-amber-500/5' :
        isPassed ? 'border-sky-500/40 bg-sky-500/5' : 'border-rose-500/40 bg-rose-500/5'
      }`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2 ${
              isDistinction ? 'bg-amber-500/20 text-amber-300' :
              isPassed ? 'bg-sky-500/20 text-sky-300' : 'bg-rose-500/20 text-rose-300'
            }`}>
              {isDistinction ? '🏆 Outstanding Performance!' : isPassed ? '✓ Passed Assessment' : 'Needs Revision'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Assessment Results
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {attempt.testTitle}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-black text-white">
                {attempt.score} <span className="text-lg font-normal text-slate-400">/ {attempt.maxScore}</span>
              </div>
              <span className="text-xs font-bold text-sky-400">
                {attempt.percentage}% Overall Score
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="glass-card p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Correct Answers</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-300">{attempt.correctCount}</div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Incorrect Answers</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-300">{attempt.incorrectCount}</div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-700/80">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Unanswered</span>
            <AlertCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-300">{attempt.unansweredCount}</div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-sky-500/20 bg-sky-500/5">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold">Time Taken</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-sky-300">{formatTime(attempt.timeTakenSeconds)}</div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => onRetry(test.id)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700 transition"
        >
          <RefreshCw className="w-4 h-4 text-sky-400" />
          <span>Retry Test</span>
        </button>
        <button
          onClick={onPracticeWeak}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition"
        >
          <Target className="w-4 h-4 text-amber-400" />
          <span>Practice Weak Topics</span>
        </button>
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-md shadow-sky-500/20 transition ml-auto"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Question-wise Review */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white">Question-wise Analysis & Explanations</h3>

        {test.questions.map((q, idx) => {
          const studentAns = attempt.answers[q.id];
          const isCorrectAnswer =
            studentAns && String(studentAns).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
          const isBlank = !studentAns || String(studentAns).trim() === '';

          return (
            <div
              key={q.id}
              className={`glass-card p-6 rounded-3xl border space-y-4 ${
                isCorrectAnswer
                  ? 'border-emerald-500/30'
                  : isBlank
                  ? 'border-slate-800'
                  : 'border-rose-500/30'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-white">
                  Question {idx + 1}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isCorrectAnswer
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : isBlank
                    ? 'bg-slate-800 text-slate-400'
                    : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {isCorrectAnswer ? 'Correct (+5)' : isBlank ? 'Unanswered (0)' : 'Incorrect (0)'}
                </span>
              </div>

              <div className="text-sm font-medium text-white leading-relaxed">
                {q.questionText}
              </div>

              {/* Answers Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block mb-1">Your Submitted Answer:</span>
                  <span className={`font-bold ${
                    isCorrectAnswer ? 'text-emerald-400' : isBlank ? 'text-slate-500 italic' : 'text-rose-400'
                  }`}>
                    {studentAns ? String(studentAns) : 'Left Unanswered'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                  <span className="text-emerald-400 block mb-1">Correct Answer:</span>
                  <span className="font-bold text-emerald-300">
                    {q.correctAnswer}
                  </span>
                </div>
              </div>

              {/* Explanation */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-1">
                <strong className="text-white">Explanation: </strong>
                {q.explanation}
                {q.formulaUsed && (
                  <div className="text-[11px] font-mono text-sky-400 pt-1">
                    Theorem / Formula: {q.formulaUsed}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
