import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Users, CheckSquare, FolderCheck, TrendingUp, AlertTriangle,
  Plus, Search, ArrowRight, BookOpen, Clock, CheckCircle2, Sparkles, X
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);

  // New assignment form state
  const [asgTitle, setAsgTitle] = useState('');
  const [asgChapter, setAsgChapter] = useState('Circles');
  const [asgDesc, setAsgDesc] = useState('');
  const [asgMarks, setAsgMarks] = useState('25');

  // New test form state
  const [testTitle, setTestTitle] = useState('');
  const [testChapter, setTestChapter] = useState('Polynomials');
  const [testDuration, setTestDuration] = useState('25');
  const [testMarks, setTestMarks] = useState('20');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [dash, studList] = await Promise.all([
          api.getTeacherDashboard(),
          api.getTeacherStudents()
        ]);
        setDashboardData(dash);
        setStudents(studList);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createAssignment({
        classroomId: 'class_9a',
        chapterId: 'chap_9',
        chapterName: asgChapter,
        title: asgTitle,
        description: asgDesc,
        totalMarks: Number(asgMarks)
      });
      setShowAssignModal(false);
      alert('Assignment published successfully to Class 9-A students!');
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createTeacherTest({
        title: testTitle,
        chapterId: 'chap_2',
        chapterName: testChapter,
        durationMinutes: Number(testDuration),
        totalMarks: Number(testMarks),
        questions: []
      });
      setShowTestModal(false);
      alert('New chapter assessment created and scheduled!');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
            Faculty Command Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Teacher Portal • Class 9 Mathematics
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Monitor student learning gaps, assign homework, analyze test results, and generate CBSE/State syllabus assessments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowAssignModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Assignment</span>
          </button>
          <button
            onClick={() => setShowTestModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl glass-card hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700 transition"
          >
            <CheckSquare className="w-4 h-4 text-purple-400" />
            <span>Create Test</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="glass-card p-4 rounded-2xl border border-purple-500/20 bg-purple-500/5">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">Total Students</span>
          <div className="text-2xl font-black text-white">74</div>
          <span className="text-[10px] text-purple-300 mt-1 block">Class 9-A & 9-B</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-sky-500/20 bg-sky-500/5">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">Active Students</span>
          <div className="text-2xl font-black text-sky-300">68</div>
          <span className="text-[10px] text-sky-400 mt-1 block">Active this week (92%)</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">Class Avg Score</span>
          <div className="text-2xl font-black text-emerald-300">78.4%</div>
          <span className="text-[10px] text-emerald-400 mt-1 block">+3.2% vs previous term</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">Pending Submissions</span>
          <div className="text-2xl font-black text-amber-300">12</div>
          <span className="text-[10px] text-amber-400 mt-1 block">Circles proof homework</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 col-span-2 sm:col-span-1">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">Tests Completed</span>
          <div className="text-2xl font-black text-indigo-300">142</div>
          <span className="text-[10px] text-indigo-400 mt-1 block">Automated evaluations</span>
        </div>
      </div>

      {/* Classroom Analytics & Learning Gaps Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weak Chapters Diagnosed (2 cols) */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Classroom Learning Gaps (Diagnosis)</h3>
              <p className="text-xs text-slate-400 mt-0.5">Chapters where Class 9 average falls below 70%</p>
            </div>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold">
              3 Weak Units
            </span>
          </div>

          <div className="space-y-3">
            {[
              { chapter: 'Chapter 9: Circles', avg: 64, weakConcept: 'Angle subtended at circumference & cyclic quad opposite angle sum', studentsImpacted: 24 },
              { chapter: 'Chapter 11: Surface Areas & Volumes', avg: 66, weakConcept: 'Formulas for right circular cones & hemisphere capacity calculations', studentsImpacted: 18 },
              { chapter: 'Chapter 7: Triangles', avg: 69, weakConcept: 'Congruence proofs using ASA vs RHS criteria', studentsImpacted: 15 }
            ].map((gap, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{gap.chapter}</span>
                  <span className="text-rose-400 font-bold">Class Average: {gap.avg}%</span>
                </div>
                <p className="text-xs text-slate-400">
                  <strong className="text-slate-300">Identified Gap: </strong>
                  {gap.weakConcept}
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>{gap.studentsImpacted} students needing revision</span>
                  <button
                    onClick={() => {
                      setAsgTitle(`Remedial Practice: ${gap.chapter}`);
                      setAsgChapter(gap.chapter);
                      setShowAssignModal(true);
                    }}
                    className="text-purple-400 hover:underline font-semibold"
                  >
                    Assign Remedial Sheet →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Classes Overview */}
        <div className="glass-card p-6 rounded-3xl border border-slate-700/80 space-y-4">
          <h3 className="text-sm font-bold text-white">My Assigned Sections</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Class 9-A</span>
                <span className="text-xs font-bold text-emerald-400">81.2% Avg</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>38 Students</span>
                <span>CBSE Curriculum</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Class 9-B</span>
                <span className="text-xs font-bold text-sky-400">75.6% Avg</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>36 Students</span>
                <span>CBSE Curriculum</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Student Performance Roster */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-700/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white">Student Performance Roster</h3>
            <p className="text-xs text-slate-400 mt-0.5">Live tracking of individual student test scores and practice diligence</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Grade/Section</th>
                <th className="py-3 px-3">Overall Progress</th>
                <th className="py-3 px-3">Test Average</th>
                <th className="py-3 px-3">Questions Solved</th>
                <th className="py-3 px-3">Streak</th>
                <th className="py-3 px-3">Academic Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-3 font-semibold text-white">
                    {student.name}
                    <span className="block text-[10px] text-slate-500 font-normal">{student.email}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{student.grade}-{student.section}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-sky-400 h-full rounded-full" style={{ width: `${student.overallProgress}%` }} />
                      </div>
                      <span className="font-bold text-slate-200">{student.overallProgress}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-300">{student.testAverage}%</td>
                  <td className="py-3 px-3 text-slate-300">{student.questionsAttempted}</td>
                  <td className="py-3 px-3 text-rose-400 font-bold">{student.streakDays} days 🔥</td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      student.status === 'Good'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Assignment */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="glass-card max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-purple-500/40 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Create Class 9 Assignment</h3>
              <button onClick={() => setShowAssignModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  value={asgTitle}
                  onChange={(e) => setAsgTitle(e.target.value)}
                  placeholder="e.g. Circles & Chords Proof Practice"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Chapter</label>
                  <select
                    value={asgChapter}
                    onChange={(e) => setAsgChapter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Number Systems">Number Systems</option>
                    <option value="Polynomials">Polynomials</option>
                    <option value="Triangles">Triangles</option>
                    <option value="Circles">Circles</option>
                    <option value="Surface Areas & Volumes">Surface Areas & Volumes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={asgMarks}
                    onChange={(e) => setAsgMarks(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Instructions / Description</label>
                <textarea
                  rows={3}
                  value={asgDesc}
                  onChange={(e) => setAsgDesc(e.target.value)}
                  placeholder="Detail the exercises or specific problems students must solve..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-500/25 transition"
              >
                Publish Assignment to Class 9-A
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Test */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="glass-card max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-sky-500/40 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Create Timed Assessment</h3>
              <button onClick={() => setShowTestModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Test Title *</label>
                <input
                  type="text"
                  required
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  placeholder="e.g. Chapter 2 Polynomials Mastery Assessment"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Chapter</label>
                  <input
                    type="text"
                    value={testChapter}
                    onChange={(e) => setTestChapter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={testDuration}
                    onChange={(e) => setTestDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={testMarks}
                    onChange={(e) => setTestMarks(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md shadow-sky-500/25 transition"
              >
                Schedule Assessment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
