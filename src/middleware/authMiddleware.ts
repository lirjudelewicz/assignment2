import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export type AuthRequest = Request & { user?: { _id: string } };

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const {authorization} = req.headers;
    if (!authorization) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authorization.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const secret = process.env.JWT_SECRET || "default_secret";
    try {
        const decoded = jwt.verify(token, secret) as { _id: string };
        req.user = { _id: decoded._id };
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};