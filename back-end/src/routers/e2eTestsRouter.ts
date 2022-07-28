import { Router } from "express";
import e2eTestsController from "../controllers/e2eTestsController.js";

const e2eRouter = Router();

e2eRouter.post("/recommendations/reset", e2eTestsController.deleteAll);

export default e2eRouter;