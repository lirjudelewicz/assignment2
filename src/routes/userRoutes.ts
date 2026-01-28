import { Router } from "express";
import userController from "../controllers/userController";

const userRouter = Router();

userRouter.post("/:userId", userController.getById.bind(userController));
userRouter.get("/", userController.getAll.bind(userController));
export default userRouter;