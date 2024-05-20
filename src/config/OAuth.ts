import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import AppDataSource from './dataSource.js';
import User from "../models/User.js";
import dotenv from 'dotenv';
import { AuthMethod } from '../models/AuthMethod.js';

dotenv.config();

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id } });
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: 'http://localhost:5000/auth/google/callback',
        },
        async (token, tokenSecret, profile, done) => {
            try {
                const userRepository = AppDataSource.getRepository(User);
                const authRepository = AppDataSource.getRepository(AuthMethod);
                // Check if the user already exists based on Google ID
                let user = await userRepository.findOne({ where: { authtype: 'google', googleId: profile.id } });

                if (user) {
                    // Update user information if necessary
                    user.name = profile.displayName;
                    user.email = profile.emails ? profile.emails[0].value : user.email;
                    await userRepository.save(user);
                } else {
                    // Check if there is a user with the same email
                    const email = profile.emails ? profile.emails[0].value : null;
                    if (email) {
                        user = await userRepository.findOne({ where: { authtype: 'password', email } });
                        if (user) {
                            // Link the Google account to this user
                            user.googleId = profile.id;
                            await userRepository.save(user);
                        } else {
                            // Create a new user if they do not exist
                            user = userRepository.create({
                                googleId: profile.id,
                                name: profile.displayName,
                                email: email,
                                password: profile.id,
                                authtype: 'google'
                            });
                            await userRepository.save(user);
                        }
                    } else {
                        throw new Error('Google profile does not have an email');
                    }
                }
                done(null, user);
            } catch (error) {
                done(error, false);
            }
        }
    )
);
