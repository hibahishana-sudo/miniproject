import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useWishlistStore = create((set, get) => ({
	wishlist: [],

	fetchWishlist: async () => {
		try {
			const res = await axios.get("/wishlist");
			set({ wishlist: res.data });
		} catch (error) {
			set({ wishlist: [] });
		}
	},

	addToWishlist: async (product) => {
		const wishlist = get().wishlist;
		const existingItem = wishlist.find((item) => item._id === product._id);

		if (existingItem) {
			toast.error("Already in wishlist");
			return;
		}

		try {
			const res = await axios.post("/wishlist", { productId: product._id });
			set({ wishlist: res.data });
			toast.success("Added to wishlist");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to add to wishlist");
		}
	},

	removeFromWishlist: async (productId) => {
		try {
			const res = await axios.delete(`/wishlist/${productId}`);
			set({ wishlist: res.data });
			toast.success("Removed from wishlist");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to remove from wishlist");
		}
	},

	isInWishlist: (productId) => {
		return get().wishlist.some((item) => item._id === productId);
	},

	clearWishlist: () => {
		set({ wishlist: [] });
	},
}));
