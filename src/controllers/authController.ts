import { Request, Response } from "express";
import { userModel } from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateToken, hashPassword } from "../utils/authUtils";

class AuthController {  

    async register(req: Request, res: Response) {
        try{
            const { username, email, password } = req.body;
            if ( !email || !password) {
                res.status(400).send(`Bad Request - username, email, password are required`);
                return;
            }
            const userExists = await userModel.findOne({ $or: [ { username }, { email } ] });
            if (userExists) {
                res.status(409).send("Conflict - Username or Email already exists");
                return;
            }
            const hashedPassword = await hashPassword(password);
            const user = await userModel.create({ username, email, password: hashedPassword });
            const tokens = generateToken(user._id.toString());
            user.refreshTokens.push(tokens.refreshToken);
            await user.save();
            res.status(201).json(user);

        }catch(err: any){
            res.status(500).send(err.message);
        }
    }

    async login(req: Request, res: Response) {
        try{
            const { username, email, password } = req.body;
            if (!email && !username || !password) {
                res.status(400).send(`Bad Request - email and password are required`);
                return;
            }
            const user = await userModel.findOne({ $or: [ { username }, { email } ] });
            if (!user) {
                res.status(404).send("Not Found - User does not exist");
                return;
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(401).send("Unauthorized - Incorrect password");
                return;
            }

            const tokens = generateToken(user._id.toString());
            user.refreshTokens.push(tokens.refreshToken);
            await user.save();
            res.status(200).json(user);

        }catch(err: any){
            res.status(500).send(err.message);
        }
    }

    async refreshToken(req: Request, res: Response){
        try {
            const refreshToken = req.body.refreshToken;
            if (!refreshToken) {
                return res.status(400).send("Refresh token is required");
            }
            const secret = process.env.JWT_SECRET || "default_secret";
            const decoded = jwt.verify(refreshToken, secret) as { _id: string };
            const user = await userModel.findById(decoded._id);
            if (!user) {
                return res.status(401).send("Invalid refresh token");
            }
            if (!user.refreshTokens.includes(refreshToken)) {
                user.refreshTokens = [];
                await user.save();
                console.log(" **** Possible token theft for user:", user._id);
                return res.status(401).send("Invalid refresh token");
            }
            const tokens = generateToken(decoded._id);
            //remove old token from user refreshTokens and add the new one
            user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
            user.refreshTokens.push(tokens.refreshToken);
            await user.save();
            res.status(200).json(tokens);
        } catch (err) {
            return res.status(401).send("Invalid refresh token");
        }

    }
    async logout(req: Request, res: Response) {
        try {
            const {authorization} = req.headers;
            if (!authorization) {
                return res.status(400).send("Refresh token is required");
            }
            const refreshToken = authorization.split(" ")[1];
            if (!refreshToken) {
                return res.status(400).send("Refresh token is required");
            }
            const secret = process.env.JWT_SECRET || "default_secret";
            const decoded = jwt.verify(refreshToken, secret) as { _id: string };
            const user = await userModel.findById(decoded._id);
            if (!user) {
                return res.status(401).send("Invalid refresh token");
            }
            if (!user.refreshTokens.includes(refreshToken)) {
                user.refreshTokens = [];
                await user.save();
                console.log(" **** Possible token theft for user:", user._id);
                return res.status(401).send("Invalid refresh token");
            }
            user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
            await user.save();
            res.status(200).json({ message: "Logged out successfully" });
        } catch (err) {
            return res.status(401).send("Invalid refresh token");
        }
    }

}
export default new AuthController();