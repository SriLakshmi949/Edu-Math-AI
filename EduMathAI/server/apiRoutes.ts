import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { db } from './db/database';
import { hashPassword, DEMO_PASSWORD } from './db/seedData';
import { askMathTutor } from './geminiService';
import { User, StudentProfile, TeacherProfile, ParentProfile, UserRole } from './db/schema';

export const apiRouter = Router();

// ==========================================
// 1. AUTHENTICATION & DEMO ACCOUNTS
// ==========================================

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials. User not found.' });
  }

  if (!user.isActive) {
    return res.status(403).json({ error: 'This account has been deactivated by the platform admin.' });
  }

  const hashed = hashPassword(password);
  if (user.passwordHash !== hashed) {
    return res.status(401).json({ error: 'Invalid password. Please check your credentials.' });
  }

  if (role && user.role !== role) {
    return res.status(403).json({
      error: `Access Denied: This account is registered as a ${user.role}, not as a ${role}.`
    });
  }

  // Get associated profile
  let profile: any = null;
  if (user.role === 'STUDENT') profile = db.getStudentProfile(user.id);
  else if (user.role === 'TEACHER') profile = db.getTeacherProfile(user.id);
  else if (user.role === 'PARENT') profile = db.getParentProfile(user.id);

  // Return user info (safe, without password hash)
  const { passwordHash, ...safeUser } = user;
  return res.json({
    user: safeUser,
    profile,
    token: `edumath_token_${user.id}_${Date.now()}`
  });
});

apiRouter.post('/auth/demo-login', (req: Request, res: Response) => {
  const { role } = req.body;
  const demoEmailMap: Record<string, string> = {
    STUDENT: 'student@edumathai.com',
    TEACHER: 'teacher@edumathai.com',
    PARENT: 'parent@edumathai.com',
    SCHOOL_ADMIN: 'schooladmin@edumathai.com',
    PLATFORM_ADMIN: 'admin@edumathai.com'
  };

  const email = demoEmailMap[role] || 'student@edumathai.com';
  const user = db.getUserByEmail(email);

  if (!user) {
    return res.status(404).json({ error: 'Demo account not initialized.' });
  }

  let profile: any = null;
  if (user.role === 'STUDENT') profile = db.getStudentProfile(user.id);
  else if (user.role === 'TEACHER') profile = db.getTeacherProfile(user.id);
  else if (user.role === 'PARENT') profile = db.getParentProfile(user.id);

  const { passwordHash, ...safeUser } = user;
  return res.json({
    user: safeUser,
    profile,
    token: `edumath_token_${user.id}_${Date.now()}`
  });
});

apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const {
    role, firstName, lastName, email, password, phone,
    school, curriculum, guardianName, subject, schoolCode
  } = req.body;

  if (!role || !firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters in length.' });
  }

  if (role === 'PLATFORM_ADMIN') {
    return res.status(403).json({ error: 'Platform Admin accounts cannot be self-registered.' });
  }

  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email address already exists.' });
  }

  const userId = `user_${Date.now()}`;
  const newUser: User = {
    id: userId,
    email,
    passwordHash: hashPassword(password),
    role: role as UserRole,
    firstName,
    lastName,
    phone: phone || '',
    isActive: true,
    createdAt: new Date().toISOString()
  };

  db.createUser(newUser);

  let profile: any = null;
  if (role === 'STUDENT') {
    profile = db.createStudentProfile({
      id: `sp_${Date.now()}`,
      userId,
      schoolId: school || 'school_1',
      curriculum: (curriculum === 'AP_STATE' ? 'AP_STATE' : 'CBSE'),
      grade: 'Class 9',
      guardianName: guardianName || '',
      streakDays: 1,
      totalPoints: 50,
      practiceQuestionsAttempted: 0,
      practiceQuestionsCorrect: 0,
      overallProgressPercentage: 5,
      chaptersCompleted: 0,
      testAverage: 0
    });
  } else if (role === 'TEACHER') {
    profile = db.createTeacherProfile({
      id: `tp_${Date.now()}`,
      userId,
      schoolId: school || 'school_1',
      subject: subject || 'Mathematics',
      classesAssigned: ['Class 9-A']
    });
  } else if (role === 'PARENT') {
    profile = db.createParentProfile({
      id: `pp_${Date.now()}`,
      userId,
      studentId: 'user_student_1',
      studentEmail: 'student@edumathai.com'
    });
  }

  // Welcome notification
  db.addNotification({
    id: `notif_${Date.now()}`,
    userId,
    title: 'Welcome to EduMathAI!',
    message: `Hello ${firstName}! Your Class 9 mathematics journey starts here. Explore syllabus, take timed tests, or ask our 24/7 AI tutor.`,
    type: 'REMINDER',
    isRead: false,
    createdAt: new Date().toISOString(),
    actionUrl: role === 'STUDENT' ? '/student/dashboard' : '/dashboard'
  });

  const { passwordHash, ...safeUser } = newUser;
  return res.status(201).json({
    user: safeUser,
    profile,
    token: `edumath_token_${userId}_${Date.now()}`
  });
});

