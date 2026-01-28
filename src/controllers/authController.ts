import { Request, Response } from "express";
import { userModel } from "../models/userModel";
import bcrypt from "bcrypt";

class AuthController {  

    async register(req: Request, res: Response) {
        try{
            const { username, email, password } = req.body;
            if (!username || !email || !password) {
                res.status(400).send(`Bad Request - username, email, password are required`);
                return;
            }
            const userExists = await userModel.findOne({ $or: [ { username }, { email } ] });
            if (userExists) {
                res.status(409).send("Conflict - Username or Email already exists");
                return;
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const user = await userModel.create({ username, email, password: hashedPassword });
            res.status(201).json(user);

        }catch(err: any){
            res.status(500).send(err.message);
        }
    }

}
export default new AuthController();