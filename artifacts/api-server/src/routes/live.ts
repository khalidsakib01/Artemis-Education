import { Router } from "express";
import { db } from "@workspace/db";
import { liveClassesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/live-classes", async (req, res) => {
  const classes = await db.select().from(liveClassesTable);
  res.json(
    classes.map((c) => ({
      ...c,
      scheduledAt: c.scheduledAt.toISOString(),
    }))
  );
});

router.get("/live-classes/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [liveClass] = await db
    .select()
    .from(liveClassesTable)
    .where(eq(liveClassesTable.id, id));

  if (!liveClass) {
    res.status(404).json({ error: "Live class not found" });
    return;
  }

  res.json({
    ...liveClass,
    scheduledAt: liveClass.scheduledAt.toISOString(),
  });
});

export default router;