apiRouter.post('/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Please enter your registered email.' });
  }
  const user = db.getUserByEmail(email);
  if (!user) {
    // Return friendly status
    return res.json({ message: 'If an account exists with this email, a password reset link has been dispatched.' });
  }
  return res.json({
    message: `Password reset instructions have been sent to ${email}. For demonstration, your current password is: ${DEMO_PASSWORD}`
  });
});

// ==========================================
// 2. CHAPTERS & SYLLABUS
// ==========================================

apiRouter.get('/chapters', (req: Request, res: Response) => {
  const curriculum = req.query.curriculum as string;
  const chapters = db.getChapters(curriculum);
  return res.json(chapters);
});

apiRouter.get('/chapters/:id', (req: Request, res: Response) => {
  const chapter = db.getChapterById(req.params.id);
  if (!chapter) {
    return res.status(404).json({ error: 'Chapter not found' });
  }

  const materials = db.getStudyMaterials(chapter.id);
  const questions = db.getQuestions({ chapterId: chapter.id });
  const tests = db.getTests().filter(t => t.chapterId === chapter.id);

  return res.json({
    chapter,
    materials,
    questionsCount: questions.length,
    tests
  });
});

// ==========================================
// 3. STUDY MATERIALS & DOWNLOAD
// ==========================================

apiRouter.get('/materials', (req: Request, res: Response) => {
  const chapterId = req.query.chapterId as string;
  const type = req.query.type as string;
  const materials = db.getStudyMaterials(chapterId, type);
  return res.json(materials);
});

apiRouter.get('/materials/:id', (req: Request, res: Response) => {
  const material = db.getStudyMaterialById(req.params.id);
  if (!material) {
    return res.status(404).json({ error: 'Study material not found' });
  }
  return res.json(material);
});

apiRouter.get('/materials/:id/download', (req: Request, res: Response) => {
  const material = db.getStudyMaterialById(req.params.id);
  if (!material) {
    return res.status(404).json({ error: 'Study material not found' });
  }

  const filename = `${material.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.md`;
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  return res.send(material.contentMarkdown);
});

// ==========================================
// 4. PRACTICE SYSTEM
// ==========================================

apiRouter.get('/practice/questions', (req: Request, res: Response) => {
  const { chapterId, difficulty, type } = req.query as Record<string, string>;
  const questions = db.getQuestions({ chapterId, difficulty, type });
  return res.json(questions);
});

