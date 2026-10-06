import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Lock, Bell, Globe, Palette, LogOut, CheckCircle2,
  AlertCircle, Shield, KeyRound, Save, Download
} from 'lucide-react';
import { Curriculum } from '../types';
import { downloadProjectZip } from '../utils/download';

export const SettingsPage: React.FC = () => {
  const { user, logout, curriculum, setCurriculum, language, setLanguage } = useAuth();
  const [downloadingZip, setDownloadingZip] = useState(false);

  const handleDownload = async () => {
    setDownloadingZip(true);
    await downloadProjectZip();
    setTimeout(() => setDownloadingZip(false), 1500);
  };

  // Password state
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwStatus, setPwStatus] = useState<{ error?: string; success?: string } | null>(null);
  const [pwLoading, setPwLoading] = useState(false);

  // Preference toggles
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [streakReminders, setStreakReminders] = useState(true);

  if (!user) return null;

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwStatus(null);

    if (newPassword.length < 8) {
      setPwStatus({ error: 'New password must be at least 8 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwStatus({ error: 'New password and confirmation do not match.' });
      return;
    }

    setPwLoading(true);
    try {
      const res = await api.changePassword({
        userId: user.id,
        currentPassword: currPassword,
        newPassword
      });
      setPwStatus({ success: res.message });
      setCurrPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      setPwStatus({ error: e.message || 'Failed to update password.' });
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/80">
        <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
          System Preferences
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Account & App Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
          Manage your security credentials, board curriculum preferences, notification frequencies, and interface options.
        </p>
      </div>

      {/* Security & Password */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/80 space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <KeyRound className="w-5 h-5 text-sky-400" />
          <h2 className="text-base font-bold text-white">Security & Password</h2>
        </div>

        {pwStatus?.error && (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{pwStatus.error}</span>
          </div>
        )}

        {pwStatus?.success && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{pwStatus.success}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Current Password *</label>
            <input
              type="password"
              required
              value={currPassword}
              onChange={(e) => setCurrPassword(e.target.value)}
              placeholder="Demo password: EduMath2026!"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">New Password (Min. 8 chars) *</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter strong new password"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm New Password *</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <button
            type="submit"
            disabled={pwLoading}
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md shadow-sky-500/25 transition disabled:opacity-50"
          >
            {pwLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Curriculum & Language Preferences */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/80 space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Globe className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-white">Curriculum & Localization</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Default Board Curriculum</label>
            <div className="space-y-2">
              {[
                { code: 'CBSE' as Curriculum, label: 'CBSE (NCERT) Class 9' },
                { code: 'AP_STATE' as Curriculum, label: 'Andhra Pradesh (AP) State Board' }
              ].map(item => (
                <label
                  key={item.code}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition ${
                    curriculum === item.code
                      ? 'bg-sky-500/20 border-sky-500 text-white font-semibold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs">{item.label}</span>
                  <input
                    type="radio"
                    name="curriculum"
                    checked={curriculum === item.code}
                    onChange={() => setCurriculum(item.code)}
                    className="text-sky-500 focus:ring-0"
                  />
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Interface Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-500"
            >
              <option value="en">English (Official Standard)</option>
              <option value="hi" disabled>हिन्दी (Hindi - CBSE) [Preview]</option>
              <option value="te" disabled>తెలుగు (Telugu - AP State) [Preview]</option>
            </select>
            <p className="text-[11px] text-slate-500 mt-2">
              EduMathAI supports multilingual Indian regional curriculum standards.
            </p>
          </div>
        </div>
      </div>

      {/* Notifications Preferences */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/80 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Bell className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold text-white">Notification Controls</h2>
        </div>

        <div className="space-y-3">
          {[
            {
              title: 'Daily Practice Reminders',
              desc: 'Get notified at 07:30 IST to maintain your mathematics study streak.',
              checked: streakReminders,
              setter: setStreakReminders
            },
            {
              title: 'Test Score & Evaluation Alerts',
              desc: 'Immediate dispatch when your chapter assessment is graded.',
              checked: emailNotifs,
              setter: setEmailNotifs
            },
            {
              title: 'Interactive Audio & Celebration Effects',
              desc: 'Confetti and sound celebrations when unlocking Class 9 achievements.',
              checked: soundEffects,
              setter: setSoundEffects
            }
          ].map((item, idx) => (
            <label key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-white">{item.title}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(e) => item.setter(e.target.checked)}
                className="rounded border-slate-700 text-sky-500 focus:ring-0 w-4 h-4"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Export Source Code Card */}
      <div className="glass-card rounded-3xl p-6 border border-emerald-500/30 bg-emerald-500/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export Full College Project (.ZIP)</span>
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Download the complete production-ready source code, database schemas, full Class 9 CBSE/State syllabus content, and instructions.
          </p>
        </div>
        <button
          onClick={handleDownload}
          disabled={downloadingZip}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-md shadow-emerald-500/25 transition shrink-0 hover:scale-[1.02] disabled:opacity-70"
        >
          <Download className={`w-4 h-4 ${downloadingZip ? 'animate-bounce' : ''}`} />
          <span>{downloadingZip ? 'Downloading...' : 'Download Project ZIP'}</span>
        </button>
      </div>

      {/* Sign Out Action Card */}
      <div className="glass-card rounded-3xl p-6 border border-rose-500/20 bg-rose-500/5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">Terminate Session</h3>
          <p className="text-xs text-slate-400 mt-0.5">Securely sign out of your active EduMathAI account on this device.</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-500/20 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
