import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		price: { type: Number, required: true, min: 0 },
		image: { type: String, required: true },
		category: { type: String, required: true },
		duration: { type: String, required: true }, // e.g. "2 hours"
		isAvailable: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);
export default Service;