apiRouter.post('/practice/submit', (req: Request, res: Response) => {
  const {
    studentId, chapterId, chapterName, questionsAttempted,
    correctAnswers, timeSpentSeconds
  } = req.body;

  if (!studentId || !chapterId) {
    return res.status(400).json({ error: 'Missing required practice parameters' });
  }

  const accuracy = questionsAttempted > 0
    ? Math.round((correctAnswers / questionsAttempted) * 100)
    : 0;

  const session = db.recordPracticeSession({
    id: `prac_${Date.now()}`,
    studentId,
    chapterId,
    chapterName: chapterName || 'Class 9 Math Practice',
    questionsAttempted: Number(questionsAttempted) || 0,
    correctAnswers: Number(correctAnswers) || 0,
    accuracy,
    timeSpentSeconds: Number(timeSpentSeconds) || 60,
    completedAt: new Date().toISOString()
  });

  // Check achievements
  if (session.accuracy >= 90) {
    db.unlockAchievement(studentId, 'ACCURACY_90');
  }
  const student = db.getStudentProfile(studentId);
  if (student && student.practiceQuestionsAttempted >= 100) {
    db.unlockAchievement(studentId, 'SOLVED_100');
  }

  return res.json({ session, updatedStudent: student });
});

// ==========================================
// 5. TEST SYSTEM & ATTEMPTS
// ==========================================

apiRouter.get('/tests', (req: Request, res: Response) => {
  const curriculum = req.query.curriculum as string;
  const tests = db.getTests(curriculum);
  return res.json(tests);
});

apiRouter.get('/tests/:id', (req: Request, res: Response) => {
  const test = db.getTestById(req.params.id);
  if (!test) {
    return res.status(404).json({ error: 'Test not found' });
  }
  return res.json(test);
});

