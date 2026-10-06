import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole, Curriculum } from '../types';
import {
  Lock, Mail, User, Phone, School, BookOpen, KeyRound,
  GraduationCap, Users, HeartHandshake, ShieldCheck, AlertCircle,
  ArrowRight, Check, Sparkles, Eye, EyeOff
} from 'lucide-react';
import { RoleBadge } from '../components/RoleBadge';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
  initialRole?: UserRole;
  onSuccess: (role: UserRole) => void;
  onNavigateHome: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  initialRole = 'STUDENT',
  onSuccess,
  onNavigateHome
}) => {
  const { login, demoLogin, register } = useAuth();
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [school, setSchool] = useState('Delhi Public International School');
  const [curriculum, setCurriculum] = useState<Curriculum>('CBSE');
  const [guardianName, setGuardianName] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [schoolCode, setSchoolCode] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDemoFill = async (role: UserRole) => {
    setError(null);
    setLoading(true);
    try {
      await demoLogin(role);
      onSuccess(role);
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isLogin) {
      if (!email || !password) {
        setError('Please enter both email and password.');
        return;
      }
      setLoading(true);
      try {
        await login({ email, password, role: selectedRole });
        onSuccess(selectedRole);
      } catch (err: any) {
        setError(err.message || 'Login failed. Please verify credentials.');
      } finally {
        setLoading(false);
      }
    } else {
      // Registration validation
      if (!firstName || !lastName || !email || !password) {
        setError('Please complete all required fields.');
        return;
      }
      if (password.length < 8) {
        setError('Password must contain at least 8 characters.');
        return;
      }
      if (!agreedTerms) {
        setError('Please agree to the Terms of Service & Privacy Policy.');
        return;
      }
      setLoading(true);
      try {
        await register({
          role: selectedRole,
          firstName,
          lastName,
          email,
          password,
          phone,
          school,
          curriculum,
          guardianName,
          subject,
          schoolCode
        });
        onSuccess(selectedRole);
      } catch (err: any) {
        setError(err.message || 'Registration failed.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setError('Please provide your registered email address.');
      return;
    }
    setForgotMsg(`A password reset link and testing credentials (EduMath2026!) have been sent to ${forgotEmail}.`);
  };

  return (
    <div className="min-h-screen math-pattern-bg py-10 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-xl w-full">
        {/* Brand header */}
        <div className="text-center mb-6">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 mb-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <span className="font-extrabold text-white text-base">∑</span>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              EduMath<span className="text-sky-400">AI</span>
            </span>
          </button>
          <p className="text-xs text-slate-400">Class 9 Mathematics Portal Authentication</p>
        </div>

        {/* Demo Credentials Quick-Fill Banner */}
        <div className="glass-card rounded-2xl p-3.5 mb-5 border border-sky-500/30 bg-sky-950/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              Demo Credentials (1-Click Instant Sign In)
            </span>
            <span className="text-[10px] text-slate-400">PW: EduMath2026!</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {[
              { role: 'STUDENT' as UserRole, label: 'Student', color: 'hover:bg-sky-500/20 text-sky-300 border-sky-500/30' },
              { role: 'TEACHER' as UserRole, label: 'Teacher', color: 'hover:bg-purple-500/20 text-purple-300 border-purple-500/30' },
              { role: 'PARENT' as UserRole, label: 'Parent', color: 'hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
              { role: 'SCHOOL_ADMIN' as UserRole, label: 'School Admin', color: 'hover:bg-amber-500/20 text-amber-300 border-amber-500/30' },
              { role: 'PLATFORM_ADMIN' as UserRole, label: 'Platform Admin', color: 'hover:bg-rose-500/20 text-rose-300 border-rose-500/30' }
            ].map(item => (
              <button
                key={item.role}
                onClick={() => handleDemoFill(item.role)}
                disabled={loading}
                className={`px-2 py-1.5 rounded-xl border text-[11px] font-semibold bg-slate-900/60 transition text-center truncate ${item.color}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <div className="glass-card rounded-3xl border border-slate-700/80 p-6 sm:p-8 shadow-2xl">
          {/* Tab Switcher: Login / Register */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-900/80 border border-slate-800 mb-6">
            <button
              onClick={() => { setIsLogin(true); setError(null); }}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                isLogin ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(null); }}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                !isLogin ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25' : 'text-slate-400 hover:text-white'
              }`}
            >
              Register Account
            </button>
          </div>

          {/* Role Selector Tabs */}
          <div className="mb-5">
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { role: 'STUDENT' as UserRole, label: 'Student', icon: <GraduationCap className="w-3.5 h-3.5" /> },
                { role: 'TEACHER' as UserRole, label: 'Teacher', icon: <Users className="w-3.5 h-3.5" /> },
                { role: 'PARENT' as UserRole, label: 'Parent', icon: <HeartHandshake className="w-3.5 h-3.5" /> },
                { role: 'SCHOOL_ADMIN' as UserRole, label: 'School Admin', icon: <School className="w-3.5 h-3.5" /> }
              ].map(r => (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => setSelectedRole(r.role)}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold border transition ${
                    selectedRole === r.role
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500 shadow-sm'
                      : 'bg-slate-900/40 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {r.icon}
                  <span>{r.label}</span>
                </button>
              ))}
            </div>
            {isLogin && (
              <div className="mt-2 text-right">
                <button
                  type="button"
                  onClick={() => setSelectedRole('PLATFORM_ADMIN')}
                  className={`text-[11px] font-medium transition ${
                    selectedRole === 'PLATFORM_ADMIN' ? 'text-rose-400 font-bold' : 'text-slate-500 hover:text-slate-400'
                  }`}
                >
                  Sign in as Platform Admin →
                </button>
              </div>
            )}
          </div>

          {/* Error Message Alert */}
          {error && (
            <div className="p-3 mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Aarav"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Sharma"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                {selectedRole === 'STUDENT' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Curriculum *</label>
                        <select
                          value={curriculum}
                          onChange={(e) => setCurriculum(e.target.value as Curriculum)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-500"
                        >
                          <option value="CBSE">CBSE Class 9</option>
                          <option value="AP_STATE">AP State Board Class 9</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Parent Name</label>
                        <input
                          type="text"
                          value={guardianName}
                          onChange={(e) => setGuardianName(e.target.value)}
                          placeholder="e.g. Vikram Sharma"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                        />
                      </div>
                    </div>
                  </>
                )}

                {selectedRole === 'TEACHER' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Subject Specialization</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                )}

                {selectedRole === 'SCHOOL_ADMIN' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">School Code</label>
                    <input
                      type="text"
                      value={schoolCode}
                      onChange={(e) => setSchoolCode(e.target.value)}
                      placeholder="e.g. DPIS-HYD-09"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">School / Institute</label>
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@edumathai.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">Password *</label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-[11px] text-sky-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full pl-9 pr-10 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <label className="flex items-start gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-sky-500 focus:ring-0"
                />
                <span className="text-[11px] text-slate-400 leading-tight">
                  I agree to the EduMathAI Terms of Service, Class 9 Academic Code, and Privacy Policy.
                </span>
              </label>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-sky-500/25 transition disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{isLogin ? `Sign In to ${selectedRole.replace('_', ' ')} Portal` : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <div className="glass-card max-w-md w-full p-6 rounded-3xl border border-slate-700 shadow-2xl">
              <h3 className="text-base font-bold text-white mb-2">Reset Password</h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Enter your registered EduMathAI email address. We will verify your account and provide reset instructions.
              </p>
              {forgotMsg ? (
                <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                  {forgotMsg}
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-3">
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-sky-500 text-white text-xs font-bold"
                  >
                    Send Reset Instructions
                  </button>
                </form>
              )}
              <button
                onClick={() => { setShowForgotPassword(false); setForgotMsg(null); }}
                className="w-full mt-2 py-2 text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
