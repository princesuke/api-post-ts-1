import authController from "@/controllers/auth.controller";
import express, { type Router } from "express";

const authRouter: Router = express.Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/me", authController.getMe);
authRouter.post("/refresh-token", authController.getMe);

export default authRouter;
