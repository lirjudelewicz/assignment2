import { Router } from "express";
import commentController from "../controllers/commentController";

const commentsRouter = Router();

commentsRouter.post("/", commentController.create.bind(commentController));
commentsRouter.get("/:commentId", commentController.getById.bind(commentController));
commentsRouter.put("/:commentId", commentController.update.bind(commentController));
commentsRouter.delete("/:commentId", commentController.delete.bind(commentController));
commentsRouter.get("/post/:postId", commentController.getCommentsByPostId.bind(commentController));

export default commentsRouter;