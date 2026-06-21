import { Router } from "express";
import requireAuth from "../middlewares/requireAuth.js";
import { pool } from "../config/db.js";

const router = Router();

export default router;