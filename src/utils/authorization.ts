import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const token = req.signedCookies['token'];
    if (token == null) {
        return res.status(401).json({ message: "No token" });
    }

    jwt.verify(token, process.env.JWT_SECRET!, (err: any, decoded: any) => {
        if (err) {
            return res.status(400).json({ message: "Invalid token" });
        }
        req.user = decoded;
        next();
    });
};