apiRouter.post('/tests/:id/submit', (req: Request, res: Response) => {
  const test = db.getTestById(req.params.id);
  if (!test) {
    return res.status(404).json({ error: 'Test not found' });
  }

  const { studentId, answers, timeTakenSeconds } = req.body;
  if (!studentId) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  const marksPerQuestion = test.questions.length > 0
    ? test.totalMarks / test.questions.length
    : 1;

  test.questions.forEach(q => {
    const studentAnswer = answers?.[q.id];
    if (!studentAnswer || String(studentAnswer).trim() === '') {
      unansweredCount++;
    } else if (String(studentAnswer).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  });

  const score = Math.round(correctCount * marksPerQuestion);
  const percentage = Math.round((correctCount / test.questions.length) * 100);

  const attempt = db.saveTestAttempt({
    id: `att_${Date.now()}`,
    testId: test.id,
    testTitle: test.title,
    chapterId: test.chapterId,
    studentId,
    score,
    maxScore: test.totalMarks,
    percentage,
    correctCount,
    incorrectCount,
    unansweredCount,
    timeTakenSeconds: Number(timeTakenSeconds) || 300,
    submittedAt: new Date().toISOString(),
    answers: answers || {}
  });

  // Unlock achievements
  db.unlockAchievement(studentId, 'FIRST_TEST');
  if (percentage >= 90) {
    db.unlockAchievement(studentId, 'ACCURACY_90');
  }

  // Create notification
  db.addNotification({
    id: `notif_${Date.now()}`,
    userId: studentId,
    title: `Test Evaluated: ${test.title}`,
    message: `You scored ${score}/${test.totalMarks} (${percentage}%). Review your answers and solutions now!`,
    type: 'TEST_RESULT',
    isRead: false,
    createdAt: new Date().toISOString(),
    actionUrl: `/student/tests/result/${attempt.id}`
  });

  return res.json(attempt);
});

apiRouter.get('/tests/attempts/student/:studentId', (req: Request, res: Response) => {
  const attempts = db.getTestAttempts(req.params.studentId);
  return res.json(attempts);
});

apiRouter.get('/tests/attempts/:id', (req: Request, res: Response) => {
  const attempt = db.getTestAttemptById(req.params.id);
  if (!attempt) {
    return res.status(404).json({ error: 'Test attempt not found' });
  }
  const test = db.getTestById(attempt.testId);
  return res.json({ attempt, test });
});

// ==========================================
// 6. PROGRESS & ANALYTICS
// ==========================================

apiRouter.get('/progress/:studentId', (req: Request, res: Response) => {
  const student = db.getStudentProfile(req.params.studentId);
  const chapterProgress = db.getProgress(req.params.studentId);
  const attempts = db.getTestAttempts(req.params.studentId);
  const chapters = db.getChapters();

  // Combine chapter details with progress
  const enriched = chapters.map(ch => {
    const prog = chapterProgress.find(p => p.chapterId === ch.id);
    return {
      chapter: ch,
      progressPercentage: prog ? prog.completionPercentage : 0,
      questionsSolved: prog ? prog.questionsSolved : 0,
      testsTaken: prog ? prog.testsTaken : 0,
      masteryLevel: prog ? prog.masteryLevel : 'Novice',
      isWeakTopic: prog ? prog.isWeakTopic : false
    };
  });

  const weakTopics = enriched.filter(e => e.isWeakTopic || e.progressPercentage < 50);
  const strongTopics = enriched.filter(e => e.progressPercentage >= 80);

  return res.json({
    student,
    chapters: enriched,
    weakTopics,
    strongTopics,
    recentTests: attempts.slice(0, 5)
  });
});

// ==========================================
// 7. ACHIEVEMENTS & RECOMMENDATIONS
// ==========================================

apiRouter.get('/achievements/:studentId', (req: Request, res: Response) => {
  const allAchievements = db.getAchievements();
  const unlocked = db.getStudentAchievements(req.params.studentId);
  const unlockedIds = new Set(unlocked.map(u => u.id));

  const list = allAchievements.map(ach => ({
    ...ach,
    isUnlocked: unlockedIds.has(ach.id),
    unlockedAt: unlocked.find(u => u.id === ach.id)?.unlockedAt
  }));

  return res.json(list);
});

apiRouter.get('/recommendations/:studentId', (req: Request, res: Response) => {
  const recs = db.getRecommendations(req.params.studentId);
  return res.json(recs);
});

apiRouter.post('/recommendations/:id/dismiss', (req: Request, res: Response) => {
  const success = db.dismissRecommendation(req.params.id);
  return res.json({ success });
});

// ==========================================
// 8. AI MATH TUTOR (GEMINI POWERED)
// ==========================================

apiRouter.post('/tutor/chat', async (req: Request, res: Response) => {
  const { studentId, message, chapterId, chapterTitle, sessionId, history } = req.body;
  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'Message cannot be empty.' });
  }

  try {
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      const newSession = db.createChatSession(
        studentId || 'user_student_1',
        chapterId,
        chapterTitle
      );
      currentSessionId = newSession.id;
    }

    // Save user message
    db.addChatMessage({
      id: `msg_${Date.now()}_u`,
      sessionId: currentSessionId,
      role: 'user',
      text: message,
      timestamp: new Date().toISOString()
    });

    // Call server-side Gemini tutor
    const tutorResponse = await askMathTutor({
      message,
      chapterTitle,
      history: history || []
    });

    // Save tutor reply
    const assistantMsg = db.addChatMessage({
      id: `msg_${Date.now()}_a`,
      sessionId: currentSessionId,
      role: 'assistant',
      text: tutorResponse.text,
      stepByStep: tutorResponse.stepByStep,
      formulaReference: tutorResponse.formulaReference,
      timestamp: new Date().toISOString()
    });

    // Record activity
    if (studentId) {
      db.unlockAchievement(studentId, 'AI_EXPLORER');
    }

    return res.json({
      sessionId: currentSessionId,
      reply: assistantMsg
    });
  } catch (err: any) {
    console.error('Error in tutor chat route:', err);
    return res.status(500).json({
      error: 'An error occurred while contacting EduMathAI Tutor. Please try again.'
    });
  }
});

apiRouter.get('/tutor/sessions/:studentId', (req: Request, res: Response) => {
  const sessions = db.getChatSessions(req.params.studentId);
  return res.json(sessions);
});

apiRouter.get('/tutor/sessions/:sessionId/messages', (req: Request, res: Response) => {
  const messages = db.getChatMessages(req.params.sessionId);
  return res.json(messages);
});

// ==========================================
// 9. NOTIFICATIONS
// ==========================================

