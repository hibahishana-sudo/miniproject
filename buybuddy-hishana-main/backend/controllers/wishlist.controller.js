import User from "../models/user.model.js";
import Product from "../models/product.model.js";

export const getWishlist = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).populate("wishlist");
		res.json(user.wishlist || []);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const addToWishlist = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = await User.findById(req.user._id);

		if (user.wishlist.includes(productId)) {
			return res.status(400).json({ message: "Product already in wishlist" });
		}

		user.wishlist.push(productId);
		await user.save();
		await user.populate("wishlist");

		res.json(user.wishlist);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const removeFromWishlist = async (req, res) => {
	try {
		const { productId } = req.params;
		const user = await User.findById(req.user._id);

		user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
		await user.save();
		await user.populate("wishlist");

		res.json(user.wishlist);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
