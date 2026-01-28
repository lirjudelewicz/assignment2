import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouter from "./routes/authRoutes";
import userRouter from "./routes/userRoutes";
import commentsRouter from "./routes/commentRoute";
import postsRouter from "./routes/postRoutes";
dotenv.config({path: "./.env"});

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/comment", commentsRouter);
app.use("/post", postsRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);

const initApp = async () => {
    try{
        const dbUrl = process.env.DATABASE_URL;
        if (!dbUrl) {
            throw new Error("DATABASE_URL is not defined");
        }
        await mongoose.connect(dbUrl, {});
        const db = mongoose.connection;
        db.on("error", (error) => {throw new Error(error)});
        db.once("open", () => console.log("Connected to Database"));
    }catch(err: any){
        console.error(`Error init application: ${err.message}`);
    }
}

initApp().then(() =>{
    app.listen(PORT, (error) =>{
        if(!error)
            console.log("Server is running, listening on port "+ PORT);
        else 
            console.log("Error occurred, server can't start", error);
        }
    );

})
