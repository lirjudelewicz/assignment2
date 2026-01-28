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

    async getAll(req: Request, res: Response) {
            try {
                if(req.query){
                    const users = await userModel.find(req.query).sort({ createdAt: -1 });
                    res.json(users);
                    return;
                }else{
                    const allUsers = await userModel.find({});
                if(!allUsers){
                    res.status(400).send(`There are no users in the database`);
                    return;
                }
                res.json(allUsers);
                }
            } catch (err) {
                res.status(500).send(err);
            }
        }
}
export default new UserController();