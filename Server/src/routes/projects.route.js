import express from 'express';
import requireAuth from '../middlewares/requireAuth.js';
import { getAllProjects,createNewProject } from '../controllers/projects.controller.js';

const router = express.Router();

router.get('/',requireAuth,getAllProjects);
router.post('/create',requireAuth,createNewProject);

export default router;