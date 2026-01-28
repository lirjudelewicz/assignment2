import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    userId: {
        type: String, 
        required: true,
        index: true
    },
    title: {
        type: String, 
        required: true,
    },
    content: {
        type: String, 
        required: true,
    }
});

export const postModel = mongoose.model("Post", PostSchema);