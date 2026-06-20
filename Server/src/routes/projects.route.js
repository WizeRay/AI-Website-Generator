import express from 'express';
import requireAuth from '../middlewares/requireAuth.js';
import { getProjects } from '../controllers/projects.controller.js';

const router = express.Router();

router.get('/',requireAuth,getProjects);

export default router;