apiRouter.get('/notifications/:userId', (req: Request, res: Response) => {
  const notifs = db.getNotifications(req.params.userId);
  return res.json(notifs);
});

apiRouter.post('/notifications/:id/read', (req: Request, res: Response) => {
  const success = db.markNotificationAsRead(req.params.id);
  return res.json({ success });
});

apiRouter.post('/notifications/read-all', (req: Request, res: Response) => {
  const { userId } = req.body;
  if (userId) {
    db.markAllNotificationsRead(userId);
  }
  return res.json({ success: true });
});

// ==========================================
// 10. TEACHER PORTAL ROUTES
// ==========================================

apiRouter.get('/teacher/dashboard', (req: Request, res: Response) => {
  const classrooms = db.getClassrooms();
  const assignments = db.getAssignments();
  const tests = db.getTests();
  const students = db.getUsers().filter(u => u.role === 'STUDENT');

  return res.json({
    totalStudents: 74,
    activeStudents: 68,
    averageClassScore: 78.4,
    assignmentsPending: 12,
    testsCompleted: 142,
    classrooms,
    recentAssignments: assignments,
    tests
  });
});

apiRouter.get('/teacher/students', (req: Request, res: Response) => {
  const students = db.getUsers().filter(u => u.role === 'STUDENT');
  const enriched = students.map(s => {
    const sp = db.getStudentProfile(s.id);
    return {
      id: s.id,
      name: `${s.firstName} ${s.lastName}`,
      email: s.email,
      grade: 'Class 9',
      section: 'A',
      streakDays: sp?.streakDays || 1,
      overallProgress: sp?.overallProgressPercentage || 50,
      testAverage: sp?.testAverage || 75,
      questionsAttempted: sp?.practiceQuestionsAttempted || 0,
      status: (sp?.testAverage || 75) >= 70 ? 'Good' : 'Needs Support'
    };
  });
  return res.json(enriched);
});

apiRouter.post('/teacher/assignments', (req: Request, res: Response) => {
  const { classroomId, teacherId, chapterId, chapterName, title, description, dueDate, totalMarks } = req.body;
  const assignment = db.createAssignment({
    id: `asg_${Date.now()}`,
    classroomId: classroomId || 'class_9a',
    teacherId: teacherId || 'user_teacher_1',
    chapterId: chapterId || 'chap_1',
    chapterName: chapterName || 'Number Systems',
    title,
    description,
    dueDate: dueDate || new Date(Date.now() + 86400000 * 5).toISOString(),
    totalMarks: Number(totalMarks) || 20,
    createdAt: new Date().toISOString()
  });

  // Notify student
  db.addNotification({
    id: `notif_${Date.now()}`,
    userId: 'user_student_1',
    title: `New Assignment: ${title}`,
    message: `Dr. Sunita Rao posted a new assignment for ${chapterName}.`,
    type: 'ASSIGNMENT',
    isRead: false,
    createdAt: new Date().toISOString(),
    actionUrl: '/student/practice'
  });

  return res.status(201).json(assignment);
});

apiRouter.post('/teacher/tests', (req: Request, res: Response) => {
  const { title, chapterId, chapterName, durationMinutes, totalMarks, questions } = req.body;
  const newTest = db.addTest({
    id: `test_${Date.now()}`,
    title,
    chapterId,
    chapterName,
    type: 'Chapter Test',
    curriculum: 'BOTH',
    durationMinutes: Number(durationMinutes) || 25,
    totalMarks: Number(totalMarks) || 20,
    questionCount: questions?.length || 4,
    instructions: ['Read questions carefully.', 'Calculators not allowed.', 'Submit before time expires.'],
    questions: questions || []
  });
  return res.status(201).json(newTest);
});

// ==========================================
// 11. PARENT PORTAL ROUTES
// ==========================================

