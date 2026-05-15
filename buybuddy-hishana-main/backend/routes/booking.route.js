import express from "express";
import {
	createBooking,
	getUserBookings,
	cancelBooking,
	addReview,
	getAllBookings,
	updateBookingStatus,
	assignBooking,
	getTaskerBookings,
	taskerUpdateStatus,
	getServiceReviews,
} from "../controllers/booking.controller.js";
import { protectRoute, adminRoute, taskerRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/service/:serviceId/reviews", getServiceReviews); // public
router.post("/", protectRoute, createBooking);
router.get("/my-bookings", protectRoute, getUserBookings);
router.patch("/:id/cancel", protectRoute, cancelBooking);
router.post("/:id/review", protectRoute, addReview);

// Admin routes
router.get("/all", protectRoute, adminRoute, getAllBookings);
router.patch("/:id/status", protectRoute, adminRoute, updateBookingStatus);
router.patch("/:id/assign", protectRoute, adminRoute, assignBooking);

// Tasker routes
router.get("/tasker-jobs", protectRoute, taskerRoute, getTaskerBookings);
router.patch("/:id/tasker-status", protectRoute, taskerRoute, taskerUpdateStatus);

export default router;
