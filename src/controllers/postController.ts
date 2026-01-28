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

    async getAll(req: Request, res: Response)  {
        try {
            if(req.query){
                const posts = await postModel.find(req.query).sort({ createdAt: -1 });
                res.json(posts);
                return;
            }else{
                const allPosts = await postModel.find({});
            if(!allPosts){
                res.status(400).send(`There are no posts in the database`);
                return;
            }
            res.json(allPosts);
            }
        } catch (err) {
            res.status(500).send(err);
        }
    }

    async getById(req: Request, res: Response){
        try {
            const postId = req.params.postId;
            if(!postId){
                res.status(404).json(`Bad Request - postId is required`);
                return;
            }
            const post = await postModel.findById(postId);
            if (!post) {
                res.status(404).send(`Post not found`);
                return;
            }
            res.json(post);
        } catch (err: any) {
            res.status(500).send(err.message);
        }
    }

    async replace(req: Request, res: Response){
        try {
            const { userId, title, content } = req.body;
            const postId = req.params.postId;
            if (!postId ||!userId || !title || !content) {
            res.status(400).send(`postId userId, title, content are required (full replace)`);
            return;
            }
            const post = await postModel.findByIdAndUpdate(postId, { userId, title, content }, { new: true });
            if (!post) {
                res.status(404).send(`Post not found`);
                return;
            }
            res.json(post);
        } catch (err: any) {
            res.status(500).send(err.message);
        }
    }

    async delete(req: Request, res: Response){
        try {
            const postId = req.params.postId;
            if (!postId) {
                res.status(400).send(`Bad Request - postId is required`);
                return;
            }

            const post = await postModel.findByIdAndDelete(postId);
            
            if (!post) {
                res.status(404).send(`Post not found`);
                return;
            }
                res.json(post);
        } catch (err: any) {
            res.status(500).send(err.message);
        }
    }
}
export default new PostController();