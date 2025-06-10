import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { registerUser } from "./controllers/user.controller.js";

const app = express();
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({limit: "50mb", extended: true}));
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express.static("public")); 
app.use(cookieParser());

//routes

import userRouter from "./routes/user.routes.js";
//routes declaration
app.use('/api/v1/users', userRouter);


export { app };