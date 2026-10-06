import React, { useState } from 'react';
import {
  GraduationCap, Users, HeartHandshake, School as SchoolIcon, ShieldCheck,
  Sparkles, ArrowRight, BookOpen, CheckCircle, BarChart2, Lightbulb,
  Zap, Award, PlayCircle, MessageSquareQuote, Check, ChevronRight, HelpCircle, Download
} from 'lucide-react';
import { UserRole, Curriculum } from '../types';
import { downloadProjectZip } from '../utils/download';

interface LandingPageProps {
  onSelectPortal: (role: UserRole) => void;
  onNavigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectPortal, onNavigate }) => {
  const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum>('CBSE');
  const [demoDoubt, setDemoDoubt] = useState('');
  const [demoAnswer, setDemoAnswer] = useState<string | null>(null);
  const [demoLoading, setDemoLoading] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);

  const handleDownload = async () => {
    setDownloadingZip(true);
    await downloadProjectZip();
    setTimeout(() => setDownloadingZip(false), 1500);
  };

  const portals = [
    {
      role: 'STUDENT' as UserRole,
      title: 'Student Portal',
      icon: <GraduationCap className="w-8 h-8 text-sky-400" />,
      accent: 'border-sky-500/30 hover:border-sky-400 bg-sky-500/5',
      badge: 'bg-sky-500/20 text-sky-300',
      description: 'Practice CBSE & State syllabus, solve doubts with 24/7 AI tutor, take timed tests and earn achievements.',
      buttonText: 'Student Sign In →',
      features: ['Personalized Practice', '24/7 Gemini Math Tutor', 'Timed Chapter Tests', 'Gamified Streaks']
    },
    {
      role: 'TEACHER' as UserRole,
      title: 'Teacher Portal',
      icon: <Users className="w-8 h-8 text-purple-400" />,
      accent: 'border-purple-500/30 hover:border-purple-400 bg-purple-500/5',
      badge: 'bg-purple-500/20 text-purple-300',
      description: 'Create chapter tests, assign homework, monitor classroom analytics and track student learning gaps.',
      buttonText: 'Teacher Sign In →',
      features: ['Classroom Analytics', 'Assignment Publishing', 'Test Generator', 'Weak Chapter Diagnosis']
    },
    {
      role: 'PARENT' as UserRole,
      title: 'Parent Portal',
      icon: <HeartHandshake className="w-8 h-8 text-emerald-400" />,
      accent: 'border-emerald-500/30 hover:border-emerald-400 bg-emerald-500/5',
      badge: 'bg-emerald-500/20 text-emerald-300',
      description: 'Track live test scores, study streaks, strengths and subject improvement recommendations.',
      buttonText: 'Parent Sign In →',
      features: ['Live Test Scores', 'Study Streak Tracking', 'AI Weakness Radar', 'Action Recommendations']
    },
    {
      role: 'SCHOOL_ADMIN' as UserRole,
      title: 'School Admin',
      icon: <SchoolIcon className="w-8 h-8 text-amber-400" />,
      accent: 'border-amber-500/30 hover:border-amber-400 bg-amber-500/5',
      badge: 'bg-amber-500/20 text-amber-300',
      description: 'Manage teachers, monitor school-wide pass/fail rates, compare class grades and weak chapter metrics.',
      buttonText: 'School Admin Sign In →',
      features: ['School Pass/Fail Metrics', 'Class Comparison', 'Teacher Allocations', 'Curriculum Reports']
    },
    {
      role: 'PLATFORM_ADMIN' as UserRole,
      title: 'Platform Admin',
      icon: <ShieldCheck className="w-8 h-8 text-rose-400" />,
      accent: 'border-rose-500/30 hover:border-rose-400 bg-rose-500/5',
      badge: 'bg-rose-500/20 text-rose-300',
      description: 'Monitor users, platform activity, content and system-level administration.',
      buttonText: 'Platform Admin Sign In →',
      features: ['User Management', 'School Onboarding', 'Question Bank CRUD', 'System Audit Logs']
    }
  ];

  const handleTestSolve = () => {
    if (!demoDoubt.trim()) return;
    setDemoLoading(true);
    setTimeout(() => {
      setDemoAnswer(
        `Step 1: Given problem: "${demoDoubt}".\nStep 2: Apply the Class 9 rule: Identify terms, substitute into the standard identity, and solve step-by-step.\nStep 3: Verification complete! Ask our full 24/7 EduMathAI Tutor inside for comprehensive multi-step interactive walkthroughs.`
      );
      setDemoLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen math-pattern-bg text-slate-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        {/* Subtle glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-sky-500/30 text-sky-300 text-xs font-semibold mb-6 shadow-lg shadow-sky-500/10 animate-fade-in">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>Intelligent Mathematics Learning for Class 9</span>
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-4">
          EduMath<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400">AI</span>
        </h1>

        <p className="text-lg sm:text-2xl font-semibold text-sky-200 tracking-wide mb-3">
          Learn • Practice • Grow
        </p>

        <h2 className="text-base sm:text-xl font-medium text-slate-300 max-w-3xl mx-auto mb-6">
          AI-powered mathematics learning for Class 9 students
        </h2>

        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          Personalized learning, intelligent practice, assessments and a 24/7 AI Mathematics Tutor for CBSE and AP State Board students.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-14">
          <button
            onClick={() => onNavigate('/auth/register')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.02] transition"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="#portals"
            className="px-6 py-3.5 rounded-2xl glass-card hover:bg-slate-800/60 border border-slate-700/80 text-slate-200 font-semibold text-sm transition hover:text-white"
          >
            Explore Portals
          </a>
          <button
            onClick={handleDownload}
            disabled={downloadingZip}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 transition hover:scale-[1.02] disabled:opacity-70"
            title="Download full project ZIP archive"
          >
            <Download className={`w-4 h-4 ${downloadingZip ? 'animate-bounce' : ''}`} />
            <span>{downloadingZip ? 'Downloading ZIP...' : 'Download Project ZIP'}</span>
          </button>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { value: '1 Class', label: 'Dedicated Focus (Class 9)', icon: <BookOpen className="w-5 h-5 text-sky-400" /> },
            { value: '15+ Chapters', label: 'CBSE & AP State Syllabus', icon: <CheckCircle className="w-5 h-5 text-indigo-400" /> },
            { value: '100+ Resources', label: 'Notes, Formulas & Worksheets', icon: <Award className="w-5 h-5 text-emerald-400" /> },
            { value: '24/7 AI Tutor', label: 'Step-by-Step Gemini Guidance', icon: <Sparkles className="w-5 h-5 text-amber-400" /> }
          ].map((stat, i) => (
            <div key={i} className="glass-card p-4 rounded-2xl border border-slate-800/80 text-left">
              <div className="p-2 w-fit rounded-xl bg-slate-900/60 border border-slate-800 mb-2">
                {stat.icon}
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-white">{stat.value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Curriculum Selector Bar */}
      <section className="py-6 px-4 max-w-7xl mx-auto w-full">
        <div className="glass-card p-4 sm:p-5 rounded-3xl border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Dual Curriculum Support</span>
            <h3 className="text-base sm:text-lg font-bold text-white">Choose Your Class 9 Syllabus</h3>
          </div>
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <button
              onClick={() => setSelectedCurriculum('CBSE')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCurriculum === 'CBSE'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              CBSE Class 9
            </button>
            <button
              onClick={() => setSelectedCurriculum('AP_STATE')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCurriculum === 'AP_STATE'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              AP State Board Class 9
            </button>
          </div>
        </div>
      </section>

      {/* Portal Selection Section */}
      <section id="portals" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Role-Based Access</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1 mb-3">
            Select Your Portal to Sign In
          </h2>
          <p className="text-sm text-slate-400">
            Each role features customized permissions, live learning analytics, and dedicated dashboards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portals.map((portal) => (
            <div
              key={portal.role}
              className={`glass-card p-6 rounded-3xl border ${portal.accent} flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 group-hover:scale-105 transition-transform">
                    {portal.icon}
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${portal.badge}`}>
                    {portal.title}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{portal.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {portal.description}
                </p>

                <div className="space-y-2 mb-6">
                  {portal.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                      <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onSelectPortal(portal.role)}
                className="w-full py-3 px-4 rounded-2xl bg-slate-900/90 hover:bg-sky-500 hover:text-white border border-slate-700/80 text-slate-200 text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 group-hover:border-sky-500/50"
              >
                <span>{portal.buttonText}</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive AI Tutor Preview Showcase */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="glass-card rounded-3xl border border-sky-500/20 p-6 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Powered by Gemini AI</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                24/7 AI Mathematics Tutor
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Never get stuck on Class 9 geometry proofs or algebraic expansions again. EduMathAI Tutor breaks complex math problems into step-by-step logic, gives hints, and explains standard CBSE and AP State Board theorems.
              </p>

              <div className="space-y-2.5">
                {[
                  'Explains step-by-step with clear formulas',
                  'Gives hints instead of just final answers',
                  'Targeted to Class 9 NCERT & State Board syllabus',
                  'Available 24 hours a day, 7 days a week'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300">
                    <CheckCircle className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive sample chat card */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/20 flex items-center justify-center font-bold text-sky-400 text-xs">
                    ∑
                  </div>
                  <span className="text-xs font-bold text-white">Live Tutor Preview</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
                  Active
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="p-3 rounded-xl bg-slate-900/90 text-xs text-slate-300 border border-slate-800">
                  <span className="font-semibold text-sky-400">Student:</span> "Why is the opposite angle sum in a cyclic quadrilateral 180°?"
                </div>
                <div className="p-3 rounded-xl bg-sky-950/30 text-xs text-sky-200 border border-sky-500/30">
                  <span className="font-semibold text-white">EduMathAI Tutor:</span>
                  <p className="mt-1">
                    "By the Central Angle Theorem, the arc subtending $\angle BCD$ subtends twice the angle at the center. The sum of opposite central angles is $360^\circ$, so $2\angle A + 2\angle C = 360^\circ \implies \angle A + \angle C = 180^\circ$!"
                  </p>
                </div>
                {demoAnswer && (
                  <div className="p-3 rounded-xl bg-indigo-950/40 text-xs text-indigo-200 border border-indigo-500/40 animate-fade-in whitespace-pre-line">
                    {demoAnswer}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={demoDoubt}
                  onChange={(e) => setDemoDoubt(e.target.value)}
                  placeholder="Ask a quick Class 9 math question..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleTestSolve()}
                />
                <button
                  onClick={handleTestSolve}
                  disabled={demoLoading || !demoDoubt.trim()}
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition disabled:opacity-50"
                >
                  {demoLoading ? 'Solving...' : 'Ask'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/60 py-10 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">EduMathAI</span>
            <span>• Class 9 Mathematics Learning Platform</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>CBSE Curriculum</span>
            <span>AP State Board</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
        <p className="mt-4 text-[11px] text-slate-500">
          © 2026 EduMathAI. All rights reserved. Designed for Class 9 mathematics mastery.
        </p>
      </footer>
    </div>
  );
};
