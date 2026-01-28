import { Router } from "express";
import postController from "../controllers/postController";
import { authenticate } from "../middleware/authMiddleware";

const postsRouter = Router();

postsRouter.post("/", authenticate, postController.create.bind(postController));
postsRouter.get("/", postController.getAll.bind(postController));
postsRouter.get("/:postId", postController.getById.bind(postController));
postsRouter.put("/:postId", authenticate, postController.replace.bind(postController));
postsRouter.delete("/:postId", authenticate, postController.delete.bind(postController));


export default postsRouter;
