import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouter from "./routes/authRoutes";
import userRouter from "./routes/userRoutes";
import commentsRouter from "./routes/commentRoute";
import postsRouter from "./routes/postRoutes";
import { swaggerSpec, swaggerUi } from "./swagger";
dotenv.config({path: "./.env"});

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes setup
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
    const server = app.listen(PORT, () =>{
        console.log("Server is running, listening on port "+ PORT);
    });
    server.on("error", (error: any) => {
        console.log("Error occurred, server can't start", error);
    });
})
