import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const quizzesTable = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  titleBn: text("title_bn").notNull(),
  titleEn: text("title_en").notNull(),
  courseId: integer("course_id"),
  totalQuestions: integer("total_questions").notNull().default(10),
  timeLimitMinutes: integer("time_limit_minutes").notNull().default(15),
  passingScore: integer("passing_score").notNull().default(60),
});

export const quizQuestionsTable = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").notNull(),
  questionBn: text("question_bn").notNull(),
  questionEn: text("question_en"),
  options: text("options").array().notNull(),
  correctOption: integer("correct_option").notNull(),
  explanation: text("explanation"),
  order: integer("order").notNull(),
});

export const quizResultsTable = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  quizId: integer("quiz_id").notNull(),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  correctAnswers: integer("correct_answers").notNull(),
  passed: boolean("passed").notNull(),
  timeTaken: integer("time_taken"),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
});

export const leaderboardTable = pgTable("leaderboard", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  userName: text("user_name").notNull(),
  avatarUrl: text("avatar_url"),
  totalPoints: integer("total_points").notNull().default(0),
  quizzesCompleted: integer("quizzes_completed").notNull().default(0),
  streak: integer("streak").notNull().default(0),
});

export const insertQuizSchema = createInsertSchema(quizzesTable).omit({ id: true });
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type Quiz = typeof quizzesTable.$inferSelect;
