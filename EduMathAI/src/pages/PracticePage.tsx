import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Question, Chapter } from '../types';
import confetti from 'canvas-confetti';
import {
  Target, CheckCircle2, XCircle, Lightbulb, ArrowRight,
  RefreshCw, Check, Sparkles, Clock, BookOpen, AlertCircle
} from 'lucide-react';

interface PracticePageProps {
  initialChapterId?: string;
  onOpenTutor: (query: string) => void;
}

export const PracticePage: React.FC<PracticePageProps> = ({ initialChapterId, onOpenTutor }) => {
  const { user } = useAuth();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string>(initialChapterId || 'ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Session tallies
  const [sessionAttempted, setSessionAttempted] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [startTime] = useState<number>(Date.now());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const [chaps, qs] = await Promise.all([
          api.getChapters(),
          api.getPracticeQuestions({
            chapterId: selectedChapter,
            difficulty: selectedDifficulty,
            type: selectedType
          })
        ]);
        setChapters(chaps);
        setQuestions(qs);
        setCurrentIndex(0);
        setSelectedAnswer('');
        setIsSubmitted(false);
        setShowHint(false);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [selectedChapter, selectedDifficulty, selectedType]);

  const currentQ = questions[currentIndex];

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer.trim() || !currentQ || !user) return;

    const correct = selectedAnswer.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();
    setIsCorrect(correct);
    setIsSubmitted(true);

    const newAttempted = sessionAttempted + 1;
    const newCorrect = sessionCorrect + (correct ? 1 : 0);
    setSessionAttempted(newAttempted);
    setSessionCorrect(newCorrect);

    if (correct) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    }

    // Persist session progress to backend
    try {
      await api.submitPractice({
        studentId: user.id,
        chapterId: currentQ.chapterId,
        chapterName: chapters.find(c => c.id === currentQ.chapterId)?.title || 'Class 9 Math',
        questionsAttempted: 1,
        correctAnswers: correct ? 1 : 0,
        timeSpentSeconds: Math.round((Date.now() - startTime) / 1000)
      });
    } catch (e) {
      console.error('Failed to submit practice progress:', e);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer('');
      setIsSubmitted(false);
      setShowHint(false);
    }
  };

  const accuracy = sessionAttempted > 0 ? Math.round((sessionCorrect / sessionAttempted) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="glass-card rounded-3xl p-6 border border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
            Interactive Problem Solving
          </span>
          <h1 className="text-2xl font-extrabold text-white mt-1">Class 9 Math Practice</h1>
          <p className="text-xs text-slate-300 mt-1">
            Solve problems with immediate step-by-step guidance and formula explanations.
          </p>
        </div>

        {/* Live Session Metrics */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="px-3.5 py-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-semibold">Attempted</span>
            <span className="text-sm font-bold text-white">{sessionAttempted}</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
            <span className="text-[10px] text-emerald-400 block font-semibold">Correct</span>
            <span className="text-sm font-bold text-emerald-300">{sessionCorrect}</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-center">
            <span className="text-[10px] text-sky-400 block font-semibold">Accuracy</span>
            <span className="text-sm font-bold text-sky-300">{accuracy}%</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-700/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Chapter
          </label>
          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">All Class 9 Chapters</option>
            {chapters.map(c => (
              <option key={c.id} value={c.id}>Ch {c.number}: {c.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Difficulty
          </label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Question Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">All Question Formats</option>
            <option value="MCQ">Multiple Choice (MCQ)</option>
            <option value="Numerical">Numerical Value</option>
            <option value="True/False">True / False</option>
            <option value="Fill in the blank">Fill in the blank</option>
          </select>
        </div>
      </div>

      {/* Main Practice Question Card */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 glass-card rounded-3xl">
          <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs">Loading practice questions...</p>
        </div>
      ) : !currentQ ? (
        <div className="p-12 text-center text-slate-400 glass-card rounded-3xl space-y-3">
          <Target className="w-8 h-8 mx-auto text-slate-500" />
          <p className="text-sm font-semibold text-white">No questions match your filter.</p>
          <button
            onClick={() => { setSelectedChapter('ALL'); setSelectedDifficulty('ALL'); setSelectedType('ALL'); }}
            className="px-4 py-2 rounded-xl bg-sky-500 text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="glass-card rounded-3xl border border-slate-700/80 p-6 sm:p-8 space-y-6">
          {/* Question Header & Meta */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-400">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {currentQ.type}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                currentQ.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
                currentQ.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                'bg-rose-500/20 text-rose-400'
              }`}>
                {currentQ.difficulty}
              </span>
            </div>

            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold"
            >
              <Lightbulb className="w-4 h-4" />
              <span>{showHint ? 'Hide Hint' : 'Get Hint'}</span>
            </button>
          </div>

          {/* Hint Card */}
          {showHint && currentQ.hints && currentQ.hints.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1 animate-in fade-in">
              <span className="font-bold flex items-center gap-1.5 text-amber-300">
                <Lightbulb className="w-3.5 h-3.5" /> Conceptual Hint:
              </span>
              {currentQ.hints.map((h, i) => (
                <p key={i} className="pl-5 leading-relaxed">• {h}</p>
              ))}
            </div>
          )}

          {/* Question Text */}
          <div className="text-base sm:text-lg font-medium text-white leading-relaxed">
            {currentQ.questionText}
          </div>

          {/* Options / Input Form */}
          <div className="space-y-3">
            {currentQ.options && currentQ.options.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedAnswer === opt.label;
                  let cardStyle = 'bg-slate-900/60 border-slate-700/80 text-slate-200 hover:border-slate-600';

                  if (isSubmitted) {
                    if (opt.label === currentQ.correctAnswer) {
                      cardStyle = 'bg-emerald-500/20 border-emerald-500 text-white font-bold';
                    } else if (isSelected && !isCorrect) {
                      cardStyle = 'bg-rose-500/20 border-rose-500 text-white';
                    }
                  } else if (isSelected) {
                    cardStyle = 'bg-sky-500/20 border-sky-500 text-white font-semibold';
                  }

                  return (
                    <button
                      key={opt.id}
                      disabled={isSubmitted}
                      onClick={() => setSelectedAnswer(opt.label)}
                      className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition ${cardStyle}`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-slate-800 text-xs font-bold flex items-center justify-center shrink-0">
                        {opt.label}
                      </span>
                      <span className="text-xs sm:text-sm pt-0.5 leading-relaxed">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="max-w-md">
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Your Answer:
                </label>
                <input
                  type="text"
                  disabled={isSubmitted}
                  value={selectedAnswer}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  placeholder="Enter final calculated number or term"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            )}
          </div>

          {/* Solution & Explanation Feedback */}
          {isSubmitted && (
            <div className={`p-5 rounded-2xl border animate-in fade-in space-y-2 ${
              isCorrect
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-300">Correct! Outstanding reasoning.</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-400" />
                    <span className="text-rose-300">
                      Incorrect. The correct answer is: <strong className="text-white underline">{currentQ.correctAnswer}</strong>
                    </span>
                  </>
                )}
              </div>

              <div className="text-xs text-slate-300 leading-relaxed pt-1">
                <strong className="text-white">Explanation: </strong>
                {currentQ.explanation}
              </div>

              {currentQ.formulaUsed && (
                <div className="text-[11px] font-mono text-sky-300 pt-1">
                  Formula applied: {currentQ.formulaUsed}
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={() => onOpenTutor(`Please explain how to solve: "${currentQ.questionText}"`)}
                  className="text-xs text-sky-400 hover:underline font-semibold flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask AI Tutor to explain step-by-step</span>
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              CBSE & AP State Class 9 Question Bank
            </span>

            <div className="flex items-center gap-3">
              {!isSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer.trim()}
                  className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-md shadow-sky-500/20 transition disabled:opacity-50"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-bold shadow-md shadow-sky-500/20 transition hover:scale-[1.02]"
                >
                  <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Completed'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
