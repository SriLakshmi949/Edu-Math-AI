import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  School as SchoolIcon, Users, GraduationCap, Building2,
  TrendingUp, Award, Plus, Check, X, BarChart3, AlertCircle
} from 'lucide-react';

export const SchoolAdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);

  // Teacher form
  const [tFirst, setTFirst] = useState('');
  const [tLast, setTLast] = useState('');
  const [tEmail, setTEmail] = useState('');
  const [tPhone, setTPhone] = useState('');

  // Class form
  const [cName, setCName] = useState('Class 9-C');
  const [cGrade, setCGrade] = useState('Class 9');
  const [cSection, setCSection] = useState('C');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.getSchoolAdminOverview();
        setData(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addTeacher({
        firstName: tFirst,
        lastName: tLast,
        email: tEmail,
        phone: tPhone,
        subject: 'Mathematics'
      });
      setShowAddTeacherModal(false);
      alert(`Teacher ${tFirst} ${tLast} added to faculty roster!`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addClass({
        name: cName,
        grade: cGrade,
        section: cSection
      });
      setShowAddClassModal(false);
      alert(`Classroom ${cName} created and registered!`);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !data) {
    return (
      <div className="p-12 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs">Loading institution overview...</p>
      </div>
    );
  }

  const { school, metrics, classrooms, teachers, chapterPerformance } = data;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Institutional Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {school.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            School Code: {school.code} • {school.board} ({school.city}, {school.state})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowAddTeacherModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Teacher</span>
          </button>
          <button
            onClick={() => setShowAddClassModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl glass-card hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700 transition"
          >
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Create Class</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="glass-card p-4 rounded-2xl border border-sky-500/20 bg-sky-500/5">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">Total Students</span>
          <div className="text-2xl font-black text-white">{metrics.totalStudents}</div>
          <span className="text-[10px] text-sky-400 mt-1 block">Class 9 enrolled</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-purple-500/20 bg-purple-500/5">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">Math Faculty</span>
          <div className="text-2xl font-black text-purple-300">{metrics.totalTeachers}</div>
          <span className="text-[10px] text-purple-400 mt-1 block">PGT & TGT teachers</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">Active Classes</span>
          <div className="text-2xl font-black text-indigo-300">{metrics.totalClasses}</div>
          <span className="text-[10px] text-indigo-400 mt-1 block">Sections A through F</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">School Pass Rate</span>
          <div className="text-2xl font-black text-emerald-300">{metrics.passRate}%</div>
          <span className="text-[10px] text-emerald-400 mt-1 block">Board benchmark: 85%</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">Average Score</span>
          <div className="text-2xl font-black text-amber-300">{metrics.averagePerformance}%</div>
          <span className="text-[10px] text-amber-400 mt-1 block">Mid-term evaluation</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">Active Today</span>
          <div className="text-2xl font-black text-rose-300">{metrics.activeUsersToday}</div>
          <span className="text-[10px] text-rose-400 mt-1 block">91.9% engagement</span>
        </div>
      </div>

      {/* Chapter Performance Diagnostics */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-700/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Curriculum Chapter Performance Metrics</h3>
            <p className="text-xs text-slate-400 mt-0.5">School-wide average test score across individual Class 9 chapters</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">School Benchmark: 75%</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
          {chapterPerformance.map((item: any, idx: number) => {
            const isWeak = item.avgScore < 70;
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border ${
                  isWeak ? 'bg-rose-500/5 border-rose-500/30' : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs font-bold text-white truncate max-w-[160px]">{item.chapter}</h4>
                  <span className={`text-xs font-bold ${isWeak ? 'text-rose-400' : 'text-emerald-300'}`}>
                    {item.avgScore}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isWeak ? 'bg-rose-400' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${item.avgScore}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1.5 block">
                  {isWeak ? 'Flagged: Needs Faculty Focus' : 'Satisfactory Progression'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Classrooms and Teachers Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Classrooms */}
        <div className="glass-card p-6 rounded-3xl border border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Registered Classrooms</span>
            </h3>
            <span className="text-xs text-slate-400">{classrooms.length} Sections</span>
          </div>
          {classrooms.map((c: any) => (
            <div key={c.id} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-white">{c.name}</span>
                <p className="text-[11px] text-slate-400">Class 9 • Section {c.section}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-sky-400">{c.studentCount} Students</span>
                <span className="block text-[10px] text-slate-500">Teacher: Dr. Sunita Rao</span>
              </div>
            </div>
          ))}
        </div>

        {/* Teachers */}
        <div className="glass-card p-6 rounded-3xl border border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-purple-400" />
              <span>Mathematics Faculty</span>
            </h3>
            <span className="text-xs text-slate-400">{teachers.length} Active</span>
          </div>
          {teachers.map((t: any) => (
            <div key={t.id} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-white">{t.firstName} {t.lastName}</span>
                <p className="text-[11px] text-slate-400">{t.email}</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                Active Faculty
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Add Teacher */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="glass-card max-w-md w-full p-6 sm:p-8 rounded-3xl border border-amber-500/40 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add New Mathematics Teacher</h3>
              <button onClick={() => setShowAddTeacherModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTeacher} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={tFirst}
                    onChange={(e) => setTFirst(e.target.value)}
                    placeholder="e.g. Ramesh"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={tLast}
                    onChange={(e) => setTLast(e.target.value)}
                    placeholder="e.g. Gupta"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Official Email *</label>
                <input
                  type="email"
                  required
                  value={tEmail}
                  onChange={(e) => setTEmail(e.target.value)}
                  placeholder="r.gupta@dpis.edu"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={tPhone}
                  onChange={(e) => setTPhone(e.target.value)}
                  placeholder="+91 98480 00000"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition"
              >
                Provision Teacher Account
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Class */}
      {showAddClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="glass-card max-w-md w-full p-6 sm:p-8 rounded-3xl border border-sky-500/40 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Create New Class Section</h3>
              <button onClick={() => setShowAddClassModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddClass} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Classroom Name *</label>
                <input
                  type="text"
                  required
                  value={cName}
                  onChange={(e) => setCName(e.target.value)}
                  placeholder="Class 9-C"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Grade</label>
                  <input
                    type="text"
                    value={cGrade}
                    onChange={(e) => setCGrade(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Section</label>
                  <input
                    type="text"
                    value={cSection}
                    onChange={(e) => setCSection(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md transition"
              >
                Create Classroom
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
