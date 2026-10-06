import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User, ActivityLog } from '../types';
import { RoleBadge } from '../components/RoleBadge';
import {
  ShieldCheck, Users, Building2, BookOpen, HelpCircle,
  Activity, Check, X, Plus, AlertCircle, RefreshCw
} from 'lucide-react';

export const PlatformAdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [showAddSchoolModal, setShowAddSchoolModal] = useState(false);

  // New school form
  const [sName, setSName] = useState('');
  const [sCode, setSCode] = useState('');
  const [sCity, setSCity] = useState('Hyderabad');
  const [sState, setSState] = useState('Andhra Pradesh & Telangana');
  const [sBoard, setSBoard] = useState('CBSE & AP State Board');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.getAdminOverview();
        setData(res);
        setUsers(res.users);
        setSchools(res.schools);
        setLogs(res.activityLogs);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggleUser = async (userId: string) => {
    try {
      const res = await api.toggleUserActive(userId);
      setUsers(prev =>
        prev.map(u => (u.id === userId ? { ...u, isActive: res.isActive } : u))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newSch = await api.addSchool({
        name: sName,
        code: sCode,
        city: sCity,
        state: sState,
        board: sBoard
      });
      setSchools(prev => [...prev, newSch]);
      setShowAddSchoolModal(false);
      alert(`School ${sName} registered successfully!`);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !data) {
    return (
      <div className="p-12 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-rose-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs">Loading platform administration telemetries...</p>
      </div>
    );
  }

  const { metrics } = data;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rose-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
            Super Administrator Authority
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Platform Operations & Governance
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Control platform access, manage user roles, audit activity logs, onboard institutional partners, and govern question banks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddSchoolModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-500/25 transition hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard School</span>
          </button>
        </div>
      </div>

      {/* Aggregate KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="glass-card p-4 rounded-2xl border border-sky-500/20 bg-sky-500/5">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">Total Students</span>
          <div className="text-2xl font-black text-white">{metrics.studentCount}</div>
          <span className="text-[10px] text-sky-400 mt-1 block">Class 9 platform-wide</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-purple-500/20 bg-purple-500/5">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">Total Teachers</span>
          <div className="text-2xl font-black text-purple-300">{metrics.teacherCount}</div>
          <span className="text-[10px] text-purple-400 mt-1 block">Active educators</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">Total Parents</span>
          <div className="text-2xl font-black text-emerald-300">{metrics.parentCount}</div>
          <span className="text-[10px] text-emerald-400 mt-1 block">Linked guardians</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">Partner Schools</span>
          <div className="text-2xl font-black text-amber-300">{schools.length}</div>
          <span className="text-[10px] text-amber-400 mt-1 block">CBSE & State Board</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">Active Sessions</span>
          <div className="text-2xl font-black text-rose-300">{metrics.activeSessions}</div>
          <span className="text-[10px] text-rose-400 mt-1 block">Concurrent users</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">Question Bank</span>
          <div className="text-2xl font-black text-indigo-300">{metrics.totalQuestions}</div>
          <span className="text-[10px] text-indigo-400 mt-1 block">Verified Class 9 items</span>
        </div>
      </div>

      {/* User Management Table */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-700/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white">Platform User Management & Access Control</h3>
            <p className="text-xs text-slate-400 mt-0.5">Activate or deactivate accounts, review roles, and manage permissions</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">{users.length} Registered Accounts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-3">Name</th>
                <th className="py-3 px-3">Email Address</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Registered At</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-3 font-semibold text-white">
                    {u.firstName} {u.lastName}
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-mono">{u.email}</td>
                  <td className="py-3 px-3">
                    <RoleBadge role={u.role} size="sm" />
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      u.isActive
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {u.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px]">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {u.role !== 'PLATFORM_ADMIN' && (
                      <button
                        onClick={() => handleToggleUser(u.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold border transition ${
                          u.isActive
                            ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30'
                            : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Logs & Schools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Onboarded Schools */}
        <div className="glass-card p-6 rounded-3xl border border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Affiliated Educational Institutions</span>
            </h3>
            <span className="text-xs text-slate-400">{schools.length} Schools</span>
          </div>

          <div className="space-y-3">
            {schools.map((sch: any) => (
              <div key={sch.id} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{sch.name}</h4>
                  <p className="text-[11px] text-slate-400">{sch.board} • Code: {sch.code}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-300">{sch.passRate}% Pass Rate</span>
                  <span className="block text-[10px] text-slate-500">{sch.totalStudents} Students</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time System Audit Activity Log */}
        <div className="glass-card p-6 rounded-3xl border border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-400" />
              <span>Security & Audit Activity Logs</span>
            </h3>
            <span className="text-xs text-slate-400">Live Feed</span>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {logs.map((log: any) => (
              <div key={log.id} className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{log.userName}</span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-slate-300">{log.details}</p>
                <div className="flex items-center gap-2 pt-0.5 text-[10px] text-slate-400 font-mono">
                  <span>ACTION: {log.action}</span>
                  <span>•</span>
                  <span>ROLE: {log.userRole}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Onboard School */}
      {showAddSchoolModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="glass-card max-w-md w-full p-6 sm:p-8 rounded-3xl border border-rose-500/40 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Onboard New Educational Partner</h3>
              <button onClick={() => setShowAddSchoolModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSchool} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">School Name *</label>
                <input
                  type="text"
                  required
                  value={sName}
                  onChange={(e) => setSName(e.target.value)}
                  placeholder="e.g. Kendriya Vidyalaya No. 1"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">School Code *</label>
                  <input
                    type="text"
                    required
                    value={sCode}
                    onChange={(e) => setSCode(e.target.value)}
                    placeholder="KV-HYD-01"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    value={sCity}
                    onChange={(e) => setSCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Curriculum Board</label>
                <input
                  type="text"
                  value={sBoard}
                  onChange={(e) => setSBoard(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition"
              >
                Complete Onboarding
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
