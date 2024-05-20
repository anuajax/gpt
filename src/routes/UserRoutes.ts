import { Router, Request, Response } from "express";
import UserController from '../controllers/UserController.js';
import passport from "passport";
import '../config/OAuth.js'
import { OAuth } from "../controllers/oAuthController.js";
const router = Router();
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req: Request, res: Response) => {
//     res.redirect('/');
// });
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), OAuth);

export default router;