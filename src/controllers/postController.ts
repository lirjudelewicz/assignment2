import { postModel } from "../models/postModel";
import { Request, Response } from "express";

class PostController {
    async create(req: Request, res: Response) {
        try {
            const { userId, title, content } = req.body;
            if (!userId || !title || !content) {
                res.status(400).send(`Bad Request - userId, title, content are required`);
                return;
            }
            const post = await postModel.create({ userId, title, content });
            res.json(post);
        } catch (err) {
            res.status(500).send(err);
        }
    }
}
export default new PostController();