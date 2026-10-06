import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, BookOpen, FileText, Target, CheckSquare, Sparkles,
  BarChart3, Award, Lightbulb, User, Settings, Users, FolderCheck,
  HelpCircle, Building2, Shield, GraduationCap, X, ChevronRight
} from 'lucide-react';
import { RoleBadge } from './RoleBadge';

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRoute, onNavigate, isOpen, onClose }) => {
  const { user, profile, logout } = useAuth();

  if (!user) return null;

  const getStudentItems = () => [
    { label: 'Dashboard', route: '/student/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'My Syllabus', route: '/student/syllabus', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Study Materials', route: '/student/materials', icon: <FileText className="w-4 h-4" /> },
    { label: 'Practice', route: '/student/practice', icon: <Target className="w-4 h-4" /> },
    { label: 'Tests', route: '/student/tests', icon: <CheckSquare className="w-4 h-4" /> },
    { label: 'AI Math Tutor', route: '/student/tutor', icon: <Sparkles className="w-4 h-4 text-sky-400" />, badge: 'AI' },
    { label: 'Progress & Analytics', route: '/student/progress', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Achievements', route: '/student/achievements', icon: <Award className="w-4 h-4" /> },
    { label: 'Recommendations', route: '/student/recommendations', icon: <Lightbulb className="w-4 h-4" /> },
    { label: 'Profile', route: '/student/profile', icon: <User className="w-4 h-4" /> },
    { label: 'Settings', route: '/student/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const getTeacherItems = () => [
    { label: 'Dashboard', route: '/teacher/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'My Classes', route: '/teacher/classes', icon: <GraduationCap className="w-4 h-4" /> },
    { label: 'Students', route: '/teacher/students', icon: <Users className="w-4 h-4" /> },
    { label: 'Chapters', route: '/student/syllabus', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Assignments', route: '/teacher/assignments', icon: <FolderCheck className="w-4 h-4" /> },
    { label: 'Tests', route: '/teacher/tests', icon: <CheckSquare className="w-4 h-4" /> },
    { label: 'Question Bank', route: '/teacher/questions', icon: <HelpCircle className="w-4 h-4" /> },
    { label: 'Class Analytics', route: '/teacher/analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'AI Assistant', route: '/student/tutor', icon: <Sparkles className="w-4 h-4 text-purple-400" />, badge: 'AI' },
    { label: 'Profile', route: '/profile', icon: <User className="w-4 h-4" /> },
    { label: 'Settings', route: '/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const getParentItems = () => [
    { label: 'Dashboard', route: '/parent/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Child Progress', route: '/parent/progress', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Tests & Scores', route: '/parent/tests', icon: <CheckSquare className="w-4 h-4" /> },
    { label: 'Practice History', route: '/parent/practice', icon: <Target className="w-4 h-4" /> },
    { label: 'AI Recommendations', route: '/parent/recommendations', icon: <Lightbulb className="w-4 h-4" /> },
    { label: 'Settings', route: '/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const getSchoolAdminItems = () => [
    { label: 'Dashboard', route: '/school-admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Student Management', route: '/school-admin/students', icon: <Users className="w-4 h-4" /> },
    { label: 'Teacher Management', route: '/school-admin/teachers', icon: <GraduationCap className="w-4 h-4" /> },
    { label: 'Class Management', route: '/school-admin/classes', icon: <Building2 className="w-4 h-4" /> },
    { label: 'School Analytics', route: '/school-admin/analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Reports', route: '/school-admin/reports', icon: <FileText className="w-4 h-4" /> },
    { label: 'Curriculum & Chapters', route: '/student/syllabus', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Settings', route: '/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const getPlatformAdminItems = () => [
    { label: 'Dashboard', route: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'User Management', route: '/admin/users', icon: <Users className="w-4 h-4" /> },
    { label: 'School Management', route: '/admin/schools', icon: <Building2 className="w-4 h-4" /> },
    { label: 'Content Management', route: '/student/materials', icon: <FileText className="w-4 h-4" /> },
    { label: 'Chapter Management', route: '/student/syllabus', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Question Bank', route: '/teacher/questions', icon: <HelpCircle className="w-4 h-4" /> },
    { label: 'Platform Analytics', route: '/admin/analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Audit Logs', route: '/admin/logs', icon: <Shield className="w-4 h-4" /> },
    { label: 'System Settings', route: '/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  let items = getStudentItems();
  if (user.role === 'TEACHER') items = getTeacherItems();
  else if (user.role === 'PARENT') items = getParentItems();
  else if (user.role === 'SCHOOL_ADMIN') items = getSchoolAdminItems();
  else if (user.role === 'PLATFORM_ADMIN') items = getPlatformAdminItems();

  const handleItemClick = (route: string) => {
    onNavigate(route);
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-[65px] left-0 h-screen lg:h-[calc(100vh-65px)] w-64 glass-nav lg:bg-slate-950/40 border-r border-slate-800/80 z-50 lg:z-10 transition-transform duration-200 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top header on mobile */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800/80 lg:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-base">Navigation</span>
            <RoleBadge role={user.role} size="sm" />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Portal status badge in desktop */}
        <div className="hidden lg:block px-5 py-4 border-b border-slate-800/60">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Active Portal
          </p>
          <div className="flex items-center justify-between">
            <RoleBadge role={user.role} size="sm" />
            <span className="text-[11px] text-slate-400 font-mono">Class 9</span>
          </div>
        </div>

        {/* Nav list */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {items.map((item, idx) => {
            const isActive = currentRoute === item.route || currentRoute.startsWith(item.route + '/');
            return (
              <button
                key={idx}
                onClick={() => handleItemClick(item.route)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30 font-semibold shadow-sm shadow-sky-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className={`${isActive ? 'text-sky-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-sm">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer profile snippet */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs shrink-0">
                {user.firstName[0]}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-[10px] text-slate-400 truncate capitalize">
                  {user.role.replace('_', ' ').toLowerCase()}
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate(user.role === 'STUDENT' ? '/student/settings' : '/settings')}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
