import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export type AuthRequest = Request & { user?: { _id: string } };

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).json({ message: "Unauthorized" });
    }
     if (!authorization.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized - Invalid token format" });
    }
    
    const token = authorization.slice(7); // Remove "Bearer " prefix (7 characters)
    
    if (!token) {
        return res.status(401).json({ message: "Unauthorized - Empty token" });
    }
    
    const secret = process.env.JWT_SECRET || "default_secret";
    
    try {
        const decoded = jwt.verify(token, secret) as { _id: string };
        
        if (!decoded._id) {
            return res.status(401).json({ message: "Unauthorized - Invalid token payload" });
        }
        
        req.user = { _id: decoded._id };
        next();
    } catch (err: any) {
        console.error("Token verification failed:", err.message);
        return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
};