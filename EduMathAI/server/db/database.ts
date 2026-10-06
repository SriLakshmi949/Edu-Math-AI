import fs from 'fs';
import path from 'path';
import {
  User, StudentProfile, TeacherProfile, ParentProfile, School, Classroom,
  Chapter, StudyMaterial, Question, Test, Progress, Achievement, StudentAchievement,
  Recommendation, Notification, ChatSession, ChatMessage, Assignment, AssignmentSubmission,
  ActivityLog, TestAttempt, PracticeSession
} from './schema';
import {
  SEED_USERS, SEED_STUDENT_PROFILE, SEED_TEACHER_PROFILE, SEED_PARENT_PROFILE,
  SEED_SCHOOLS, SEED_CLASSROOMS, SEED_CHAPTERS, SEED_STUDY_MATERIALS, SEED_QUESTIONS,
  SEED_TESTS, SEED_TEST_ATTEMPTS, SEED_PROGRESS, SEED_ACHIEVEMENTS, SEED_STUDENT_ACHIEVEMENTS,
  SEED_RECOMMENDATIONS, SEED_NOTIFICATIONS, SEED_ASSIGNMENTS, SEED_SUBMISSIONS, SEED_ACTIVITY_LOGS,
  hashPassword
} from './seedData';

interface DatabaseSchema {
  users: User[];
  studentProfiles: StudentProfile[];
  teacherProfiles: TeacherProfile[];
  parentProfiles: ParentProfile[];
  schools: School[];
  classrooms: Classroom[];
  chapters: Chapter[];
  studyMaterials: StudyMaterial[];
  questions: Question[];
  tests: Test[];
  testAttempts: TestAttempt[];
  practiceSessions: PracticeSession[];
  progress: Progress[];
  achievements: Achievement[];
  studentAchievements: StudentAchievement[];
  recommendations: Recommendation[];
  notifications: Notification[];
  chatSessions: ChatSession[];
  chatMessages: ChatMessage[];
  assignments: Assignment[];
  assignmentSubmissions: AssignmentSubmission[];
  activityLogs: ActivityLog[];
}

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const DB_FILE = path.join(DATA_DIR, 'edumath_db.json');

class DatabaseManager {
  private data: DatabaseSchema;
  private isLoaded = false;

  constructor() {
    this.data = this.getDefaultState();
    this.init();
  }

