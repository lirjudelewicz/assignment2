import { Router } from "express";
import postController from "../controllers/postController";

const postsRouter = Router();

postsRouter.post("/", postController.create.bind(postController));
postsRouter.get("/", postController.getAll.bind(postController));

export default postsRouter;
