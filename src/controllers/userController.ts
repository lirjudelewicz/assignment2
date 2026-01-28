import { Request, Response } from "express";
import { userModel } from "../models/userModel";

class UserController {  

    create(req: Request, res: Response) {
        try{
            const { username, email, password } = req.body;
            if (!username || !email || !password) {
                res.status(400).send(`Bad Request - username, email, password are required`);
                return;
            }
            const user = userModel.create({ username, email, password });
            res.status(201).json(user);

        }catch(err: any){
            res.status(500).send(err.message);
        }
    }

}
export default new UserController();