apiRouter.get('/parent/child-data', (req: Request, res: Response) => {
  const student = db.getUserById('user_student_1');
  const studentProfile = db.getStudentProfile('user_student_1');
  const attempts = db.getTestAttempts('user_student_1');
  const progressList = db.getProgress('user_student_1');
  const recs = db.getRecommendations('user_student_1');

  const weakChapters = progressList.filter(p => p.isWeakTopic || p.completionPercentage < 60);
  const strongChapters = progressList.filter(p => p.completionPercentage >= 80);

  return res.json({
    child: {
      name: `${student?.firstName} ${student?.lastName}`,
      email: student?.email,
      grade: 'Class 9',
      school: 'Delhi Public International School',
      curriculum: studentProfile?.curriculum || 'CBSE'
    },
    metrics: {
      overallProgress: studentProfile?.overallProgressPercentage || 68,
      chaptersCompleted: studentProfile?.chaptersCompleted || 8,
      totalChapters: 15,
      testAverage: studentProfile?.testAverage || 82,
      practiceAccuracy: Math.round(
        ((studentProfile?.practiceQuestionsCorrect || 104) /
         (studentProfile?.practiceQuestionsAttempted || 124)) * 100
      ),
      studyStreakDays: studentProfile?.streakDays || 7,
      totalStudyHours: 24.5
    },
    recentTests: attempts.slice(0, 4),
    weakAreas: weakChapters.map(w => ({
      chapterId: w.chapterId,
      name: db.getChapterById(w.chapterId)?.title || w.chapterId,
      progress: w.completionPercentage,
      status: 'Needs Practice'
    })),
    strengths: strongChapters.map(s => ({
      chapterId: s.chapterId,
      name: db.getChapterById(s.chapterId)?.title || s.chapterId,
      progress: s.completionPercentage,
      status: 'Mastered'
    })),
    teacherRecommendations: [
      'Encourage 20 minutes daily practice on Circles theorems and cyclic quadrilaterals.',
      'Aarav is showing great algebra aptitude; keep up the consistent pace in Polynomials.'
    ],
    aiRecommendations: recs
  });
});

// ==========================================
// 12. SCHOOL ADMIN PORTAL ROUTES
// ==========================================

apiRouter.get('/school-admin/overview', (req: Request, res: Response) => {
  const school = db.getSchools()[0];
  const classrooms = db.getClassrooms();
  const teachers = db.getUsers().filter(u => u.role === 'TEACHER');
  const students = db.getUsers().filter(u => u.role === 'STUDENT');

  return res.json({
    school,
    metrics: {
      totalStudents: 420,
      totalTeachers: 28,
      totalClasses: 12,
      averagePerformance: 78.4,
      passRate: 94.2,
      activeUsersToday: 386
    },
    classrooms,
    teachers,
    chapterPerformance: [
      { chapter: 'Number Systems', avgScore: 84 },
      { chapter: 'Polynomials', avgScore: 81 },
      { chapter: 'Coordinate Geometry', avgScore: 88 },
      { chapter: 'Lines & Angles', avgScore: 76 },
      { chapter: 'Triangles', avgScore: 69 },
      { chapter: 'Circles', avgScore: 64 },
      { chapter: 'Surface Areas & Volumes', avgScore: 66 },
      { chapter: 'Statistics', avgScore: 79 }
    ]
  });
});

apiRouter.post('/school-admin/teachers', (req: Request, res: Response) => {
  const { firstName, lastName, email, phone, subject } = req.body;
  const newTeacher: User = {
    id: `user_teacher_${Date.now()}`,
    email,
    passwordHash: hashPassword(DEMO_PASSWORD),
    role: 'TEACHER',
    firstName,
    lastName,
    phone,
    isActive: true,
    createdAt: new Date().toISOString()
  };
  db.createUser(newTeacher);
  db.createTeacherProfile({
    id: `tp_${Date.now()}`,
    userId: newTeacher.id,
    schoolId: 'school_1',
    subject: subject || 'Mathematics',
    classesAssigned: ['Class 9-C']
  });
  return res.status(201).json(newTeacher);
});

