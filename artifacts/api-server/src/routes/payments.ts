import { Router } from "express";
import { db } from "@workspace/db";
import { paymentsTable, coursesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const DEFAULT_USER_ID = 1;

router.get("/payments", async (req, res) => {
  const payments = await db
    .select()
    .from(paymentsTable)
    .where(eq(paymentsTable.userId, DEFAULT_USER_ID));

  const result = await Promise.all(
    payments.map(async (p) => {
      const [course] = await db
        .select()
        .from(coursesTable)
        .where(eq(coursesTable.id, p.courseId));
      return {
        ...p,
        amount: Number(p.amount),
        createdAt: p.createdAt.toISOString(),
        course: course
          ? {
              ...course,
              price: Number(course.price),
              originalPrice: course.originalPrice
                ? Number(course.originalPrice)
                : undefined,
              rating: Number(course.rating),
            }
          : undefined,
      };
    })
  );

  res.json(result);
});

router.post("/payments", async (req, res) => {
  const { courseId, amount, method, transactionId, couponCode } = req.body;

  const [payment] = await db
    .insert(paymentsTable)
    .values({
      userId: DEFAULT_USER_ID,
      courseId,
      amount: String(amount),
      method,
      status: transactionId ? "completed" : "pending",
      transactionId,
      couponCode,
    })
    .returning();

  const [course] = await db
    .select()
    .from(coursesTable)
    .where(eq(coursesTable.id, courseId));

  res.status(201).json({
    ...payment,
    amount: Number(payment.amount),
    createdAt: payment.createdAt.toISOString(),
    course: course
      ? {
          ...course,
          price: Number(course.price),
          originalPrice: course.originalPrice
            ? Number(course.originalPrice)
            : undefined,
          rating: Number(course.rating),
        }
      : undefined,
  });
});

export default router;
