import { NextFunction, Request, Response } from "express";
import passport from "passport";
import jwt from 'jsonwebtoken';
import User from "../models/User";

export async function OAuth(req: Request, res: Response) {
    const user: any = req.user;
    const secretKey = process.env.JWT_SECRET || '12345@ABCDE';
    const token = jwt.sign({ userId: user.id, email: user.email }, secretKey, { expiresIn: '7d' });
    res.clearCookie('token')
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 3600000,
        sameSite: "lax",
        signed: true
    });
    res.redirect('/');
}