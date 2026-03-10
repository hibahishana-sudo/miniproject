import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema({
	name: String,
	email: String,
	password: String,
	role: String,
});

const User = mongoose.model("User", userSchema);

async function makeAdmin() {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Connected to MongoDB");

		// Replace with your email
		const email = "YOUR_EMAIL_HERE";

		const user = await User.findOneAndUpdate(
			{ email: email },
			{ role: "admin" },
			{ new: true }
		);

		if (user) {
			console.log(`✅ ${user.email} is now an admin!`);
		} else {
			console.log("❌ User not found. Make sure the email is correct.");
		}

		await mongoose.disconnect();
	} catch (error) {
		console.error("Error:", error.message);
	}
}

makeAdmin();
