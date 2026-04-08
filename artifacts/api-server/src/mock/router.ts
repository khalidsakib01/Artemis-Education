import { Router } from "express";

type Category = {
  id: string;
  nameBn: string;
  nameEn: string;
  icon: string;
  courseCount: number;
};

type Course = {
  id: number;
  titleBn: string;
  titleEn: string;
  descriptionBn?: string;
  descriptionEn?: string;
  category: string;
  instructor: string;
  thumbnailUrl?: string;
  price: number;
  originalPrice?: number;
  totalLessons: number;
  totalDuration?: string;
  rating: number;
  enrolledCount: number;
  isFeatured: boolean;
  level: "beginner" | "intermediate" | "advanced";
  tags?: string[];
  syllabus?: string[];
  requirements?: string[];
};

type Module = {
  id: number;
  courseId: number;
  titleBn: string;
  titleEn: string;
  order: number;
};

type Lesson = {
  id: number;
  courseId: number;
  moduleId?: number;
  titleBn: string;
  titleEn: string;
  type: "video" | "pdf" | "quiz";
  duration?: string;
  videoUrl?: string;
  pdfUrl?: string;
  order: number;
  isFree: boolean;
};

type Quiz = {
  id: number;
  titleBn: string;
  titleEn: string;
  courseId?: number;
  totalQuestions: number;
  timeLimitMinutes: number;
  passingScore: number;
};

type QuizQuestion = {
  id: number;
  quizId: number;
  questionBn: string;
  questionEn?: string;
  options: string[];
  correctOption: number;
  explanation?: string;
  order: number;
};

type LiveClass = {
  id: number;
  titleBn: string;
  titleEn: string;
  instructor: string;
  instructorAvatar?: string;
  subject: string;
  scheduledAt: string;
  durationMinutes: number;
  joinUrl?: string;
  isLive: boolean;
  enrolledCount: number;
  courseId?: number;
};

type UserProfile = {
  id: number;
  nameBn: string;
  nameEn: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
  classLevel?: string;
  goal?: string;
  totalPoints: number;
  badges: string[];
  joinedAt: string;
};

type Enrollment = {
  id: number;
  userId: number;
  courseId: number;
  enrolledAt: string;
  progressPercent: number;
  completedLessons: number;
};

type LessonProgress = {
  id: number;
  userId: number;
  lessonId: number;
  courseId: number;
  completed: boolean;
  watchedSeconds: number;
  completedAt?: string;
};

type Payment = {
  id: number;
  userId: number;
  courseId: number;
  amount: number;
  method: "bkash" | "nagad" | "manual";
  status: "pending" | "completed" | "failed";
  transactionId?: string;
  couponCode?: string;
  createdAt: string;
};

type QuizResult = {
  id: number;
  userId: number;
  quizId: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
  submittedAt: string;
};

const demoUserId = 1;
const now = Date.now();

const categories: Category[] = [
  { id: "hsc", nameBn: "HSC", nameEn: "HSC", icon: "graduation-cap", courseCount: 2 },
  { id: "ssc", nameBn: "SSC", nameEn: "SSC", icon: "book-open", courseCount: 1 },
  { id: "admission", nameBn: "Admission", nameEn: "Admission", icon: "target", courseCount: 1 },
];

