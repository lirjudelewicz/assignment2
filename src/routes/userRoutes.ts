import { Router } from "express";
import userController from "../controllers/userController";

const userRouter = Router();

userRouter.post("/:userId", userController.getById.bind(userController));

export default userRouter;