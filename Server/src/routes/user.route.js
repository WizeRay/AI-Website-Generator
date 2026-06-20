import { Router } from "express";
import requireAuth from "../middlewares/requireAuth.js";
import { getUserCredits } from "../controllers/user.controller.js";
const router = Router();

router.get("/credits", requireAuth, getUserCredits)

export default router;