const courses: Course[] = [
  {
    id: 1,
    titleBn: "এইচএসসি পদার্থবিজ্ঞান সম্পূর্ণ কোর্স ২০২৬",
    titleEn: "HSC Physics Complete Course 2026",
    descriptionBn: "মেকানিক্স, তরঙ্গ, বিদ্যুৎ ও পরীক্ষার প্রস্তুতি একসাথে।",
    descriptionEn: "Core mechanics, waves, electricity, and exam preparation.",
    category: "hsc",
    instructor: "Dr. Rafiqul Islam",
    thumbnailUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=450&fit=crop",
    price: 1299,
    originalPrice: 1999,
    totalLessons: 6,
    totalDuration: "12 hours",
    rating: 4.8,
    enrolledCount: 12450,
    isFeatured: true,
    level: "intermediate",
    tags: ["HSC", "Physics", "2026"],
    syllabus: ["Motion", "Forces", "Waves", "Electricity"],
    requirements: ["Basic SSC science background"],
  },
  {
    id: 2,
    titleBn: "এইচএসসি গণিত ক্র্যাশ কোর্স",
    titleEn: "HSC Mathematics Crash Course",
    descriptionBn: "বীজগণিত, ক্যালকুলাস ও সমস্যা সমাধানের দ্রুত প্রস্তুতি।",
    descriptionEn: "Fast-track algebra, calculus, and problem-solving practice.",
    category: "hsc",
    instructor: "Abu Taher",
    thumbnailUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&h=450&fit=crop",
    price: 999,
    originalPrice: 1499,
    totalLessons: 4,
    totalDuration: "8 hours",
    rating: 4.9,
    enrolledCount: 18920,
    isFeatured: true,
    level: "intermediate",
    tags: ["HSC", "Math"],
    syllabus: ["Functions", "Calculus", "Complex Numbers"],
    requirements: ["Comfort with algebra"],
  },
  {
    id: 3,
    titleBn: "এসএসসি বাংলা ফাউন্ডেশন",
    titleEn: "SSC Bangla Foundation",
    descriptionBn: "সাহিত্য ও ব্যাকরণের গাইডেড অনুশীলনসহ পূর্ণ রিভিশন।",
    descriptionEn: "Literature and grammar review with guided practice.",
    category: "ssc",
    instructor: "Naznin Sultana",
    thumbnailUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=450&fit=crop",
    price: 799,
    originalPrice: 1199,
    totalLessons: 3,
    totalDuration: "6 hours",
    rating: 4.7,
    enrolledCount: 8050,
    isFeatured: false,
    level: "beginner",
    tags: ["SSC", "Bangla"],
    syllabus: ["Poetry", "Grammar", "Writing"],
    requirements: ["Regular practice"],
  },
];

const modules: Module[] = [
  { id: 1, courseId: 1, titleBn: "Mechanics", titleEn: "Mechanics", order: 1 },
  { id: 2, courseId: 1, titleBn: "Electricity", titleEn: "Electricity", order: 2 },
  { id: 3, courseId: 2, titleBn: "Core Math", titleEn: "Core Math", order: 1 },
];

const lessons: Lesson[] = [
  { id: 1, courseId: 1, moduleId: 1, titleBn: "গতি পরিচিতি", titleEn: "Motion Basics", type: "video", duration: "18 min", videoUrl: "https://example.com/lesson-1", order: 1, isFree: true },
  { id: 2, courseId: 1, moduleId: 1, titleBn: "নিউটনের সূত্র", titleEn: "Newton's Laws", type: "video", duration: "22 min", videoUrl: "https://example.com/lesson-2", order: 2, isFree: false },
  { id: 3, courseId: 1, moduleId: 1, titleBn: "বল ও অনুশীলনী", titleEn: "Forces Worksheet", type: "pdf", duration: "12 min", pdfUrl: "https://example.com/worksheet-1.pdf", order: 3, isFree: false },
  { id: 4, courseId: 1, moduleId: 2, titleBn: "তড়িৎ প্রবাহ ও ভোল্টেজ", titleEn: "Current and Voltage", type: "video", duration: "25 min", videoUrl: "https://example.com/lesson-4", order: 4, isFree: false },
  { id: 5, courseId: 2, moduleId: 3, titleBn: "ফাংশনের রিভিউ", titleEn: "Functions Review", type: "video", duration: "20 min", videoUrl: "https://example.com/math-1", order: 1, isFree: true },
  { id: 6, courseId: 2, moduleId: 3, titleBn: "ক্যালকুলাস ওয়ার্মআপ", titleEn: "Calculus Warmup", type: "quiz", duration: "15 min", order: 2, isFree: false },
];

const quizzes: Quiz[] = [
  { id: 1, titleBn: "মেকানিক্স কুইজ", titleEn: "Mechanics Quiz", courseId: 1, totalQuestions: 3, timeLimitMinutes: 10, passingScore: 60 },
  { id: 2, titleBn: "ক্যালকুলাস ওয়ার্মআপ", titleEn: "Calculus Warmup", courseId: 2, totalQuestions: 2, timeLimitMinutes: 8, passingScore: 50 },
];

const quizQuestions: QuizQuestion[] = [
  { id: 101, quizId: 1, questionBn: "What does acceleration measure?", questionEn: "What does acceleration measure?", options: ["Change in velocity", "Distance only", "Mass only", "Time only"], correctOption: 0, explanation: "Acceleration is the rate of change of velocity.", order: 1 },
  { id: 102, quizId: 1, questionBn: "Which law links force, mass, and acceleration?", questionEn: "Which law links force, mass, and acceleration?", options: ["Newton's first", "Newton's second", "Newton's third", "Ohm's law"], correctOption: 1, explanation: "F = ma is Newton's second law.", order: 2 },
  { id: 103, quizId: 1, questionBn: "Momentum equals?", questionEn: "Momentum equals?", options: ["m/a", "m+v", "m*v", "v/t"], correctOption: 2, explanation: "Momentum is mass times velocity.", order: 3 },
  { id: 201, quizId: 2, questionBn: "Derivative of x^2 is?", questionEn: "Derivative of x^2 is?", options: ["x", "2x", "x^3", "2"], correctOption: 1, explanation: "The derivative of x squared is 2x.", order: 1 },
  { id: 202, quizId: 2, questionBn: "Integral of 1 dx is?", questionEn: "Integral of 1 dx is?", options: ["0", "x + C", "1/x", "2x"], correctOption: 1, explanation: "The antiderivative of 1 is x + C.", order: 2 },
];

