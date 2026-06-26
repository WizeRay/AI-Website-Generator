import { Router } from "express";
import requireAuth from "../middlewares/requireAuth.js";
import { deleteProject, getPreviewCode, getPublicProject, getPublishedProjects, makeRevision, rollbackToPrevVersion } from "../controllers/projectCode.route.js";
import { saveProjectCode } from "../controllers/projects.controller.js";

const router = Router();

router.post('/revision/:projectId',requireAuth, makeRevision)
router.put('/save/:pprojectId',requireAuth,saveProjectCode);
router.get('/rollback/:projectId/:versionId',requireAuth,rollbackToPrevVersion);
router.delete('/:projectId',requireAuth,deleteProject);
router.get('/preview/:projectId',requireAuth,getPreviewCode);
router.get('/published', requireAuth, getPublishedProjects);
router.get('/published/:projectId', getProjectById);
export default router;