import { Router, type IRouter } from "express";
import healthRouter from "./health";
import pdfRouter from "./pdf";
import pdfToolsRouter from "./pdf-tools";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(requireAuth, pdfRouter);
router.use(requireAuth, pdfToolsRouter);

export default router;
