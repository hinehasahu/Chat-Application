import express from "express";
import {
  forgotPassword,
  mailVerify,
  userLogin,
  userSignup,
  resetPassword,
  searchUser,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const UserRouter = express.Router();

UserRouter.post("/signup", userSignup);

UserRouter.get("/verify/:token", mailVerify);

UserRouter.post("/login", userLogin);

UserRouter.post("/forgot-password", forgotPassword);

UserRouter.post("/reset-password/:token", resetPassword);

UserRouter.get("/search",authMiddleware, searchUser)

// UserRouter.get("/allUsers", authMiddleware, getAllUsersExceptMe)
