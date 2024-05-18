import express from 'express';
import dotenv from 'dotenv';
import "reflect-metadata";
import cookieParser from 'cookie-parser';
import AppDataSource from './config/dataSource';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json()); //tells we are going to use json
app.use(cookieParser());
app.get("/", (req, res) => res.send("HI"));
AppDataSource.initialize().then(() => {
    console.log("Data source has been Initialized");
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch(error => {
    console.error("Database connection failed:", error);
    process.exit();
});
