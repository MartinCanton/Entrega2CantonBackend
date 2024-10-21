import { Router } from 'express';
import SessionsController from '../controllers/sessions.controller.js';
import {authorization, passportCall, isAuthenticated, isNotAuthenticated }  from '../middlewares/auth.js';



const router = Router();

const sessionsController = new SessionsController();

router.post('/register', isNotAuthenticated, sessionsController.register);
router.post('/login', isNotAuthenticated, sessionsController.login);
router.post('/logout', isAuthenticated, sessionsController.logout);
router.get('/current', passportCall('jwt'), sessionsController.getCurrentUser);


export default router;