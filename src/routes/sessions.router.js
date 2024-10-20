import { Router } from "express";
import { authorization, passportCall } from "../middlewares/auth.js";
import SessionsController from "../controllers/sessions.controller.js";

const router = Router();
const sessionsController = new SessionsController();
//Registro
router.post('/register', sessionsController.register);
//Login
router.post("/login", sessionsController.login);
//Logout
router.post('/logout', sessionsController.logout);
//Current
router.get('/current', passportCall('jwt'), authorization('user'), sessionsController.getCurrentUser);

export default router;