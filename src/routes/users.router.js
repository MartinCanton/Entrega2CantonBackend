import { Router } from 'express';
import UsersController from '../controllers/users.controller.js';

const router = Router();

const usersController = new UsersController();

router.get("/", usersController.getAllUsers);
router.get("/:uid", usersController.getUserById);
router.put("/:uid", usersController.updateUserById);
router.delete("/:uid", usersController.deleteUserById);

export default router;