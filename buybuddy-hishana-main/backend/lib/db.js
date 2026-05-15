import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.log(`MongoDB connected: ${conn.connection.host}`);

		// Drop the old non-sparse unique index on stripeSessionId if it exists.
		// This index causes E11000 duplicate key errors when multiple COD orders have stripeSessionId: null.
		try {
			await conn.connection.collection("orders").dropIndex("stripeSessionId_1");
			console.log("Dropped old stripeSessionId_1 index from orders collection");
		} catch {
			// Index doesn't exist or already dropped — safe to ignore
		}
	} catch (error) {
		console.log("Error connecting to MONGODB", error.message);
		process.exit(1);
	}
};
