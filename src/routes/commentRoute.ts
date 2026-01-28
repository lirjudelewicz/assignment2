import { Router } from "express";
import commentController from "../controllers/commentController";

const commentsRouter = Router();

commentsRouter.post("/", commentController.create.bind(commentController));

export default commentsRouter;