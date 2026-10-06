import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { SyllabusPage } from './pages/SyllabusPage';
import { ChapterDetailPage } from './pages/ChapterDetailPage';
import { StudyMaterialsPage } from './pages/StudyMaterialsPage';
import { PracticePage } from './pages/PracticePage';
import { TestModule } from './pages/TestModule';
import { TestResultPage } from './pages/TestResultPage';
import { ProgressAnalyticsPage } from './pages/ProgressAnalyticsPage';
import { AITutorPage } from './pages/AITutorPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { ParentDashboard } from './pages/ParentDashboard';
import { SchoolAdminDashboard } from './pages/SchoolAdminDashboard';
import { PlatformAdminDashboard } from './pages/PlatformAdminDashboard';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { ErrorView } from './pages/ErrorPages';
import { UserRole } from './types';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname === '/' ? '/' : window.location.pathname;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState<string>('chap_9');
  const [selectedAttemptId, setSelectedAttemptId] = useState<string>('att_1');
  const [tutorContext, setTutorContext] = useState<string>('General Mathematics');
  const [authRoleTarget, setAuthRoleTarget] = useState<UserRole>('STUDENT');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Sync route with browser history
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Automatic redirect if user logs in on landing page
  useEffect(() => {
    if (!isLoading && user && currentRoute === '/') {
      if (user.role === 'STUDENT') navigate('/student/dashboard');
      else if (user.role === 'TEACHER') navigate('/teacher/dashboard');
      else if (user.role === 'PARENT') navigate('/parent/dashboard');
      else if (user.role === 'SCHOOL_ADMIN') navigate('/school-admin/dashboard');
      else if (user.role === 'PLATFORM_ADMIN') navigate('/admin/dashboard');
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen math-pattern-bg flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-3 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold tracking-wide text-sky-200">
            Initializing EduMathAI Platform...
          </p>
        </div>
      </div>
    );
  }

  // Handle landing page
  if (currentRoute === '/' && !user) {
    return (
      <div className="min-h-screen math-pattern-bg flex flex-col">
        <Navbar
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
          onNavigate={navigate}
        />
        <LandingPage
          onSelectPortal={(role) => {
            setAuthRoleTarget(role);
            setAuthMode('login');
            navigate('/auth/login');
          }}
          onNavigate={navigate}
        />
      </div>
    );
  }

  // Handle authentication routes
  if (currentRoute === '/auth/login' || currentRoute === '/auth/register') {
    return (
      <AuthPage
        initialMode={currentRoute === '/auth/register' ? 'register' : 'login'}
        initialRole={authRoleTarget}
        onSuccess={(role) => {
          if (role === 'STUDENT') navigate('/student/dashboard');
          else if (role === 'TEACHER') navigate('/teacher/dashboard');
          else if (role === 'PARENT') navigate('/parent/dashboard');
          else if (role === 'SCHOOL_ADMIN') navigate('/school-admin/dashboard');
          else if (role === 'PLATFORM_ADMIN') navigate('/admin/dashboard');
        }}
        onNavigateHome={() => navigate('/')}
      />
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    return (
      <AuthPage
        initialMode="login"
        initialRole="STUDENT"
        onSuccess={(role) => {
          if (role === 'STUDENT') navigate('/student/dashboard');
          else if (role === 'TEACHER') navigate('/teacher/dashboard');
          else if (role === 'PARENT') navigate('/parent/dashboard');
          else if (role === 'SCHOOL_ADMIN') navigate('/school-admin/dashboard');
          else if (role === 'PLATFORM_ADMIN') navigate('/admin/dashboard');
        }}
        onNavigateHome={() => navigate('/')}
      />
    );
  }

  // Role Protection Verification
  const isStudentRoute = currentRoute.startsWith('/student');
  const isTeacherRoute = currentRoute.startsWith('/teacher');
  const isParentRoute = currentRoute.startsWith('/parent');
  const isSchoolAdminRoute = currentRoute.startsWith('/school-admin');
  const isAdminRoute = currentRoute.startsWith('/admin');

  // Verify Role Authorization
  let isUnauthorized = false;
  if (isStudentRoute && user.role !== 'STUDENT') isUnauthorized = true;
  if (isTeacherRoute && user.role !== 'TEACHER' && user.role !== 'PLATFORM_ADMIN') isUnauthorized = true;
  if (isParentRoute && user.role !== 'PARENT' && user.role !== 'PLATFORM_ADMIN') isUnauthorized = true;
  if (isSchoolAdminRoute && user.role !== 'SCHOOL_ADMIN' && user.role !== 'PLATFORM_ADMIN') isUnauthorized = true;
  if (isAdminRoute && user.role !== 'PLATFORM_ADMIN') isUnauthorized = true;

  // Generic /dashboard routing helper
  if (currentRoute === '/dashboard') {
    if (user.role === 'STUDENT') navigate('/student/dashboard');
    else if (user.role === 'TEACHER') navigate('/teacher/dashboard');
    else if (user.role === 'PARENT') navigate('/parent/dashboard');
    else if (user.role === 'SCHOOL_ADMIN') navigate('/school-admin/dashboard');
    else if (user.role === 'PLATFORM_ADMIN') navigate('/admin/dashboard');
  }

  return (
    <div className="min-h-screen math-pattern-bg flex flex-col">
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        onNavigate={navigate}
      />

      <div className="flex-1 flex w-full">
        {/* Responsive Sidebar */}
        <Sidebar
          currentRoute={currentRoute}
          onNavigate={navigate}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          {isUnauthorized ? (
            <ErrorView
              type="403"
              onNavigateHome={() => {
                if (user.role === 'STUDENT') navigate('/student/dashboard');
                else if (user.role === 'TEACHER') navigate('/teacher/dashboard');
                else if (user.role === 'PARENT') navigate('/parent/dashboard');
                else if (user.role === 'SCHOOL_ADMIN') navigate('/school-admin/dashboard');
                else navigate('/admin/dashboard');
              }}
            />
          ) : (
            <>
              {/* STUDENT ROUTES */}
              {currentRoute === '/student/dashboard' && (
                <StudentDashboard onNavigate={navigate} />
              )}
              {currentRoute === '/student/syllabus' && (
                <SyllabusPage
                  onSelectChapter={(chapId) => {
                    setSelectedChapterId(chapId);
                    navigate(`/student/chapter/${chapId}`);
                  }}
                />
              )}
              {currentRoute.startsWith('/student/chapter/') && (
                <ChapterDetailPage
                  chapterId={currentRoute.replace('/student/chapter/', '') || selectedChapterId}
                  onBack={() => navigate('/student/syllabus')}
                  onStartPractice={(cId) => navigate(`/student/practice?chapterId=${cId}`)}
                  onStartTest={(tId) => navigate(`/student/tests?testId=${tId}`)}
                  onOpenTutor={(topic) => {
                    setTutorContext(topic);
                    navigate('/student/tutor');
                  }}
                />
              )}
              {currentRoute === '/student/materials' && <StudyMaterialsPage />}
              {currentRoute.startsWith('/student/practice') && (
                <PracticePage
                  initialChapterId={selectedChapterId}
                  onOpenTutor={(query) => {
                    setTutorContext(query);
                    navigate('/student/tutor');
                  }}
                />
              )}
              {currentRoute.startsWith('/student/tests/result/') && (
                <TestResultPage
                  attemptId={currentRoute.replace('/student/tests/result/', '') || selectedAttemptId}
                  onRetry={(tId) => navigate(`/student/tests?testId=${tId}`)}
                  onPracticeWeak={() => navigate('/student/practice')}
                  onBackToDashboard={() => navigate('/student/dashboard')}
                />
              )}
              {currentRoute === '/student/tests' && (
                <TestModule
                  onNavigateToResult={(attId) => {
                    setSelectedAttemptId(attId);
                    navigate(`/student/tests/result/${attId}`);
                  }}
                  onNavigate={navigate}
                />
              )}
              {currentRoute === '/student/progress' && (
                <ProgressAnalyticsPage onNavigate={navigate} />
              )}
              {currentRoute === '/student/tutor' && (
                <AITutorPage initialContext={tutorContext} />
              )}
              {currentRoute === '/student/achievements' && <AchievementsPage />}
              {currentRoute === '/student/recommendations' && (
                <RecommendationsPage onNavigate={navigate} />
              )}

              {/* TEACHER ROUTES */}
              {(currentRoute === '/teacher/dashboard' || currentRoute.startsWith('/teacher/')) && (
                <TeacherDashboard />
              )}

              {/* PARENT ROUTES */}
              {(currentRoute === '/parent/dashboard' || currentRoute.startsWith('/parent/')) && (
                <ParentDashboard />
              )}

              {/* SCHOOL ADMIN ROUTES */}
              {(currentRoute === '/school-admin/dashboard' || currentRoute.startsWith('/school-admin/')) && (
                <SchoolAdminDashboard />
              )}

              {/* PLATFORM ADMIN ROUTES */}
              {(currentRoute === '/admin/dashboard' || currentRoute.startsWith('/admin/')) && (
                <PlatformAdminDashboard />
              )}

              {/* COMMON PROFILE & SETTINGS */}
              {(currentRoute === '/profile' || currentRoute === '/student/profile') && (
                <ProfilePage />
              )}
              {(currentRoute === '/settings' || currentRoute === '/student/settings') && (
                <SettingsPage />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
