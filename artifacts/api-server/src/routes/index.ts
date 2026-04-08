import { Router, type IRouter } from "express";
import healthRouter from "./health";
import coursesRouter from "./courses";
import quizzesRouter from "./quizzes";
import usersRouter from "./users";
import liveRouter from "./live";
import paymentsRouter from "./payments";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(coursesRouter);
router.use(quizzesRouter);
router.use(usersRouter);
router.use(liveRouter);
router.use(paymentsRouter);
router.use(dashboardRouter);

export default router;
