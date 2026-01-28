import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        trim: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        index: true
    },
    message: {
        type: String, 
        required: true,
    }
});

export const commentModel = mongoose.model("Comment", CommentSchema);