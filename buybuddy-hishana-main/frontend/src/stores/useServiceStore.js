import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51T547f2KXVPQSCRBfqEij7amhlHauSPXEF0KLy6hGVqtH9sIYUW0IWtmBxvLoQgbH3KKlbdb76RFv7z7EtKnvAmi00OBYp7Fys");

export const useServiceStore = create((set) => ({
	services: [],
	bookings: [],
	loading: false,

	fetchServices: async () => {
		set({ loading: true });
		try {
			const res = await axios.get("/services");
			set({ services: res.data });
		} catch {
			toast.error("Failed to load services");
		} finally {
			set({ loading: false });
		}
	},

	fetchMyBookings: async () => {
		try {
			const res = await axios.get("/bookings/my-bookings");
			set({ bookings: res.data });
		} catch {
			toast.error("Failed to load bookings");
		}
	},

	createBooking: async (bookingData) => {
		try {
			const res = await axios.post("/bookings", bookingData);
			set((state) => ({ bookings: [res.data, ...state.bookings] }));
			toast.success("Booking confirmed!");
			return res.data;
		} catch (error) {
			toast.error(error.response?.data?.message || "Booking failed");
			throw error;
		}
	},

	payAndBook: async (bookingData) => {
		try {
			const res = await axios.post("/payments/create-service-checkout-session", bookingData);
			const stripe = await stripePromise;
			await stripe.redirectToCheckout({ sessionId: res.data.id });
		} catch (error) {
			toast.error(error.response?.data?.message || "Payment failed");
			throw error;
		}
	},

	bookPayAtHome: async (bookingData) => {
		try {
			const res = await axios.post("/bookings", { ...bookingData, paymentMethod: "cash" });
			set((state) => ({ bookings: [res.data, ...state.bookings] }));
			toast.success("Booking confirmed! Pay when the professional arrives.");
			return res.data;
		} catch (error) {
			toast.error(error.response?.data?.message || "Booking failed");
			throw error;
		}
	},

	cancelBooking: async (bookingId) => {
		try {
			const res = await axios.patch(`/bookings/${bookingId}/cancel`);
			set((state) => ({
				bookings: state.bookings.map((b) => (b._id === bookingId ? res.data : b)),
			}));
			toast.success("Booking cancelled");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to cancel");
		}
	},

	addReview: async (bookingId, rating, comment) => {
		try {
			const res = await axios.post(`/bookings/${bookingId}/review`, { rating, comment });
			set((state) => ({
				bookings: state.bookings.map((b) => (b._id === bookingId ? res.data : b)),
			}));
			toast.success("Review submitted!");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to submit review");
		}
	},

	// Admin
	adminServices: [],
	adminBookings: [],

	fetchAdminServices: async () => {
		try {
			const res = await axios.get("/services");
			set({ adminServices: res.data });
		} catch {}
	},

	createService: async (serviceData) => {
		set({ loading: true });
		try {
			const res = await axios.post("/services", serviceData);
			set((state) => ({ adminServices: [...state.adminServices, res.data] }));
			toast.success("Service created!");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to create service");
		} finally {
			set({ loading: false });
		}
	},

	updateService: async (serviceId, serviceData) => {
		try {
			const res = await axios.put(`/services/${serviceId}`, serviceData);
			set((state) => ({
				adminServices: state.adminServices.map((s) => s._id === serviceId ? res.data : s),
			}));
			toast.success("Service updated!");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to update service");
		}
	},
	deleteService: async (serviceId) => {
		try {
			await axios.delete(`/services/${serviceId}`);
			set((state) => ({ adminServices: state.adminServices.filter((s) => s._id !== serviceId) }));
			toast.success("Service deleted");
		} catch {
			toast.error("Failed to delete service");
		}
	},

	fetchAdminBookings: async () => {
		try {
			const res = await axios.get("/bookings/all");
			set({ adminBookings: res.data });
		} catch {}
	},

	updateBookingStatus: async (bookingId, status) => {
		try {
			const res = await axios.patch(`/bookings/${bookingId}/status`, { status });
			set((state) => ({
				adminBookings: state.adminBookings.map((b) => (b._id === bookingId ? res.data : b)),
			}));
			toast.success("Status updated");
		} catch {
			toast.error("Failed to update status");
		}
	},
}));
