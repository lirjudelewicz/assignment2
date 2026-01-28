import { Router } from "express";
import authController from "../controllers/authController";
const authRouter = Router();

authRouter.post("/register", authController.register.bind(authController));
authRouter.post("/login", authController.login.bind(authController));
export default authRouter;