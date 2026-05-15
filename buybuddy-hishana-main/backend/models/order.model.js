import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		products: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
					min: 1,
				},
				price: {
					type: Number,
					required: true,
					min: 0,
				},
				status: {
					type: String,
					enum: ["ordered", "processing", "shipped", "out_for_delivery", "delivered"],
					default: "ordered",
				},
			},
		],
		totalAmount: {
			type: Number,
			required: true,
			min: 0,
		},
		stripeSessionId: {
			type: String,
			default: null,
		},
		paymentMethod: {
			type: String,
			enum: ["online", "cod"],
			default: "online",
		},
		paymentStatus: {
			type: String,
			enum: ["pending", "paid"],
			default: "pending",
		},
	},
	{ timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
