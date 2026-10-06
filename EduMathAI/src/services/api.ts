import {
  User, StudentProfile, Chapter, StudyMaterial, Question, Test, TestAttempt,
  Achievement, Recommendation, Notification, ChatMessage, PracticeSession,
  ChapterProgressItem, ActivityLog
} from '../types';

const BASE_URL = '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    }
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  login: (credentials: { email: string; password?: string; role?: string }) =>
    fetchJson<{ user: User; profile: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),

  demoLogin: (role: string) =>
    fetchJson<{ user: User; profile: any; token: string }>('/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ role })
    }),

  register: (data: any) =>
    fetchJson<{ user: User; profile: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  forgotPassword: (email: string) =>
    fetchJson<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    }),

  // Chapters
  getChapters: (curriculum?: string) =>
    fetchJson<Chapter[]>(`/chapters${curriculum ? `?curriculum=${curriculum}` : ''}`),

  getChapterDetails: (id: string) =>
    fetchJson<{ chapter: Chapter; materials: StudyMaterial[]; questionsCount: number; tests: Test[] }>(
      `/chapters/${id}`
    ),

  // Study Materials
  getMaterials: (chapterId?: string, type?: string) => {
    const params = new URLSearchParams();
    if (chapterId) params.append('chapterId', chapterId);
    if (type) params.append('type', type);
    return fetchJson<StudyMaterial[]>(`/materials?${params.toString()}`);
  },

  getMaterialById: (id: string) =>
    fetchJson<StudyMaterial>(`/materials/${id}`),

  // Practice
  getPracticeQuestions: (filters?: { chapterId?: string; difficulty?: string; type?: string }) => {
    const params = new URLSearchParams();
    if (filters?.chapterId) params.append('chapterId', filters.chapterId);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.type) params.append('type', filters.type);
    return fetchJson<Question[]>(`/practice/questions?${params.toString()}`);
  },

  submitPractice: (data: {
    studentId: string;
    chapterId: string;
    chapterName: string;
    questionsAttempted: number;
    correctAnswers: number;
    timeSpentSeconds: number;
  }) =>
    fetchJson<{ session: PracticeSession; updatedStudent: StudentProfile }>('/practice/submit', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Tests
  getTests: (curriculum?: string) =>
    fetchJson<Test[]>(`/tests${curriculum ? `?curriculum=${curriculum}` : ''}`),

  getTestById: (id: string) =>
    fetchJson<Test>(`/tests/${id}`),

  submitTest: (testId: string, data: { studentId: string; answers: Record<string, string>; timeTakenSeconds: number }) =>
    fetchJson<TestAttempt>(`/tests/${testId}/submit`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  getTestAttemptById: (id: string) =>
    fetchJson<{ attempt: TestAttempt; test: Test }>(`/tests/attempts/${id}`),

  getStudentAttempts: (studentId: string) =>
    fetchJson<TestAttempt[]>(`/tests/attempts/student/${studentId}`),

  // Progress
  getProgress: (studentId: string) =>
    fetchJson<{
      student: StudentProfile;
      chapters: ChapterProgressItem[];
      weakTopics: ChapterProgressItem[];
      strongTopics: ChapterProgressItem[];
      recentTests: TestAttempt[];
    }>(`/progress/${studentId}`),

  // Achievements
  getAchievements: (studentId: string) =>
    fetchJson<Achievement[]>(`/achievements/${studentId}`),

  // Recommendations
  getRecommendations: (studentId: string) =>
    fetchJson<Recommendation[]>(`/recommendations/${studentId}`),

  dismissRecommendation: (id: string) =>
    fetchJson<{ success: boolean }>(`/recommendations/${id}/dismiss`, { method: 'POST' }),

  // AI Tutor
  sendTutorMessage: (data: {
    studentId?: string;
    message: string;
    chapterId?: string;
    chapterTitle?: string;
    sessionId?: string;
    history?: { role: 'user' | 'assistant'; text: string }[];
  }) =>
    fetchJson<{ sessionId: string; reply: ChatMessage }>('/tutor/chat', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  getTutorSessions: (studentId: string) =>
    fetchJson<any[]>(`/tutor/sessions/${studentId}`),

  getTutorMessages: (sessionId: string) =>
    fetchJson<ChatMessage[]>(`/tutor/sessions/${sessionId}/messages`),

  // Notifications
  getNotifications: (userId: string) =>
    fetchJson<Notification[]>(`/notifications/${userId}`),

  markNotificationRead: (id: string) =>
    fetchJson<{ success: boolean }>(`/notifications/${id}/read`, { method: 'POST' }),

  markAllNotificationsRead: (userId: string) =>
    fetchJson<{ success: boolean }>('/notifications/read-all', {
      method: 'POST',
      body: JSON.stringify({ userId })
    }),

  // Teacher
  getTeacherDashboard: () =>
    fetchJson<any>('/teacher/dashboard'),

  getTeacherStudents: () =>
    fetchJson<any[]>('/teacher/students'),

  createAssignment: (data: any) =>
    fetchJson<any>('/teacher/assignments', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  createTeacherTest: (data: any) =>
    fetchJson<any>('/teacher/tests', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Parent
  getParentChildData: (studentId?: string) =>
    fetchJson<any>('/parent/child-data'),

  // School Admin
  getSchoolAdminOverview: () =>
    fetchJson<any>('/school-admin/overview'),

  addTeacher: (data: any) =>
    fetchJson<any>('/school-admin/teachers', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  addClass: (data: any) =>
    fetchJson<any>('/school-admin/classes', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Platform Admin
  getAdminOverview: () =>
    fetchJson<any>('/admin/overview'),

  toggleUserActive: (id: string) =>
    fetchJson<{ id: string; isActive: boolean }>(`/admin/users/toggle/${id}`, {
      method: 'POST'
    }),

  addSchool: (data: any) =>
    fetchJson<any>('/admin/schools', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  getActivityLogs: () =>
    fetchJson<ActivityLog[]>('/admin/activity'),

  // Profile & Settings
  updateProfile: (data: { userId: string; firstName?: string; lastName?: string; phone?: string; curriculum?: string }) =>
    fetchJson<User>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  changePassword: (data: { userId: string; currentPassword: string; newPassword: string }) =>
    fetchJson<{ message: string }>('/users/change-password', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
};
