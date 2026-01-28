import { Router } from "express";
import postController from "../controllers/postController";

const postsRouter = Router();

postsRouter.post("/", postController.create.bind(postController));
postsRouter.get("/", postController.getAll.bind(postController));
postsRouter.get("/:postId", postController.getById.bind(postController));
postsRouter.put("/:postId", postController.replace.bind(postController));
postsRouter.delete("/:postId", postController.delete.bind(postController));


export default postsRouter;