  private getDefaultState(): DatabaseSchema {
    return {
      users: [...SEED_USERS],
      studentProfiles: [SEED_STUDENT_PROFILE],
      teacherProfiles: [SEED_TEACHER_PROFILE],
      parentProfiles: [SEED_PARENT_PROFILE],
      schools: [...SEED_SCHOOLS],
      classrooms: [...SEED_CLASSROOMS],
      chapters: [...SEED_CHAPTERS],
      studyMaterials: [...SEED_STUDY_MATERIALS],
      questions: [...SEED_QUESTIONS],
      tests: [...SEED_TESTS],
      testAttempts: [...SEED_TEST_ATTEMPTS],
      practiceSessions: [],
      progress: [...SEED_PROGRESS],
      achievements: [...SEED_ACHIEVEMENTS],
      studentAchievements: [...SEED_STUDENT_ACHIEVEMENTS],
      recommendations: [...SEED_RECOMMENDATIONS],
      notifications: [...SEED_NOTIFICATIONS],
      chatSessions: [],
      chatMessages: [],
      assignments: [...SEED_ASSIGNMENTS],
      assignmentSubmissions: [...SEED_SUBMISSIONS],
      activityLogs: [...SEED_ACTIVITY_LOGS]
    };
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        this.data = { ...this.getDefaultState(), ...parsed };
      } else {
        this.persist();
      }
      this.isLoaded = true;
    } catch (err) {
      console.error('Error initializing database, using defaults:', err);
      this.data = this.getDefaultState();
      this.isLoaded = true;
    }
  }

  private persist() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write to DB file:', err);
    }
  }

  // --- Users & Auth ---
  public getUsers(): User[] {
    return this.data.users;
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: User): User {
    this.data.users.push(user);
    this.persist();
    return user;
  }

  public updateUser(id: string, updates: Partial<User>): User | undefined {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.data.users[idx] = { ...this.data.users[idx], ...updates };
      this.persist();
      return this.data.users[idx];
    }
    return undefined;
  }

  public toggleUserActive(id: string): User | undefined {
    const user = this.getUserById(id);
    if (user) {
      user.isActive = !user.isActive;
      this.persist();
      return user;
    }
    return undefined;
  }

  // --- Profiles ---
  public getStudentProfile(userId: string): StudentProfile | undefined {
    return this.data.studentProfiles.find(sp => sp.userId === userId);
  }

  public createStudentProfile(profile: StudentProfile): StudentProfile {
    this.data.studentProfiles.push(profile);
    this.persist();
    return profile;
  }

  public updateStudentProfile(userId: string, updates: Partial<StudentProfile>): StudentProfile | undefined {
    const idx = this.data.studentProfiles.findIndex(sp => sp.userId === userId);
    if (idx !== -1) {
      this.data.studentProfiles[idx] = { ...this.data.studentProfiles[idx], ...updates };
      this.persist();
      return this.data.studentProfiles[idx];
    }
    return undefined;
  }

  public getTeacherProfile(userId: string): TeacherProfile | undefined {
    return this.data.teacherProfiles.find(tp => tp.userId === userId);
  }

  public createTeacherProfile(profile: TeacherProfile): TeacherProfile {
    this.data.teacherProfiles.push(profile);
    this.persist();
    return profile;
  }

  public getParentProfile(userId: string): ParentProfile | undefined {
    return this.data.parentProfiles.find(pp => pp.userId === userId);
  }

  public createParentProfile(profile: ParentProfile): ParentProfile {
    this.data.parentProfiles.push(profile);
    this.persist();
    return profile;
  }

  // --- Chapters & Topics ---
  public getChapters(curriculum?: string): Chapter[] {
    if (!curriculum || curriculum === 'ALL') {
      return this.data.chapters;
    }
    return this.data.chapters.filter(
      c => c.curriculum === 'BOTH' || c.curriculum === curriculum
    );
  }

  public getChapterById(id: string): Chapter | undefined {
    return this.data.chapters.find(c => c.id === id);
  }

  // --- Study Materials ---
  public getStudyMaterials(chapterId?: string, type?: string): StudyMaterial[] {
    let list = this.data.studyMaterials;
    if (chapterId && chapterId !== 'ALL') {
      list = list.filter(m => m.chapterId === chapterId);
    }
    if (type && type !== 'ALL') {
      list = list.filter(m => m.type === type);
    }
    return list;
  }

  public getStudyMaterialById(id: string): StudyMaterial | undefined {
    return this.data.studyMaterials.find(m => m.id === id);
  }

  // --- Questions ---
  public getQuestions(filters?: { chapterId?: string; difficulty?: string; type?: string }): Question[] {
    let list = this.data.questions;
    if (filters?.chapterId && filters.chapterId !== 'ALL') {
      list = list.filter(q => q.chapterId === filters.chapterId);
    }
    if (filters?.difficulty && filters.difficulty !== 'ALL') {
      list = list.filter(q => q.difficulty === filters.difficulty);
    }
    if (filters?.type && filters.type !== 'ALL') {
      list = list.filter(q => q.type === filters.type);
    }
    return list;
  }

  public addQuestion(question: Question): Question {
    this.data.questions.push(question);
    this.persist();
    return question;
  }

  // --- Tests ---
  public getTests(curriculum?: string): Test[] {
    if (!curriculum || curriculum === 'ALL') {
      return this.data.tests;
    }
    return this.data.tests.filter(t => t.curriculum === 'BOTH' || t.curriculum === curriculum);
  }

  public getTestById(id: string): Test | undefined {
    return this.data.tests.find(t => t.id === id);
  }

  public addTest(test: Test): Test {
    this.data.tests.push(test);
    this.persist();
    return test;
  }

  public saveTestAttempt(attempt: TestAttempt): TestAttempt {
    this.data.testAttempts.unshift(attempt);
    
    // Update student progress and stats
    const student = this.getStudentProfile(attempt.studentId);
    if (student) {
      const allAttempts = this.data.testAttempts.filter(a => a.studentId === attempt.studentId);
      const totalScoreSum = allAttempts.reduce((sum, a) => sum + a.percentage, 0);
      const newAverage = Math.round(totalScoreSum / allAttempts.length);
      
      student.testAverage = newAverage;
      student.totalPoints += Math.round(attempt.score * 10);
      
      // Update chapter specific progress
      if (attempt.chapterId) {
        const prog = this.data.progress.find(
          p => p.studentId === attempt.studentId && p.chapterId === attempt.chapterId
        );
        if (prog) {
          prog.testsTaken += 1;
          prog.completionPercentage = Math.min(100, prog.completionPercentage + 15);
          if (attempt.percentage >= 80) {
            prog.isWeakTopic = false;
            prog.masteryLevel = attempt.percentage >= 90 ? 'Master' : 'Proficient';
          }
          prog.lastStudiedAt = new Date().toISOString();
        }
      }
    }

    // Add activity log
    this.addActivityLog({
      id: `act_${Date.now()}`,
      userId: attempt.studentId,
      userRole: 'STUDENT',
      userName: 'Aarav Sharma',
      action: 'TEST_SUBMITTED',
      details: `Completed "${attempt.testTitle}" with score ${attempt.score}/${attempt.maxScore} (${attempt.percentage}%).`,
      timestamp: new Date().toISOString()
    });

    this.persist();
    return attempt;
  }

  public getTestAttempts(studentId?: string): TestAttempt[] {
    if (!studentId) return this.data.testAttempts;
    return this.data.testAttempts.filter(a => a.studentId === studentId);
  }

  public getTestAttemptById(id: string): TestAttempt | undefined {
    return this.data.testAttempts.find(a => a.id === id);
  }

  // --- Practice Sessions ---
  public recordPracticeSession(session: PracticeSession): PracticeSession {
    this.data.practiceSessions.unshift(session);
    
    const student = this.getStudentProfile(session.studentId);
    if (student) {
      student.practiceQuestionsAttempted += session.questionsAttempted;
      student.practiceQuestionsCorrect += session.correctAnswers;
      student.totalPoints += session.correctAnswers * 5;
      
      // Update chapter progress
      const prog = this.data.progress.find(
        p => p.studentId === session.studentId && p.chapterId === session.chapterId
      );
      if (prog) {
        prog.questionsSolved += session.questionsAttempted;
        prog.completionPercentage = Math.min(100, prog.completionPercentage + Math.round(session.accuracy * 0.1));
        if (session.accuracy >= 75) {
          prog.isWeakTopic = false;
        }
        prog.lastStudiedAt = new Date().toISOString();
      }
    }

    this.persist();
    return session;
  }

  // --- Progress & Analytics ---
  public getProgress(studentId: string): Progress[] {
    return this.data.progress.filter(p => p.studentId === studentId);
  }

  // --- Achievements ---
  public getAchievements(): Achievement[] {
    return this.data.achievements;
  }

  public getStudentAchievements(studentId: string): (Achievement & { unlockedAt: string })[] {
    const studentAchs = this.data.studentAchievements.filter(sa => sa.studentId === studentId);
    return studentAchs.map(sa => {
      const ach = this.data.achievements.find(a => a.id === sa.achievementId);
      return {
        ...ach!,
        unlockedAt: sa.unlockedAt
      };
    }).filter(a => !!a.id);
  }

  public unlockAchievement(studentId: string, achievementCode: string): StudentAchievement | undefined {
    const ach = this.data.achievements.find(a => a.code === achievementCode);
    if (!ach) return undefined;

    const exists = this.data.studentAchievements.some(
      sa => sa.studentId === studentId && sa.achievementId === ach.id
    );
    if (exists) return undefined;

    const sa: StudentAchievement = {
      id: `sa_${Date.now()}`,
      studentId,
      achievementId: ach.id,
      unlockedAt: new Date().toISOString()
    };
    this.data.studentAchievements.push(sa);

    // Notification
    this.addNotification({
      id: `notif_${Date.now()}`,
      userId: studentId,
      title: `Achievement Unlocked: ${ach.title}`,
      message: ach.description,
      type: 'ACHIEVEMENT',
      isRead: false,
      createdAt: new Date().toISOString(),
      actionUrl: '/student/achievements'
    });

    this.persist();
    return sa;
  }

  // --- Recommendations ---
  public getRecommendations(studentId: string): Recommendation[] {
    return this.data.recommendations.filter(r => r.studentId === studentId);
  }

  public dismissRecommendation(id: string): boolean {
    const rec = this.data.recommendations.find(r => r.id === id);
    if (rec) {
      rec.completed = true;
      this.persist();
      return true;
    }
    return false;
  }

  // --- Notifications ---
  public getNotifications(userId: string): Notification[] {
    return this.data.notifications.filter(n => n.userId === userId);
  }

  public markNotificationAsRead(id: string): boolean {
    const notif = this.data.notifications.find(n => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.persist();
      return true;
    }
    return false;
  }

  public markAllNotificationsRead(userId: string): void {
    this.data.notifications
      .filter(n => n.userId === userId)
      .forEach(n => { n.isRead = true; });
    this.persist();
  }

  public addNotification(notification: Notification): Notification {
    this.data.notifications.unshift(notification);
    this.persist();
    return notification;
  }

  // --- Chat Sessions & Messages ---
  public getChatSessions(studentId: string): ChatSession[] {
    return this.data.chatSessions.filter(cs => cs.studentId === studentId);
  }

  public createChatSession(studentId: string, chapterId?: string, chapterTitle?: string): ChatSession {
    const session: ChatSession = {
      id: `chat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      studentId,
      chapterId,
      chapterTitle: chapterTitle || 'General Mathematics',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.chatSessions.unshift(session);
    this.persist();
    return session;
  }

  public getChatMessages(sessionId: string): ChatMessage[] {
    return this.data.chatMessages.filter(m => m.sessionId === sessionId);
  }

  public addChatMessage(message: ChatMessage): ChatMessage {
    this.data.chatMessages.push(message);
    const session = this.data.chatSessions.find(s => s.id === message.sessionId);
    if (session) {
      session.updatedAt = message.timestamp;
    }
    this.persist();
    return message;
  }

  // --- Assignments ---
  public getAssignments(classroomId?: string): Assignment[] {
    if (classroomId) {
      return this.data.assignments.filter(a => a.classroomId === classroomId);
    }
    return this.data.assignments;
  }

  public createAssignment(assignment: Assignment): Assignment {
    this.data.assignments.unshift(assignment);
    this.persist();
    return assignment;
  }

  public getSubmissions(assignmentId?: string): AssignmentSubmission[] {
    if (assignmentId) {
      return this.data.assignmentSubmissions.filter(s => s.assignmentId === assignmentId);
    }
    return this.data.assignmentSubmissions;
  }

  // --- Activity Logs ---
  public getActivityLogs(limit = 50): ActivityLog[] {
    return this.data.activityLogs.slice(0, limit);
  }

  public addActivityLog(log: ActivityLog): void {
    this.data.activityLogs.unshift(log);
    if (this.data.activityLogs.length > 200) {
      this.data.activityLogs = this.data.activityLogs.slice(0, 200);
    }
    this.persist();
  }

  // --- Schools & Classrooms ---
  public getSchools(): School[] {
    return this.data.schools;
  }

  public addSchool(school: School): School {
    this.data.schools.push(school);
    this.persist();
    return school;
  }

  public getClassrooms(schoolId?: string): Classroom[] {
    if (schoolId) {
      return this.data.classrooms.filter(c => c.schoolId === schoolId);
    }
    return this.data.classrooms;
  }

  public addClassroom(classroom: Classroom): Classroom {
    this.data.classrooms.push(classroom);
    this.persist();
    return classroom;
  }
}

export const db = new DatabaseManager();
