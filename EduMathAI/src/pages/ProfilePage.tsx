import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { RoleBadge } from '../components/RoleBadge';
import {
  User, Mail, Phone, School, BookOpen, Save,
  CheckCircle2, AlertCircle, Shield, Award, Sparkles
} from 'lucide-react';
import { Curriculum } from '../types';

export const ProfilePage: React.FC = () => {
  const { user, profile, curriculum, setCurriculum, updateUser } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [curr, setCurr] = useState<Curriculum>(curriculum || 'CBSE');
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  if (!user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);
    try {
      const updated = await api.updateProfile({
        userId: user.id,
        firstName,
        lastName,
        phone,
        curriculum: curr
      });
      updateUser(updated, profile ? { ...profile, curriculum: curr } : undefined);
      setCurriculum(curr);
      setStatusMsg('Profile details successfully updated!');
    } catch (e: any) {
      console.error(e);
      setStatusMsg('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/80 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <div className="relative">
          <img
            src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80'}
            alt="avatar"
            className="w-24 h-24 rounded-3xl object-cover ring-2 ring-sky-500/50 shadow-xl"
          />
          <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-slate-900 border border-slate-700 text-sky-400">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <RoleBadge role={user.role} size="md" />
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Class 9 Mathematics
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-xs text-slate-400 font-mono">{user.email}</p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/80 space-y-6">
        <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3">
          Personal & Academic Credentials
        </h2>

        {statusMsg && (
          <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{statusMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">First Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Last Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email (Read Only)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {user.role === 'STUDENT' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Active Curriculum</label>
                <select
                  value={curr}
                  onChange={(e) => setCurr(e.target.value as Curriculum)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="CBSE">CBSE (NCERT) Class 9</option>
                  <option value="AP_STATE">AP State Board Class 9</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">School Affiliation</label>
                <input
                  type="text"
                  disabled
                  value="Delhi Public International School"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md shadow-sky-500/25 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
