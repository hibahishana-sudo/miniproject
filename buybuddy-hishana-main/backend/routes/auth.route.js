import express from "express";
import { login, logout, signup, refreshToken, getProfile, createTasker, getTaskers, toggleTaskerAccess } from "../controllers/auth.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/profile", protectRoute, getProfile);

// Admin tasker management
router.post("/taskers", protectRoute, adminRoute, createTasker);
router.get("/taskers", protectRoute, adminRoute, getTaskers);
router.patch("/taskers/:id/toggle", protectRoute, adminRoute, toggleTaskerAccess);

export default router;
