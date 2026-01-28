import { Router } from "express";
import userController from "../controllers/userController";
const userRouter = Router();

userRouter.post("/", userController.create.bind(userController));

export default userRouter;