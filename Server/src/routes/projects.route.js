import express from 'express';
import requireAuth from '../middlewares/requireAuth.js';
import { getAllProjects,createNewProject,getProject,toggleProjectPublish } from '../controllers/projects.controller.js';

const router = express.Router();

router.get('/',requireAuth,getAllProjects);
router.post('/create',requireAuth,createNewProject);
router.get('/:projectId',requireAuth,getProject);
//using PATCH here as single field was changed. If entire resource was changed i would have used PUT
router.patch('/:projectId/publish',requireAuth,toggleProjectPublish);

export default router;