const liveClasses: LiveClass[] = [
  { id: 1, titleBn: "পদার্থবিজ্ঞান লাইভ সমস্যা সমাধান", titleEn: "Physics Live Problem Solving", instructor: "Dr. Rafiqul Islam", instructorAvatar: "https://randomuser.me/api/portraits/men/32.jpg", subject: "Physics", scheduledAt: new Date(now + 1000 * 60 * 60 * 24).toISOString(), durationMinutes: 90, joinUrl: "https://example.com/live-1", isLive: false, enrolledCount: 420, courseId: 1 },
  { id: 2, titleBn: "গণিত রিভিশন ম্যারাথন", titleEn: "Math Revision Marathon", instructor: "Abu Taher", instructorAvatar: "https://randomuser.me/api/portraits/men/45.jpg", subject: "Mathematics", scheduledAt: new Date(now + 1000 * 60 * 60 * 48).toISOString(), durationMinutes: 75, joinUrl: "https://example.com/live-2", isLive: false, enrolledCount: 360, courseId: 2 },
];

const leaderboard = [
  { rank: 1, userId: 7, userName: "Maya Rahman", avatarUrl: "https://randomuser.me/api/portraits/women/28.jpg", totalPoints: 980, quizzesCompleted: 21, streak: 14 },
  { rank: 2, userId: 3, userName: "Arif Hasan", avatarUrl: "https://randomuser.me/api/portraits/men/67.jpg", totalPoints: 910, quizzesCompleted: 19, streak: 11 },
  { rank: 3, userId: demoUserId, userName: "Demo Learner", avatarUrl: "https://randomuser.me/api/portraits/lego/1.jpg", totalPoints: 860, quizzesCompleted: 15, streak: 7 },
];

const user: UserProfile = {
  id: demoUserId,
  nameBn: "ডেমো শিক্ষার্থী",
  nameEn: "Demo Learner",
  email: "demo@student.local",
  avatarUrl: "https://randomuser.me/api/portraits/lego/1.jpg",
  classLevel: "HSC",
  goal: "HSC 2026",
  totalPoints: 860,
  badges: ["Fast Learner", "7 Day Streak"],
  joinedAt: new Date(now - 1000 * 60 * 60 * 24 * 30).toISOString(),
};

let enrollments: Enrollment[] = [
  {
    id: 1,
    userId: demoUserId,
    courseId: 1,
    enrolledAt: new Date(now - 1000 * 60 * 60 * 24 * 7).toISOString(),
    progressPercent: 50,
    completedLessons: 2,
  },
];

