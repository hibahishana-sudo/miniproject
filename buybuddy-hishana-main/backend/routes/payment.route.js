import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import {
	createCheckoutSession,
	checkoutSuccess,
	createCodOrder,
	getUserOrders,
	getAllOrders,
	updateProductStatus,
	createServiceCheckoutSession,
	serviceCheckoutSuccess,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-checkout-session", protectRoute, createCheckoutSession);
router.post("/checkout-success", protectRoute, checkoutSuccess);
router.post("/cod-order", protectRoute, createCodOrder);
router.get("/my-orders", protectRoute, getUserOrders);
router.get("/all-orders", protectRoute, adminRoute, getAllOrders);
router.patch("/orders/:orderId/items/:itemId/status", protectRoute, adminRoute, updateProductStatus);
router.post("/create-service-checkout-session", protectRoute, createServiceCheckoutSession);
router.post("/service-checkout-success", protectRoute, serviceCheckoutSuccess);

export default router;