apiRouter.post('/school-admin/classes', (req: Request, res: Response) => {
  const { name, grade, section } = req.body;
  const newClass = db.addClassroom({
    id: `class_${Date.now()}`,
    schoolId: 'school_1',
    name: name || `Class ${grade}-${section}`,
    grade: grade || 'Class 9',
    section: section || 'C',
    teacherId: 'user_teacher_1',
    studentCount: 32
  });
  return res.status(201).json(newClass);
});

// ==========================================
// 13. PLATFORM ADMIN PORTAL ROUTES
// ==========================================

apiRouter.get('/admin/overview', (req: Request, res: Response) => {
  const users = db.getUsers();
  const schools = db.getSchools();
  const chapters = db.getChapters();
  const questions = db.getQuestions();
  const tests = db.getTests();
  const logs = db.getActivityLogs(20);

  const studentCount = users.filter(u => u.role === 'STUDENT').length;
  const teacherCount = users.filter(u => u.role === 'TEACHER').length;
  const parentCount = users.filter(u => u.role === 'PARENT').length;
  const adminCount = users.filter(u => u.role === 'SCHOOL_ADMIN' || u.role === 'PLATFORM_ADMIN').length;

  return res.json({
    metrics: {
      totalUsers: users.length,
      studentCount: 3120, // aggregated platform stats
      teacherCount: 184,
      parentCount: 2980,
      schoolCount: schools.length,
      activeSessions: 842,
      totalChapters: chapters.length,
      totalQuestions: questions.length,
      totalTests: tests.length
    },
    users: users.map(u => {
      const { passwordHash, ...rest } = u;
      return rest;
    }),
    schools,
    activityLogs: logs
  });
});

apiRouter.post('/admin/users/toggle/:id', (req: Request, res: Response) => {
  const user = db.toggleUserActive(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json({ id: user.id, isActive: user.isActive });
});

apiRouter.post('/admin/schools', (req: Request, res: Response) => {
  const { name, code, city, state, board } = req.body;
  const newSchool = db.addSchool({
    id: `school_${Date.now()}`,
    name,
    code,
    city,
    state,
    board,
    totalStudents: 150,
    totalTeachers: 12,
    averageScore: 75.0,
    passRate: 90.0
  });
  return res.status(201).json(newSchool);
});

apiRouter.get('/admin/activity', (req: Request, res: Response) => {
  const logs = db.getActivityLogs(50);
  return res.json(logs);
});

// ==========================================
// 14. PROFILE & SETTINGS
// ==========================================

apiRouter.put('/users/profile', (req: Request, res: Response) => {
  const { userId, firstName, lastName, phone, curriculum } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const updatedUser = db.updateUser(userId, { firstName, lastName, phone });
  if (curriculum) {
    db.updateStudentProfile(userId, { curriculum });
  }

  if (!updatedUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { passwordHash, ...safe } = updatedUser;
  return res.json(safe);
});

apiRouter.put('/users/change-password', (req: Request, res: Response) => {
  const { userId, currentPassword, newPassword } = req.body;
  if (!userId || !currentPassword || !newPassword) {
    return res.status(400).json({ error: 'All password fields are required' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
  }

  const user = db.getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (user.passwordHash !== hashPassword(currentPassword)) {
    return res.status(401).json({ error: 'Current password is incorrect.' });
  }

  db.updateUser(userId, { passwordHash: hashPassword(newPassword) });
  return res.json({ message: 'Password updated successfully.' });
});

// ==========================================
// 15. PROJECT ZIP DOWNLOAD
// ==========================================

apiRouter.get('/download-project-zip', (req: Request, res: Response) => {
  const zipPath = path.resolve(process.cwd(), 'EduMathAI-project.zip');

  if (!fs.existsSync(zipPath)) {
    try {
      execSync('python3 create_project_zip.py');
    } catch (err) {
      console.error('Failed to generate zip:', err);
      return res.status(500).json({ error: 'Failed to generate project archive' });
    }
  }

  res.setHeader('Content-Disposition', 'attachment; filename="EduMathAI-Class9-Platform.zip"');
  res.setHeader('Content-Type', 'application/zip');
  return res.sendFile(zipPath);
});

