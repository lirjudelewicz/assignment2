import jwt from "jsonwebtoken";
import { GeneratedTokens } from "../types/token";
import bcrypt from "bcrypt";


export function generateToken(userId: string): GeneratedTokens {
    const secret = process.env.JWT_SECRET || "default_secret";
    const expiresIn = parseInt(process.env.JWT_EXPIRES_IN || "3600", 10); 
    const token = jwt.sign({ _id: userId }, secret, { expiresIn });
    const refreshExpiresIn = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN || "1440");
    const rand = Math.floor(Math.random() * 1000);
    const refreshToken = jwt.sign(
        { _id: userId, rand: rand },
        secret,
        { expiresIn: refreshExpiresIn }
    );
    return { token, refreshToken };
}


export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}