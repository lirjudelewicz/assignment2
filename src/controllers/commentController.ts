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

    async update(req: Request, res: Response){
        try{
            const commentId = req.params.commentId;
            const updatedData = req.body;
            if(!commentId || !updatedData.postId || !updatedData.senderId || !updatedData.message){
                res.statusCode = 400;
                res.status(400).send(`Rejecting - commentId, postId, senderId, message are required`);
                return;
            }
            const comment = await commentModel.findByIdAndUpdate(commentId, updatedData, {new: true});
            console.log(`Succesfully updated comment id: [${commentId}]`);
            res.json(comment);
        }catch(err: any){
            res.status(500).send(`Error reading comment ended with error: ${err.message}`);
        }
    }

    async delete(req: Request, res: Response){
        try{
            const commentId = req.params.commentId;
            if(!commentId){
                res.statusCode = 400;
                res.status(400).send(`Rejecting - commentId required`);
                return;
            }
            const deletedComment = await commentModel.findByIdAndDelete(commentId);
            console.log(`Succesfully deleted comment id: [${commentId}]`);
            res.json(deletedComment);
        }catch(err: any){
            res.status(500).send(`Error deleting comment ended with error: ${err.message}`);
        }
    }

    async getCommentsByPostId(req: Request, res: Response){
        try{
            const postId = req.params.postId;
            if(!postId){
                res.statusCode = 400;
                res.status(400).send(`Bad Request - postId required`);
                return;
            }
            const comments = await commentModel.find({postId: postId}).sort({ createdAt: -1 });
            res.json(comments);
        }catch(err: any){
            res.status(500).send(`Error deleting comment ended with error: ${err.message}`);
        }
    }


}

export default new CommentController();