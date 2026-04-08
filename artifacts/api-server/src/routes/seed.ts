import { db } from "@workspace/db";
import {
  categoriesTable,
  coursesTable,
  modulesTable,
  lessonsTable,
  quizzesTable,
  quizQuestionsTable,
  liveClassesTable,
  leaderboardTable,
  usersTable,
} from "@workspace/db";

export async function seedDatabase() {
  // Categories
  const existingCategories = await db.select().from(categoriesTable);
  if (existingCategories.length === 0) {
    await db.insert(categoriesTable).values([
      { id: "ssc", nameBn: "এসএসসি", nameEn: "SSC", icon: "📚", courseCount: 12 },
      { id: "hsc", nameBn: "এইচএসসি", nameEn: "HSC", icon: "🎓", courseCount: 18 },
      { id: "admission", nameBn: "ভর্তি পরীক্ষা", nameEn: "Admission", icon: "🏛️", courseCount: 8 },
      { id: "skills", nameBn: "দক্ষতা", nameEn: "Skills", icon: "💡", courseCount: 15 },
    ]);
  }

  // Courses
  const existingCourses = await db.select().from(coursesTable);
  if (existingCourses.length === 0) {
    const courses = await db.insert(coursesTable).values([
      {
        titleBn: "HSC পদার্থবিজ্ঞান সম্পূর্ণ কোর্স ২০২৬",
        titleEn: "HSC Physics Complete Course 2026",
        descriptionBn: "HSC ২০২৬ পরীক্ষার জন্য সম্পূর্ণ পদার্থবিজ্ঞান কোর্স। নিউটনের সূত্র থেকে আধুনিক পদার্থবিজ্ঞান পর্যন্ত সব বিষয় বিস্তারিত আলোচনা করা হয়েছে।",
        descriptionEn: "Complete Physics course for HSC 2026. Covers Newton's laws to modern physics.",
        category: "hsc",
        instructor: "ড. মোহাম্মদ রফিকুল ইসলাম",
        thumbnailUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=225&fit=crop",
        price: "1299",
        originalPrice: "1999",
        totalLessons: 48,
        totalDuration: "৩৬ ঘন্টা",
        rating: "4.8",
        enrolledCount: 12450,
        isFeatured: true,
        level: "intermediate",
        tags: ["HSC", "পদার্থবিজ্ঞান", "২০২৬"],
        syllabus: ["নিউটনের সূত্রসমূহ", "তরঙ্গ ও শব্দ", "তাপগতিবিদ্যা", "আলোকবিজ্ঞান", "বিদ্যুৎ চৌম্বকত্ব"],
        requirements: ["SSC পদার্থবিজ্ঞান বেসিক জ্ঞান"],
      },
      {
        titleBn: "HSC গণিত ক্র্যাশ কোর্স ২০২৬",
        titleEn: "HSC Mathematics Crash Course 2026",
        descriptionBn: "HSC গণিতের সবচেয়ে কঠিন অধ্যায়গুলো সহজে বোঝার জন্য বিশেষ ক্র্যাশ কোর্স।",
        descriptionEn: "Special crash course to easily understand the most difficult chapters of HSC Mathematics.",
        category: "hsc",
        instructor: "মোঃ আবু তাহের",
        thumbnailUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=225&fit=crop",
        price: "999",
        originalPrice: "1499",
        totalLessons: 36,
        totalDuration: "২৮ ঘন্টা",
        rating: "4.9",
        enrolledCount: 18920,
        isFeatured: true,
        level: "intermediate",
        tags: ["HSC", "গণিত", "ক্র্যাশ কোর্স"],
        syllabus: ["বিন্যাস ও সমাবেশ", "সংযোজন ও বিভাজন", "ক্যালকুলাস", "জটিল সংখ্যা"],
        requirements: ["SSC গণিত জ্ঞান আবশ্যক"],
      },
      {
        titleBn: "SSC বাংলা সাহিত্য ও ব্যাকরণ",
        titleEn: "SSC Bangla Literature & Grammar",
        descriptionBn: "SSC পরীক্ষার জন্য বাংলা সাহিত্য ও ব্যাকরণের সম্পূর্ণ প্রস্তুতি।",
        descriptionEn: "Complete preparation of Bangla Literature and Grammar for SSC examination.",
        category: "ssc",
        instructor: "নাজনীন সুলতানা",
        thumbnailUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=225&fit=crop",
        price: "799",
        originalPrice: "1199",
        totalLessons: 30,
        totalDuration: "২২ ঘন্টা",
        rating: "4.7",
        enrolledCount: 9830,
        isFeatured: false,
        level: "beginner",
        tags: ["SSC", "বাংলা", "সাহিত্য", "ব্যাকরণ"],
        syllabus: ["গদ্য সাহিত্য", "পদ্য সাহিত্য", "ব্যাকরণ মূলসূত্র", "রচনা লেখার নিয়ম"],
        requirements: [],
      },
      {
        titleBn: "বুয়েট ভর্তি পরীক্ষা প্রস্তুতি",
        titleEn: "BUET Admission Preparation",
        descriptionBn: "বুয়েট ভর্তি পরীক্ষার জন্য বিশেষ প্রস্তুতি কোর্স - গণিত, পদার্থবিজ্ঞান, রসায়ন।",
        descriptionEn: "Special preparation course for BUET admission - Math, Physics, Chemistry.",
        category: "admission",
        instructor: "প্রফেসর সাইফুল ইসলাম",
        thumbnailUrl: "https://images.unsplash.com/photo-1562813733-b31f71025d54?w=400&h=225&fit=crop",
        price: "1499",
        originalPrice: "2499",
        totalLessons: 60,
        totalDuration: "৪৫ ঘন্টা",
        rating: "4.9",
        enrolledCount: 6750,
        isFeatured: true,
        level: "advanced",
        tags: ["BUET", "ভর্তি", "প্রকৌশল"],
        syllabus: ["উচ্চতর গণিত", "পদার্থবিজ্ঞান", "রসায়ন", "মডেল টেস্ট"],
        requirements: ["HSC পরীক্ষার্থী"],
      },
      {
        titleBn: "ওয়েব ডেভেলপমেন্ট বাংলা কোর্স",
        titleEn: "Web Development Bangla Course",
        descriptionBn: "বাংলায় HTML, CSS, JavaScript, React শিখুন এবং প্রফেশনাল ওয়েব ডেভেলপার হোন।",
        descriptionEn: "Learn HTML, CSS, JavaScript, React in Bangla and become a professional web developer.",
        category: "skills",
        instructor: "সাকিব হাসান",
        thumbnailUrl: "https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=400&h=225&fit=crop",
        price: "1299",
        originalPrice: "1999",
        totalLessons: 55,
        totalDuration: "৪০ ঘন্টা",
        rating: "4.8",
        enrolledCount: 15400,
        isFeatured: true,
        level: "beginner",
        tags: ["ওয়েব", "প্রোগ্রামিং", "React", "বাংলা"],
        syllabus: ["HTML ও CSS মূলসূত্র", "JavaScript প্রোগ্রামিং", "React.js", "প্রজেক্ট তৈরি"],
        requirements: ["কম্পিউটার বেসিক জ্ঞান"],
      },
    ]).returning();

    // Modules for first course (HSC Physics)
    const physicsModules = await db.insert(modulesTable).values([
      { courseId: courses[0].id, titleBn: "অধ্যায় ১: ভেক্টর ও স্কেলার", titleEn: "Chapter 1: Vector & Scalar", order: 1 },
      { courseId: courses[0].id, titleBn: "অধ্যায় ২: নিউটনের সূত্রসমূহ", titleEn: "Chapter 2: Newton's Laws", order: 2 },
      { courseId: courses[0].id, titleBn: "অধ্যায় ৩: কাজ, শক্তি ও ক্ষমতা", titleEn: "Chapter 3: Work, Energy & Power", order: 3 },
    ]).returning();

    // Lessons for physics
    await db.insert(lessonsTable).values([
      { courseId: courses[0].id, moduleId: physicsModules[0].id, titleBn: "ভেক্টর পরিচিতি", titleEn: "Introduction to Vectors", type: "video", duration: "৩৫ মিনিট", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 1, isFree: true },
      { courseId: courses[0].id, moduleId: physicsModules[0].id, titleBn: "স্কেলার রাশি", titleEn: "Scalar Quantities", type: "video", duration: "২৮ মিনিট", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 2, isFree: false },
      { courseId: courses[0].id, moduleId: physicsModules[1].id, titleBn: "নিউটনের প্রথম সূত্র", titleEn: "Newton's First Law", type: "video", duration: "৪২ মিনিট", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 3, isFree: true },
      { courseId: courses[0].id, moduleId: physicsModules[1].id, titleBn: "নিউটনের দ্বিতীয় সূত্র", titleEn: "Newton's Second Law", type: "video", duration: "৫০ মিনিট", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 4, isFree: false },
      { courseId: courses[0].id, moduleId: physicsModules[2].id, titleBn: "কাজের সংজ্ঞা ও সূত্র", titleEn: "Definition of Work", type: "video", duration: "৩৮ মিনিট", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 5, isFree: false },
      { courseId: courses[0].id, moduleId: physicsModules[2].id, titleBn: "অধ্যায় কুইজ", titleEn: "Chapter Quiz", type: "quiz", duration: "১৫ মিনিট", order: 6, isFree: false },
    ]);

    // Modules for math course
    const mathModules = await db.insert(modulesTable).values([
      { courseId: courses[1].id, titleBn: "অধ্যায় ১: বিন্যাস ও সমাবেশ", titleEn: "Chapter 1: Permutation & Combination", order: 1 },
      { courseId: courses[1].id, titleBn: "অধ্যায় ২: ক্যালকুলাস", titleEn: "Chapter 2: Calculus", order: 2 },
    ]).returning();

    await db.insert(lessonsTable).values([
      { courseId: courses[1].id, moduleId: mathModules[0].id, titleBn: "বিন্যাস পরিচিতি", titleEn: "Introduction to Permutation", type: "video", duration: "৩০ মিনিট", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 1, isFree: true },
      { courseId: courses[1].id, moduleId: mathModules[1].id, titleBn: "অবকলন বিদ্যা", titleEn: "Differentiation", type: "video", duration: "৪৫ মিনিট", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", order: 2, isFree: true },
    ]);
  }

  // Quizzes
  const existingQuizzes = await db.select().from(quizzesTable);
  if (existingQuizzes.length === 0) {
    const quizzes = await db.insert(quizzesTable).values([
      { titleBn: "পদার্থবিজ্ঞান মডেল টেস্ট - ১", titleEn: "Physics Model Test 1", courseId: 1, totalQuestions: 5, timeLimitMinutes: 10, passingScore: 60 },
      { titleBn: "গণিত মডেল টেস্ট - ১", titleEn: "Math Model Test 1", courseId: 2, totalQuestions: 5, timeLimitMinutes: 15, passingScore: 60 },
      { titleBn: "সাধারণ জ্ঞান কুইজ", titleEn: "General Knowledge Quiz", totalQuestions: 5, timeLimitMinutes: 10, passingScore: 50 },
    ]).returning();

    await db.insert(quizQuestionsTable).values([
      {
        quizId: quizzes[0].id,
        questionBn: "নিউটনের প্রথম সূত্র কোনটি?",
        questionEn: "Which is Newton's First Law?",
        options: ["বল না লাগলে বস্তু স্থির বা সমবেগে চলতে থাকে", "F = ma", "প্রতিটি ক্রিয়ার সমান ও বিপরীত প্রতিক্রিয়া আছে", "কোনোটিই নয়"],
        correctOption: 0,
        explanation: "নিউটনের প্রথম সূত্র বলে - কোনো বস্তুর উপর বাহ্যিক বল প্রযুক্ত না হলে বস্তু স্থির থাকলে স্থিরই থাকবে, আর গতিশীল থাকলে সমবেগে চলতে থাকবে।",
        order: 1,
      },
      {
        quizId: quizzes[0].id,
        questionBn: "ভরবেগের একক কী?",
        questionEn: "What is the unit of momentum?",
        options: ["kg", "m/s", "kg⋅m/s", "Newton"],
        correctOption: 2,
        explanation: "ভরবেগ = ভর × বেগ, সুতরাং একক = kg × m/s = kg⋅m/s",
        order: 2,
      },
      {
        quizId: quizzes[0].id,
        questionBn: "শক্তির SI একক কী?",
        questionEn: "What is the SI unit of energy?",
        options: ["Watt", "Joule", "Newton", "Pascal"],
        correctOption: 1,
        explanation: "শক্তির SI একক জুল (Joule)। এটি James Prescott Joule-এর নামে নামকরণ করা হয়েছে।",
        order: 3,
      },
      {
        quizId: quizzes[0].id,
        questionBn: "আলোর বেগ কত?",
        questionEn: "What is the speed of light?",
        options: ["3 × 10⁶ m/s", "3 × 10⁸ m/s", "3 × 10¹⁰ m/s", "3 × 10⁴ m/s"],
        correctOption: 1,
        explanation: "শূন্য মাধ্যমে আলোর বেগ প্রায় 3 × 10⁸ মিটার/সেকেন্ড।",
        order: 4,
      },
      {
        quizId: quizzes[0].id,
        questionBn: "অভিকর্ষজ ত্বরণ g-এর মান কত?",
        questionEn: "What is the value of gravitational acceleration g?",
        options: ["9.8 m/s²", "10 m/s²", "8.9 m/s²", "9.0 m/s²"],
        correctOption: 0,
        explanation: "পৃথিবীর পৃষ্ঠে অভিকর্ষজ ত্বরণ g ≈ 9.8 m/s² (প্রায় ১০ m/s² ধরা হয়)।",
        order: 5,
      },
      {
        quizId: quizzes[1].id,
        questionBn: "৫ জন থেকে ৩ জনকে কতভাবে বেছে নেওয়া যায়?",
        questionEn: "In how many ways can 3 people be chosen from 5?",
        options: ["10", "15", "20", "60"],
        correctOption: 0,
        explanation: "C(5,3) = 5!/(3!×2!) = (5×4)/(2×1) = 10",
        order: 1,
      },
      {
        quizId: quizzes[1].id,
        questionBn: "d/dx(x²) = ?",
        questionEn: "d/dx(x²) = ?",
        options: ["x", "2x", "x²", "2x²"],
        correctOption: 1,
        explanation: "Power rule: d/dx(xⁿ) = nxⁿ⁻¹, সুতরাং d/dx(x²) = 2x",
        order: 2,
      },
      {
        quizId: quizzes[1].id,
        questionBn: "sin(90°) এর মান কত?",
        questionEn: "What is the value of sin(90°)?",
        options: ["0", "1/2", "√3/2", "1"],
        correctOption: 3,
        explanation: "sin(90°) = 1",
        order: 3,
      },
      {
        quizId: quizzes[1].id,
        questionBn: "১ থেকে ১০০ পর্যন্ত সংখ্যার যোগফল কত?",
        questionEn: "What is the sum of numbers from 1 to 100?",
        options: ["4000", "5000", "5050", "5100"],
        correctOption: 2,
        explanation: "n(n+1)/2 = 100×101/2 = 5050",
        order: 4,
      },
      {
        quizId: quizzes[1].id,
        questionBn: "√144 = ?",
        questionEn: "√144 = ?",
        options: ["11", "12", "13", "14"],
        correctOption: 1,
        explanation: "12 × 12 = 144, সুতরাং √144 = 12",
        order: 5,
      },
    ]);
  }

  // Live Classes
  const existingLive = await db.select().from(liveClassesTable);
  if (existingLive.length === 0) {
    const now = new Date();
    await db.insert(liveClassesTable).values([
      {
        titleBn: "HSC পদার্থবিজ্ঞান - তড়িৎ চুম্বকত্ব লাইভ ক্লাস",
        titleEn: "HSC Physics - Electromagnetism Live Class",
        instructor: "ড. মোহাম্মদ রফিকুল ইসলাম",
        instructorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
        subject: "পদার্থবিজ্ঞান",
        scheduledAt: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
        durationMinutes: 90,
        joinUrl: "https://zoom.us/j/example",
        isLive: false,
        enrolledCount: 342,
        courseId: 1,
      },
      {
        titleBn: "HSC গণিত - ক্যালকুলাস বিশেষ ক্লাস",
        titleEn: "HSC Math - Special Calculus Class",
        instructor: "মোঃ আবু তাহের",
        instructorAvatar: "https://randomuser.me/api/portraits/men/45.jpg",
        subject: "উচ্চতর গণিত",
        scheduledAt: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
        durationMinutes: 60,
        joinUrl: "https://meet.google.com/example",
        isLive: false,
        enrolledCount: 528,
        courseId: 2,
      },
      {
        titleBn: "বুয়েট ভর্তি পরীক্ষা - প্র্যাকটিস সেশন",
        titleEn: "BUET Admission - Practice Session",
        instructor: "প্রফেসর সাইফুল ইসলাম",
        instructorAvatar: "https://randomuser.me/api/portraits/men/67.jpg",
        subject: "রসায়ন",
        scheduledAt: new Date(now.getTime() + 48 * 60 * 60 * 1000), // 2 days from now
        durationMinutes: 120,
        joinUrl: "https://zoom.us/j/example2",
        isLive: false,
        enrolledCount: 215,
        courseId: 4,
      },
      {
        titleBn: "সরাসরি লাইভ: SSC বাংলা প্রশ্নোত্তর পর্ব",
        titleEn: "LIVE NOW: SSC Bangla Q&A Session",
        instructor: "নাজনীন সুলতানা",
        instructorAvatar: "https://randomuser.me/api/portraits/women/28.jpg",
        subject: "বাংলা সাহিত্য",
        scheduledAt: new Date(now.getTime() - 15 * 60 * 1000), // 15 mins ago (LIVE)
        durationMinutes: 60,
        joinUrl: "https://zoom.us/j/live-now",
        isLive: true,
        enrolledCount: 892,
        courseId: 3,
      },
    ]);
  }

  // Leaderboard
  const existingLeaderboard = await db.select().from(leaderboardTable);
  if (existingLeaderboard.length === 0) {
    await db.insert(leaderboardTable).values([
      { userId: 2, userName: "তানভীর আহমেদ", totalPoints: 4850, quizzesCompleted: 42, streak: 21 },
      { userId: 3, userName: "ফারহান আলম", totalPoints: 4200, quizzesCompleted: 38, streak: 15 },
      { userId: 4, userName: "সাদিয়া ইসলাম", totalPoints: 3900, quizzesCompleted: 35, streak: 18 },
      { userId: 5, userName: "রাহেলা আক্তার", totalPoints: 3650, quizzesCompleted: 31, streak: 12 },
      { userId: 6, userName: "মাহমুদুল হক", totalPoints: 3200, quizzesCompleted: 28, streak: 9 },
      { userId: 7, userName: "সুমাইয়া খানম", totalPoints: 2950, quizzesCompleted: 25, streak: 14 },
      { userId: 8, userName: "ইমরান হোসেন", totalPoints: 2700, quizzesCompleted: 22, streak: 7 },
      { userId: 9, userName: "মেহজাবিন রহমান", totalPoints: 2400, quizzesCompleted: 19, streak: 11 },
      { userId: 10, userName: "আরিফুল ইসলাম", totalPoints: 2100, quizzesCompleted: 16, streak: 5 },
    ]);
  }

  // Default user with enrollments
  const existingUser = await db.select().from(usersTable);
  if (existingUser.length === 0) {
    await db.insert(usersTable).values({
      nameBn: "রাহেলা আক্তার",
      nameEn: "Rahela Akter",
      phone: "01712345678",
      email: "rahela@example.com",
      classLevel: "HSC",
      goal: "HSC 2026",
      totalPoints: 1250,
      badges: ["প্রথম কোর্স", "সাত দিনের স্ট্রিক", "কুইজ মাস্টার"],
    });
  }
}
