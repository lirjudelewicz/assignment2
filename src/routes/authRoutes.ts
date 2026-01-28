import { Router } from "express";
import userController from "../controllers/authController";
const authRouter = Router();

authRouter.post("/register", userController.register.bind(userController));

export default authRouter;