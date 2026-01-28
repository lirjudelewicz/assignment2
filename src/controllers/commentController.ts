import { Request, Response } from "express";
import { commentModel } from "../models/commentModel";

class CommentController {

    async create(req: Request, res: Response) {
        try{
            const {postId, senderId, message} = req.body;
        
            if(!postId || !senderId || !message){
                res.status(400).send(`postId, senderId, message are required`);
                return;
            }
            const newComment = await commentModel.create({
                postId, senderId, message
            });
            console.log(`Succesfully added a new comment id: [${newComment._id}] to post id: [${postId}]`);
            res.json(newComment);
        }catch(err: any){
            res.status(500).send(`Error creating comment ended with error: ${err.message}`);
        }
    }

    async getById(req: Request, res: Response){
        try{
            const commentId = req.params.commentId;
            if(!commentId){
                res.statusCode = 400;
                res.status(400).send(`Bad Request - commentId required`);
                return;
            }
            const comment = await commentModel.findById(commentId);
            console.log(`Succesfully got comment id: [${commentId}]`);
            res.json(comment);
        }catch(err: any){
            res.status(500).send(`Error reading comment ended with error: ${err.message}`);
        }
        
    }
}

export default new CommentController();