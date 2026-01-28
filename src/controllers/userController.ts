import { Request, Response } from "express";
import { userModel } from "../models/userModel";
import { AuthRequest } from "../middleware/authMiddleware";

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

    async update(req: AuthRequest, res: Response) {
        try {
            const { username, email, password } = req.body;
            const userId = req.params.userId;
            if (!userId || !username || !email || !password) {
                res.status(400).send(`userId, username, email or password are required (full replace)`);
                return;
            }
            const user = await userModel.findById(userId);
            if (!user) {
                res.status(404).send(`User not found`);
                return;
            }
            if(req.user && req.user._id !== userId){
                res.statusCode = 403;
                res.status(403).send(`Forbidden - You can update only your own user data`);
                return;
            }
            const userExists = await userModel.findOne({ $or: [ { username }, { email } ] });
            if (userExists) {
                res.status(409).send(`Username or email already in use`);
                return;
            }

            const updatedUser = await userModel.findByIdAndUpdate(userId, { userId, username, email, password }, { new: true });
            if (!user) {
                res.status(404).send(`User not found`);
                return;
            }
            res.json(updatedUser);
        } catch (err: any) {
            res.status(500).send(err.message);
        }
    }

    async delete(req: AuthRequest, res: Response) {
        try {
            const { userId } = req.params;
            const user = await userModel.findById(userId);
            if (!user) {
                res.status(404).send("Not Found - User does not exist");
                return;
            }
            if(req.user && req.user._id !== userId){
                res.statusCode = 403;
                res.status(403).send(`Forbidden - You can delete only your own user`);
                return;
            }
            const deletedUser = await userModel.findByIdAndDelete(userId);
            if (!deletedUser) {
                res.status(404).send("Not Found - User does not exist");
                return;
            }
            res.status(200).send(`User with id ${userId} deleted successfully: ${JSON.stringify(deletedUser)}`);
        } catch (err: any) {
            res.status(500).send(err.message);
        }
    }
}
export default new UserController();