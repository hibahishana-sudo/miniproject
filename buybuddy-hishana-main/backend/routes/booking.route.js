import express from "express";
import { createBooking, getUserBookings, cancelBooking, addReview, getAllBookings, updateBookingStatus } from "../controllers/booking.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createBooking);
router.get("/my-bookings", protectRoute, getUserBookings);
router.patch("/:id/cancel", protectRoute, cancelBooking);
router.post("/:id/review", protectRoute, addReview);
router.get("/all", protectRoute, adminRoute, getAllBookings);
router.patch("/:id/status", protectRoute, adminRoute, updateBookingStatus);

export default router;
