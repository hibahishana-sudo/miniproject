import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
		date: { type: String, required: true },
		time: { type: String, required: true },
		address: { type: String, required: true },
		status: {
			type: String,
			enum: ["pending", "confirmed", "completed", "cancelled"],
			default: "pending",
		},
		assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
		totalAmount: { type: Number, required: true },
		paymentStatus: {
			type: String,
			enum: ["pending", "paid", "failed"],
			default: "pending",
		},
		paymentMethod: {
			type: String,
			enum: ["online", "cash"],
			default: "online",
		},
		stripeSessionId: { type: String, default: null },
		review: {
			rating: { type: Number, min: 1, max: 5 },
			comment: { type: String },
		},
	},
	{ timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
