import { Request, Response } from "express";
import AppDataSource from "../config/dataSource.js";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default class UserController {

    static async register(req: Request, res: Response) {
        const userRepository = AppDataSource.getRepository(User);
        try {
            const { name, email, password } = req.body;
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            const user = userRepository.create({ name, email, password: hash });
            await userRepository.save(user);
            const newUser = {
                id: user.id,
                name: user.name,
                email: user.email
            }
            return res.status(201).json({ message: "User created", user: newUser })

        } catch (error: any) {
            if (error instanceof Error)
                return res.status(500).json({ message: "Failed to register " + error.message });
            else return res.status(500).json({ message: "Unexpected Error " + error.message })
        }
    }

    static async login(req: Request, res: Response) {
        const userRepository = AppDataSource.getRepository(User);
        try {
            const { email, password } = req.body;
            const user = await userRepository.findOneBy({ email });
            if (!user)
                return res.status(401).json({ message: "Invalid Email" });
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                return res.status(401).json({ message: "Invalid Password" });
            // Create a response object that omits the password
            const userResponse = {
                id: user.id,
                name: user.name,
                email: user.email
            };

            // TODO: Implement token generation (e.g., JWT) for authentication;
            const secretKey = process.env.SECRET_KEY || '12345#ABCDE';
            const token = jwt.sign({ userId: user.id, email: user.email }, secretKey, { expiresIn: '7d' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 3600000,
                sameSite: "lax"
            });
            return res.status(200).json({ message: "Login successful", user: userResponse, token });
        } catch (e: unknown) {
            if (e instanceof Error) {
                return res.status(500).json({ message: "Failed to login: " + e.message });
            } else {
                return res.status(500).json({ message: "An unexpected error occurred during login" });
            }
        }
    }
}