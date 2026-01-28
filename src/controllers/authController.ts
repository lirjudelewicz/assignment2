import { Request, Response } from "express";
import { userModel } from "../models/userModel";
import bcrypt from "bcrypt";

class AuthController {  

    async register(req: Request, res: Response) {
        try{
            const { email, password } = req.body;
            if ( !email || !password) {
                res.status(400).send(`Bad Request - email, password are required`);
                return;
            }
            const userExists = await userModel.findOne({ email });
            if (userExists) {
                res.status(409).send("Conflict - Email already exists");
                return;
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const user = await userModel.create({ email, password: hashedPassword });
            res.status(201).json(user);

        }catch(err: any){
            res.status(500).send(err.message);
        }
    }

    async login(req: Request, res: Response) {
        try{
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).send(`Bad Request - email and password are required`);
                return;
            }
            const user = await userModel.findOne({ email });
            if (!user) {
                res.status(404).send("Not Found - User does not exist");
                return;
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(401).send("Unauthorized - Incorrect password");
                return;
            }
            res.status(200).json(user);

        }catch(err: any){
            res.status(500).send(err.message);
        }
    }

}
export default new AuthController();