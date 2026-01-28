import { Request, Response } from "express";
import { userModel } from "../models/userModel";

class UserController{

    async getById(req: Request, res: Response) {
        try{
            const { userId } = req.params;
            const user = await userModel.findById(userId);
            if (!user) {
                res.status(404).send("Not Found - User does not exist");
                return;
            }
            res.status(200).json(user);
        }catch(err: any){
            res.status(500).send(err.message);
        }
    }
}
export default new UserController();