let progressItems: LessonProgress[] = [
  {
    id: 1,
    userId: demoUserId,
    lessonId: 1,
    courseId: 1,
    completed: true,
    watchedSeconds: 1080,
    completedAt: new Date(now - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 2,
    userId: demoUserId,
    lessonId: 2,
    courseId: 1,
    completed: true,
    watchedSeconds: 1320,
    completedAt: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
  },
];

let payments: Payment[] = [
  {
    id: 1,
    userId: demoUserId,
    courseId: 1,
    amount: 1299,
    method: "bkash",
    status: "completed",
    transactionId: "DEMO-TXN-001",
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
];

let quizResults: QuizResult[] = [
  {
    id: 1,
    userId: demoUserId,
    quizId: 1,
    score: 67,
    totalQuestions: 3,
    correctAnswers: 2,
    passed: true,
    submittedAt: new Date(now - 1000 * 60 * 60 * 12).toISOString(),
  },
];

function getCourseById(id: number) {
  return courses.find((course) => course.id === id);
}

function getQuizById(id: number) {
  return quizzes.find((quiz) => quiz.id === id);
}

function nextId(items: Array<{ id: number }>) {
  return items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;
}

function buildDashboardSummary() {
  const completedProgress = progressItems.filter((item) => item.completed);
  const completedCourses = enrollments.filter((item) => item.progressPercent >= 100).length;
  const averageQuizScore = quizResults.length
    ? Math.round(quizResults.reduce((sum, result) => sum + result.score, 0) / quizResults.length)
    : 0;

  const recentActivity = [
    ...completedProgress.slice(-3).map((item) => ({
      type: "lesson_completed",
      titleBn: "পাঠ সম্পন্ন",
      titleEn: "Lesson Completed",
      timestamp: item.completedAt ?? new Date().toISOString(),
      points: 10,
    })),
    ...quizResults.slice(-2).map((result) => ({
      type: "quiz_taken",
      titleBn: "কুইজ দেওয়া হয়েছে",
      titleEn: "Quiz Taken",
      timestamp: result.submittedAt,
      points: result.score,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return {
    enrolledCourses: enrollments.length,
    completedCourses,
    totalLessonsCompleted: completedProgress.length,
    totalQuizzesTaken: quizResults.length,
    averageQuizScore,
    currentStreak: 7,
    totalPoints: user.totalPoints,
    upcomingLiveClasses: liveClasses.length,
    recentActivity,
  };
}

const router = Router();

router.get("/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

router.get("/categories", (_req, res) => {
  res.json(categories);
});

router.get("/courses", (req, res) => {
  const category = typeof req.query.category === "string" ? req.query.category : undefined;
  const search = typeof req.query.search === "string" ? req.query.search.toLowerCase() : undefined;
  const featured = req.query.featured === "true";

  const filtered = courses.filter((course) => {
    if (category && course.category !== category) return false;
    if (featured && !course.isFeatured) return false;
    if (search && !`${course.titleBn} ${course.titleEn}`.toLowerCase().includes(search)) return false;
    return true;
  });

  res.json(filtered);
});

router.get("/courses/:id", (req, res) => {
  const id = Number(req.params.id);
  const course = getCourseById(id);

  if (!course) {
    res.status(404).json({ error: "Course not found" });
    return;
  }

  const courseModules = modules
    .filter((item) => item.courseId === id)
    .sort((a, b) => a.order - b.order)
    .map((item) => ({
      ...item,
      lessons: lessons
        .filter((lesson) => lesson.moduleId === item.id)
        .sort((a, b) => a.order - b.order),
    }));

  res.json({
    ...course,
    modules: courseModules,
  });
});

router.get("/courses/:id/lessons", (req, res) => {
  const id = Number(req.params.id);
  res.json(lessons.filter((lesson) => lesson.courseId === id).sort((a, b) => a.order - b.order));
});

router.get("/lessons/:id", (req, res) => {
  const id = Number(req.params.id);
  const lesson = lessons.find((item) => item.id === id);

  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }

  res.json(lesson);
});

router.get("/quizzes", (req, res) => {
  const courseId = req.query.courseId ? Number(req.query.courseId) : undefined;
  res.json(courseId ? quizzes.filter((quiz) => quiz.courseId === courseId) : quizzes);
});

router.get("/quizzes/:id", (req, res) => {
  const id = Number(req.params.id);
  const quiz = getQuizById(id);

  if (!quiz) {
    res.status(404).json({ error: "Quiz not found" });
    return;
  }

  const questions = quizQuestions
    .filter((question) => question.quizId === id)
    .sort((a, b) => a.order - b.order)
    .map(({ correctOption, quizId, order, ...question }) => question);

  res.json({ ...quiz, questions });
});

router.post("/quizzes/:id/submit", (req, res) => {
  const id = Number(req.params.id);
  const quiz = getQuizById(id);

  if (!quiz) {
    res.status(404).json({ error: "Quiz not found" });
    return;
  }

  const answers = (req.body?.answers ?? {}) as Record<string, number>;
  const questions = quizQuestions.filter((question) => question.quizId === id);
  let correctAnswers = 0;

  const answerResults = questions.map((question) => {
    const selectedOption = answers[String(question.id)];
    const isCorrect = selectedOption === question.correctOption;
    if (isCorrect) correctAnswers += 1;

    return {
      questionId: question.id,
      selectedOption,
      correctOption: question.correctOption,
      isCorrect,
      explanation: question.explanation,
    };
  });

  const score = Math.round((correctAnswers / questions.length) * 100);
  const result = {
    id: nextId(quizResults),
    userId: demoUserId,
    quizId: id,
    score,
    totalQuestions: questions.length,
    correctAnswers,
    passed: score >= quiz.passingScore,
    submittedAt: new Date().toISOString(),
  };

  quizResults = [...quizResults, result];
  user.totalPoints += score;

  res.json({
    score,
    totalQuestions: questions.length,
    correctAnswers,
    passed: result.passed,
    answers: answerResults,
  });
});

router.get("/leaderboard", (_req, res) => {
  const dynamicEntries = leaderboard.map((entry) =>
    entry.userId === demoUserId
      ? { ...entry, totalPoints: user.totalPoints, quizzesCompleted: quizResults.length }
      : entry,
  );
  res.json(dynamicEntries);
});

router.get("/users/profile", (_req, res) => {
  res.json(user);
});

router.put("/users/profile", (req, res) => {
  const { nameBn, nameEn, classLevel, goal, avatarUrl } = req.body ?? {};
  Object.assign(user, {
    nameBn: nameBn ?? user.nameBn,
    nameEn: nameEn ?? user.nameEn,
    classLevel: classLevel ?? user.classLevel,
    goal: goal ?? user.goal,
    avatarUrl: avatarUrl ?? user.avatarUrl,
  });
  res.json(user);
});

router.get("/users/enrollments", (_req, res) => {
  res.json(
    enrollments.map((enrollment) => ({
      ...enrollment,
      course: getCourseById(enrollment.courseId),
    })),
  );
});

router.post("/users/enrollments", (req, res) => {
  const courseId = Number(req.body?.courseId);
  const existing = enrollments.find((item) => item.courseId === courseId);

  if (existing) {
    res.status(201).json(existing);
    return;
  }

  const created = {
    id: nextId(enrollments),
    userId: demoUserId,
    courseId,
    enrolledAt: new Date().toISOString(),
    progressPercent: 0,
    completedLessons: 0,
  };

  enrollments = [...enrollments, created];
  res.status(201).json(created);
});

router.get("/users/progress", (_req, res) => {
  res.json(progressItems);
});

router.post("/users/progress", (req, res) => {
  const { lessonId, courseId, completed, watchedSeconds } = req.body ?? {};
  const existing = progressItems.find((item) => item.lessonId === lessonId && item.userId === demoUserId);
  const completedAt = completed ? new Date().toISOString() : undefined;

  let progress: LessonProgress;
  if (existing) {
    progress = {
      ...existing,
      completed: Boolean(completed),
      watchedSeconds: watchedSeconds ?? existing.watchedSeconds,
      completedAt: completedAt ?? existing.completedAt,
    };
    progressItems = progressItems.map((item) => (item.id === existing.id ? progress : item));
  } else {
    progress = {
      id: nextId(progressItems),
      userId: demoUserId,
      lessonId: Number(lessonId),
      courseId: Number(courseId),
      completed: Boolean(completed),
      watchedSeconds: watchedSeconds ?? 0,
      completedAt,
    };
    progressItems = [...progressItems, progress];
  }

  const courseLessons = lessons.filter((lesson) => lesson.courseId === Number(courseId));
  const completedLessons = progressItems.filter(
    (item) => item.courseId === Number(courseId) && item.completed,
  ).length;
  const progressPercent = courseLessons.length
    ? Math.round((completedLessons / courseLessons.length) * 100)
    : 0;

  enrollments = enrollments.map((item) =>
    item.courseId === Number(courseId)
      ? { ...item, completedLessons, progressPercent }
      : item,
  );

  res.json(progress);
});

router.get("/dashboard/summary", (_req, res) => {
  res.json(buildDashboardSummary());
});

router.get("/dashboard/streak", (_req, res) => {
  res.json({
    currentStreak: 7,
    longestStreak: 10,
    studiedToday: true,
    weeklyActivity: [true, true, true, false, true, true, true],
  });
});

router.get("/live-classes", (_req, res) => {
  res.json(liveClasses);
});

router.get("/live-classes/:id", (req, res) => {
  const id = Number(req.params.id);
  const liveClass = liveClasses.find((item) => item.id === id);

  if (!liveClass) {
    res.status(404).json({ error: "Live class not found" });
    return;
  }

  res.json(liveClass);
});

router.get("/payments", (_req, res) => {
  res.json(
    payments.map((payment) => ({
      ...payment,
      course: getCourseById(payment.courseId),
    })),
  );
});

router.post("/payments", (req, res) => {
  const { courseId, amount, method, transactionId, couponCode } = req.body ?? {};
  const created = {
    id: nextId(payments),
    userId: demoUserId,
    courseId: Number(courseId),
    amount: Number(amount),
    method: method ?? "bkash",
    status: transactionId ? "completed" : "pending",
    transactionId,
    couponCode,
    createdAt: new Date().toISOString(),
  } satisfies Payment;

  payments = [...payments, created];
  res.status(201).json({
    ...created,
    course: getCourseById(created.courseId),
  });
});

export default router;
