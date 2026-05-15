import Booking from "../models/booking.model.js";
import Service from "../models/service.model.js";

export const createBooking = async (req, res) => {
	try {
		const { serviceId, date, time, address, paymentMethod } = req.body;
		const service = await Service.findById(serviceId);
		if (!service) return res.status(404).json({ message: "Service not found" });

		const booking = await Booking.create({
			user: req.user._id,
			service: serviceId,
			date,
			time,
			address,
			totalAmount: service.price,
			paymentMethod: paymentMethod === "cash" ? "cash" : "online",
			paymentStatus: "pending",
		});
		await booking.populate("service");
		res.status(201).json(booking);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getUserBookings = async (req, res) => {
	try {
		const bookings = await Booking.find({ user: req.user._id })
			.populate("service")
			.sort({ createdAt: -1 });
		res.json(bookings);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const cancelBooking = async (req, res) => {
	try {
		const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
		if (!booking) return res.status(404).json({ message: "Booking not found" });
		if (booking.status === "completed") return res.status(400).json({ message: "Cannot cancel a completed booking" });
		booking.status = "cancelled";
		await booking.save();
		res.json(booking);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const addReview = async (req, res) => {
	try {
		const { rating, comment } = req.body;
		const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
		if (!booking) return res.status(404).json({ message: "Booking not found" });
		if (booking.status !== "completed") return res.status(400).json({ message: "Can only review completed bookings" });
		booking.review = { rating, comment };
		await booking.save();
		res.json(booking);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getAllBookings = async (req, res) => {
	try {
		const bookings = await Booking.find({})
			.populate("service")
			.populate("user", "name email")
			.sort({ createdAt: -1 });
		res.json(bookings);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateBookingStatus = async (req, res) => {
	try {
		const booking = await Booking.findByIdAndUpdate(
			req.params.id,
			{ status: req.body.status },
			{ new: true }
		).populate("service").populate("user", "name email");
		if (!booking) return res.status(404).json({ message: "Booking not found" });
		res.json(booking);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const assignBooking = async (req, res) => {
	try {
		const { taskerId } = req.body;
		const booking = await Booking.findByIdAndUpdate(
			req.params.id,
			{ assignedTo: taskerId || null },
			{ new: true }
		).populate("service").populate("user", "name email").populate("assignedTo", "name email");
		if (!booking) return res.status(404).json({ message: "Booking not found" });
		res.json(booking);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getTaskerBookings = async (req, res) => {
	try {
		const bookings = await Booking.find({ assignedTo: req.user._id })
			.populate("service")
			.populate("user", "name email")
			.sort({ createdAt: -1 });
		res.json(bookings);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getServiceReviews = async (req, res) => {
	try {
		const bookings = await Booking.find({
			service: req.params.serviceId,
			"review.rating": { $exists: true, $ne: null },
		})
			.populate("user", "name")
			.select("review user createdAt")
			.sort({ createdAt: -1 });

		const reviews = bookings.map((b) => ({
			user: b.user?.name || "Customer",
			rating: b.review.rating,
			comment: b.review.comment,
			date: b.createdAt,
		}));

		const avg = reviews.length
			? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
			: null;

		res.json({ reviews, avg, count: reviews.length });
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const taskerUpdateStatus = async (req, res) => {
	try {
		const allowed = ["confirmed", "completed"];
		if (!allowed.includes(req.body.status))
			return res.status(400).json({ message: "Taskers can only set confirmed or completed" });
		const booking = await Booking.findOneAndUpdate(
			{ _id: req.params.id, assignedTo: req.user._id },
			{ status: req.body.status },
			{ new: true }
		).populate("service").populate("user", "name email");
		if (!booking) return res.status(404).json({ message: "Booking not found or not assigned to you" });
		res.json(booking);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
