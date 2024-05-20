import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import "reflect-metadata";
import cookieParser from 'cookie-parser';
import AppDataSource from './config/dataSource.js';  // Use .js extension for ESModules
import userRoutes from './routes/UserRoutes.js';
import session from 'express-session';
import passport from 'passport';
import './config/OAuth.js';
dotenv.config();
const app: Express = express();
const PORT = process.env.PORT || 5000;
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json()); //tells we are going to use json
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", userRoutes);
app.get("/", (req: Request, res: Response) => res.send("HI"));


AppDataSource.initialize().then(() => {
    console.log("Data source has been Initialized");

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch(error => {
    console.error("Database connection failed:", error);
    process.exit(1);
});
