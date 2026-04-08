import { getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const auth = getAuth(req);
  const clerkId = auth?.userId;
  if (!clerkId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  // Get or create user
  let [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId));
  if (!user) {
    const [created] = await db.insert(usersTable).values({
      clerkId,
      nameBn: "নতুন শিক্ষার্থী",
      nameEn: "New Student",
      classLevel: "HSC",
      goal: "HSC 2026",
      totalPoints: 0,
      badges: [],
    }).returning();
    user = created;
  }
  (req as any).dbUserId = user.id;
  (req as any).clerkId = clerkId;
  next();
};
