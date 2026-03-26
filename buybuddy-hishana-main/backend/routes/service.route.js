import express from "express";
import { getAllServices, getServicesByCategory, getServiceById, createService, updateService, deleteService } from "../controllers/service.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllServices);
router.get("/category/:category", getServicesByCategory);
router.get("/:id", getServiceById);
router.post("/", protectRoute, adminRoute, createService);
router.put("/:id", protectRoute, adminRoute, updateService);
router.delete("/:id", protectRoute, adminRoute, deleteService);

export default router;
