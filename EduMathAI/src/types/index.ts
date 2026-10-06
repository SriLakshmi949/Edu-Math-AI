export type UserRole = 'STUDENT' | 'TEACHER' | 'PARENT' | 'SCHOOL_ADMIN' | 'PLATFORM_ADMIN';
export type Curriculum = 'CBSE' | 'AP_STATE' | 'BOTH';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type QuestionType = 'MCQ' | 'Numerical' | 'True/False' | 'Fill in the blank';
export type MaterialType = 'Chapter Notes' | 'Formula Sheet' | 'Revision Notes' | 'Examples' | 'Practice Worksheet' | 'Important Questions';
export type TestType = 'Chapter Test' | 'Unit Test' | 'Full Syllabus Test' | 'Practice Test';
export type MasteryLevel = 'Novice' | 'Intermediate' | 'Proficient' | 'Master';
export type NotificationType = 'TEST_RESULT' | 'ASSIGNMENT' | 'REMINDER' | 'ACHIEVEMENT' | 'RECOMMENDATION';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  schoolId: string;
  curriculum: Curriculum;
  grade: string;
  guardianName?: string;
  guardianEmail?: string;
  streakDays: number;
  totalPoints: number;
  practiceQuestionsAttempted: number;
  practiceQuestionsCorrect: number;
  overallProgressPercentage: number;
  chaptersCompleted: number;
  testAverage: number;
}

export interface TeacherProfile {
  id: string;
  userId: string;
  schoolId: string;
  subject: string;
  designation?: string;
  classesAssigned: string[];
}

export interface ParentProfile {
  id: string;
  userId: string;
  studentId: string;
  studentEmail: string;
}

export interface Topic {
  id: string;
  chapterId: string;
  title: string;
  order: number;
  summary: string;
  keyTheorems?: string[];
  keyFormulas?: string[];
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  description: string;
  curriculum: Curriculum;
  difficulty: Difficulty;
  totalLessons: number;
  totalQuestions: number;
  iconName: string;
  topics: Topic[];
  formulaSummary: string[];
  learningObjectives: string[];
}

export interface StudyMaterial {
  id: string;
  chapterId: string;
  title: string;
  description: string;
  type: MaterialType;
  difficulty: Difficulty;
  date: string;
  readTime: string;
  contentMarkdown: string;
  keyFormulas?: string[];
}

export interface QuestionOption {
  id: string;
  label: string;
  text: string;
}

export interface Question {
  id: string;
  chapterId: string;
  topicId?: string;
  curriculum: Curriculum;
  difficulty: Difficulty;
  type: QuestionType;
  questionText: string;
  options?: QuestionOption[];
  correctAnswer: string;
  explanation: string;
  hints: string[];
  formulaUsed?: string;
}

export interface Test {
  id: string;
  title: string;
  chapterId?: string;
  chapterName?: string;
  type: TestType;
  curriculum: Curriculum;
  durationMinutes: number;
  totalMarks: number;
  questionCount: number;
  instructions: string[];
  questions: Question[];
}

export interface TestAttempt {
  id: string;
  testId: string;
  testTitle: string;
  chapterId?: string;
  studentId: string;
  score: number;
  maxScore: number;
  percentage: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  timeTakenSeconds: number;
  submittedAt: string;
  answers: Record<string, string>;
}

export interface PracticeSession {
  id: string;
  studentId: string;
  chapterId: string;
  chapterName: string;
  questionsAttempted: number;
  correctAnswers: number;
  accuracy: number;
  timeSpentSeconds: number;
  completedAt: string;
}

export interface ChapterProgressItem {
  chapter: Chapter;
  progressPercentage: number;
  questionsSolved: number;
  testsTaken: number;
  masteryLevel: MasteryLevel;
  isWeakTopic: boolean;
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  category: 'Milestone' | 'Consistency' | 'Mastery' | 'AI Tutor';
  points: number;
  isUnlocked?: boolean;
  unlockedAt?: string;
}

export interface Recommendation {
  id: string;
  studentId: string;
  title: string;
  reason: string;
  actionType: 'PRACTICE' | 'REVISE' | 'TEST';
  targetChapterId: string;
  targetChapterTitle: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  stepByStep?: string[];
  formulaReference?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userRole: UserRole;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
}
