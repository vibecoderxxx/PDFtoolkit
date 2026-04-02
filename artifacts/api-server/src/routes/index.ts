import { Router, type IRouter } from "express";
import healthRouter from "./health";
import pdfRouter from "./pdf";
import pdfToolsRouter from "./pdf-tools";

const router: IRouter = Router();

router.use(healthRouter);
router.use(pdfRouter);
router.use(pdfToolsRouter);

export default router;
