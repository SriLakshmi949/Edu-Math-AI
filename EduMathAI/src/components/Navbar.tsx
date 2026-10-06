import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { RoleBadge } from './RoleBadge';
import { NotificationsDropdown } from './NotificationsDropdown';
import {
  Sparkles, Globe, LogOut, User as UserIcon, Settings, ChevronDown,
  Menu, X, BookOpen, Calculator, Download
} from 'lucide-react';
import { Curriculum } from '../types';
import { downloadProjectZip } from '../utils/download';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  onNavigate: (route: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen, onNavigate }) => {
  const { user, profile, logout, curriculum, setCurriculum, language, setLanguage } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);

  const handleDownload = async () => {
    setDownloadingZip(true);
    await downloadProjectZip();
    setTimeout(() => setDownloadingZip(false), 1500);
  };

  const languages = [
    { code: 'en', label: 'English (US/IN)', active: true },
    { code: 'hi', label: 'हिन्दी (Hindi - CBSE)', active: false, badge: 'Coming soon' },
    { code: 'te', label: 'తెలుగు (Telugu - AP State)', active: false, badge: 'Coming soon' }
  ];

  return (
    <header className="sticky top-0 z-30 w-full glass-nav border-b border-slate-800/80 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center gap-3">
          {user && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
              aria-label="Toggle navigation menu"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <div
            onClick={() => onNavigate(user ? (user.role === 'STUDENT' ? '/student/dashboard' : '/dashboard') : '/')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-white text-lg tracking-wider">∑</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-white tracking-tight group-hover:text-sky-300 transition-colors">
                  EduMath<span className="text-sky-400">AI</span>
                </span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  Class 9
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                Learn • Practice • Grow
              </p>
            </div>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Curriculum Switcher for Students & Teachers */}
          {user && (user.role === 'STUDENT' || user.role === 'TEACHER') && (
            <div className="hidden sm:flex items-center p-1 rounded-xl bg-slate-900/80 border border-slate-700/60 shadow-inner">
              <button
                onClick={() => setCurriculum('CBSE')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  curriculum === 'CBSE'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                CBSE
              </button>
              <button
                onClick={() => setCurriculum('AP_STATE')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  curriculum === 'AP_STATE'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                AP State Board
              </button>
            </div>
          )}

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 transition"
              title="Select Language"
            >
              <Globe className="w-4 h-4 text-sky-400" />
              <span className="hidden md:inline uppercase">{language}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLangMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-card border border-slate-700/80 shadow-2xl z-50 p-1.5">
                  <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 border-b border-slate-700/60">
                    Platform Language
                  </div>
                  {languages.map(l => (
                    <button
                      key={l.code}
                      onClick={() => {
                        if (l.active) {
                          setLanguage(l.code);
                          setLangMenuOpen(false);
                        }
                      }}
                      disabled={!l.active}
                      className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center justify-between transition ${
                        language === l.code
                          ? 'bg-sky-500/20 text-sky-300 font-semibold'
                          : l.active
                          ? 'text-slate-200 hover:bg-slate-800/60'
                          : 'text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <span>{l.label}</span>
                      {l.badge && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {l.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Download Project ZIP Button */}
          <button
            onClick={handleDownload}
            disabled={downloadingZip}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 shadow-md shadow-emerald-500/20 transition hover:scale-[1.02] disabled:opacity-70"
            title="Download complete project source archive (.zip)"
          >
            <Download className={`w-3.5 h-3.5 ${downloadingZip ? 'animate-bounce' : ''}`} />
            <span className="hidden sm:inline">{downloadingZip ? 'Downloading...' : 'Project ZIP'}</span>
            <span className="sm:hidden">{downloadingZip ? '...' : 'ZIP'}</span>
          </button>

          {user ? (
            <>
              {/* Notifications */}
              <NotificationsDropdown userId={user.id} onNavigate={onNavigate} />

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-2xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/60 transition group"
                >
                  <RoleBadge role={user.role} showIcon={false} size="sm" />
                  <div className="hidden lg:block text-left pr-1">
                    <p className="text-xs font-semibold text-white leading-tight">
                      {user.firstName} {user.lastName?.[0]}.
                    </p>
                  </div>
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                    alt="avatar"
                    className="w-8 h-8 rounded-xl object-cover ring-1 ring-sky-500/40 group-hover:ring-sky-400"
                  />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl glass-card border border-slate-700/80 shadow-2xl z-50 p-2 overflow-hidden animate-in fade-in zoom-in-95">
                      <div className="p-3 bg-slate-900/60 rounded-xl mb-1.5 border border-slate-800">
                        <p className="text-xs font-bold text-white">{user.firstName} {user.lastName}</p>
                        <p className="text-[11px] text-slate-400 truncate mb-1.5">{user.email}</p>
                        <RoleBadge role={user.role} size="sm" />
                      </div>

                      <div className="space-y-0.5">
                        <button
                          onClick={() => {
                            onNavigate(user.role === 'STUDENT' ? '/student/profile' : '/profile');
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition"
                        >
                          <UserIcon className="w-4 h-4 text-sky-400" />
                          <span>My Profile</span>
                        </button>
                        <button
                          onClick={() => {
                            onNavigate(user.role === 'STUDENT' ? '/student/settings' : '/settings');
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition"
                        >
                          <Settings className="w-4 h-4 text-slate-400" />
                          <span>Account Settings</span>
                        </button>
                        <div className="h-px bg-slate-800 my-1" />
                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                            onNavigate('/');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('/auth/login')}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:text-white transition"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('/auth/register')}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-semibold shadow-md shadow-sky-500/20 hover:shadow-sky-500/40 hover:scale-[1.02] transition"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
