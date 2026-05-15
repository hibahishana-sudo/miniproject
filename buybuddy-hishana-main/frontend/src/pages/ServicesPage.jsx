import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useServiceStore } from "../stores/useServiceStore";
import { useUserStore } from "../stores/useUserStore";
import { Clock, Star, ArrowLeft, Calendar, CreditCard, Banknote, X, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";
import axios from "../lib/axios";

const categories = ["All", "Cleaning", "Plumbing", "Electrical", "Painting", "Carpentry", "Appliance Repair", "Beauty", "Fitness", "Tutoring"];

/* ── star row helper ── */
const StarRow = ({ rating, size = 14 }) => (
	<div className="flex items-center gap-0.5">
		{[1, 2, 3, 4, 5].map((s) => (
			<Star key={s} size={size}
				className={s <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"} />
		))}
	</div>
);

/* ── reviews modal ── */
const ReviewsModal = ({ service, onClose }) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		axios.get(`/bookings/service/${service._id}/reviews`)
			.then((r) => setData(r.data))
			.catch(() => toast.error("Failed to load reviews"))
			.finally(() => setLoading(false));
	}, [service._id]);

	return (
		<div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 px-4">
			<div className="bg-gray-800 rounded-xl w-full max-w-lg max-h-[85vh] flex flex-col">
				{/* Header */}
				<div className="flex items-start justify-between p-5 border-b border-gray-700">
					<div>
						<h2 className="text-white font-bold text-lg">{service.name}</h2>
						{data && data.count > 0 ? (
							<div className="flex items-center gap-2 mt-1">
								<StarRow rating={parseFloat(data.avg)} size={16} />
								<span className="text-yellow-400 font-bold">{data.avg}</span>
								<span className="text-gray-400 text-sm">({data.count} {data.count === 1 ? "review" : "reviews"})</span>
							</div>
						) : (
							!loading && <p className="text-gray-400 text-sm mt-1">No reviews yet</p>
						)}
					</div>
					<button onClick={onClose} className="text-gray-400 hover:text-white transition-colors ml-4">
						<X size={22} />
					</button>
				</div>

				{/* Body */}
				<div className="overflow-y-auto flex-1 p-5 space-y-4">
					{loading ? (
						<p className="text-center text-gray-400 py-8">Loading reviews...</p>
					) : data?.reviews.length === 0 ? (
						<div className="text-center py-10">
							<MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
							<p className="text-gray-400">No reviews yet for this service.</p>
							<p className="text-gray-500 text-sm mt-1">Be the first to review after your booking!</p>
						</div>
					) : (
						data.reviews.map((r, i) => (
							<div key={i} className="bg-gray-700 rounded-lg p-4">
								<div className="flex items-center justify-between mb-2">
									<div className="flex items-center gap-2">
										<div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
											{r.user.charAt(0).toUpperCase()}
										</div>
										<span className="text-white text-sm font-medium">{r.user}</span>
									</div>
									<div className="flex items-center gap-2">
										<StarRow rating={r.rating} size={13} />
										<span className="text-gray-400 text-xs">
											{new Date(r.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
										</span>
									</div>
								</div>
								{r.comment && (
									<p className="text-gray-300 text-sm italic">"{r.comment}"</p>
								)}
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
};

/* ── rating badge on service card ── */
const RatingBadge = ({ serviceId, onClick }) => {
	const [info, setInfo] = useState(null);

	useEffect(() => {
		axios.get(`/bookings/service/${serviceId}/reviews`)
			.then((r) => setInfo(r.data))
			.catch(() => {});
	}, [serviceId]);

	return (
		<button
			onClick={onClick}
			className="flex items-center gap-1 hover:opacity-80 transition-opacity"
			title="Click to see reviews"
		>
			<Star size={14} className="text-yellow-400 fill-yellow-400" />
			{info && info.count > 0 ? (
				<>
					<span className="text-yellow-400 text-sm font-semibold">{info.avg}</span>
					<span className="text-gray-400 text-xs">({info.count})</span>
				</>
			) : (
				<span className="text-gray-400 text-xs">No ratings</span>
			)}
		</button>
	);
};

/* ── main page ── */
const ServicesPage = () => {
	const { services, fetchServices, payAndBook, bookPayAtHome, loading } = useServiceStore();
	const { user } = useUserStore();
	const navigate = useNavigate();
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [bookingService, setBookingService] = useState(null);
	const [reviewService, setReviewService] = useState(null);
	const [form, setForm] = useState({ date: "", time: "", address: "" });
	const [paymentMethod, setPaymentMethod] = useState("online");
	const [paying, setPaying] = useState(false);

	useEffect(() => { fetchServices(); }, [fetchServices]);

	const filtered = selectedCategory === "All" ? services : services.filter(s => s.category === selectedCategory);

	const handleBook = async (e) => {
		e.preventDefault();
		if (!user) { toast.error("Please login to book a service"); return; }
		setPaying(true);
		try {
			if (paymentMethod === "cash") {
				await bookPayAtHome({ serviceId: bookingService._id, ...form });
				setBookingService(null);
				setForm({ date: "", time: "", address: "" });
				setPaymentMethod("online");
			} else {
				await payAndBook({ serviceId: bookingService._id, ...form });
			}
		} catch {
			// error already toasted in store
		} finally {
			setPaying(false);
		}
	};

	const closeModal = () => {
		if (paying) return;
		setBookingService(null);
		setForm({ date: "", time: "", address: "" });
		setPaymentMethod("online");
	};

	return (
		<div className="min-h-screen pt-20 px-4 pb-10">
			<div className="max-w-7xl mx-auto">
				<button onClick={() => navigate(-1)} className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-6 transition-colors">
					<ArrowLeft size={20} /><span>Back</span>
				</button>

				<h1 className="text-4xl font-bold text-emerald-400 mb-2">Services</h1>
				<p className="text-gray-400 mb-8">Book trusted professionals for your home & lifestyle needs</p>

				{/* Category Filter */}
				<div className="flex gap-3 overflow-x-auto pb-3 mb-8 scrollbar-thin scrollbar-thumb-emerald-600 scrollbar-track-gray-700">
					{categories.map((cat) => (
						<button
							key={cat}
							onClick={() => setSelectedCategory(cat)}
							className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
								selectedCategory === cat ? "bg-emerald-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
							}`}
						>
							{cat}
						</button>
					))}
				</div>

				{loading ? (
					<div className="flex justify-center py-20">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500" />
					</div>
				) : filtered.length === 0 ? (
					<div className="text-center py-20 text-gray-400">No services available in this category yet.</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{filtered.map((service) => (
							<div key={service._id} className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-emerald-500/20 transition-all">
								<img src={service.image} alt={service.name} className="w-full h-48 object-cover" />
								<div className="p-5">
									<span className="text-xs bg-emerald-900/50 text-emerald-400 px-2 py-1 rounded-full">{service.category}</span>
									<h3 className="text-white font-semibold text-lg mt-2 mb-1">{service.name}</h3>
									<p className="text-gray-400 text-sm mb-3 line-clamp-2">{service.description}</p>
									<div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
										<span className="flex items-center gap-1"><Clock size={14} />{service.duration}</span>
										{/* Real rating — clickable */}
										<RatingBadge
											serviceId={service._id}
											onClick={() => setReviewService(service)}
										/>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-emerald-400 font-bold text-xl">₹{service.price}</span>
										<button
											onClick={() => setBookingService(service)}
											className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
										>
											<Calendar size={16} />Book Now
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Reviews Modal */}
			{reviewService && (
				<ReviewsModal service={reviewService} onClose={() => setReviewService(null)} />
			)}

			{/* Booking Modal */}
			{bookingService && (
				<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
					<div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
						<h2 className="text-xl font-bold text-white mb-1">Book Service</h2>
						<p className="text-emerald-400 mb-5">{bookingService.name} — ₹{bookingService.price}</p>
						<form onSubmit={handleBook} className="space-y-4">
							<div>
								<label className="text-gray-400 text-sm">Date</label>
								<input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
									min={new Date().toISOString().split("T")[0]}
									className="w-full mt-1 px-4 py-2 bg-gray-700 text-white rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" required />
							</div>
							<div>
								<label className="text-gray-400 text-sm">Time</label>
								<select value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}
									className="w-full mt-1 px-4 py-2 bg-gray-700 text-white rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" required>
									<option value="">Select time</option>
									{["08:00 AM","09:00 AM","10:00 AM","11:00 AM","12:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM","06:00 PM"].map(t => (
										<option key={t} value={t}>{t}</option>
									))}
								</select>
							</div>
							<div>
								<label className="text-gray-400 text-sm">Address</label>
								<textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
									rows={3} placeholder="Enter your full address"
									className="w-full mt-1 px-4 py-2 bg-gray-700 text-white rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 resize-none" required />
							</div>

							{/* Payment Method */}
							<div>
								<label className="text-gray-400 text-sm mb-2 block">Payment Method</label>
								<div className="grid grid-cols-2 gap-3">
									<button type="button" onClick={() => setPaymentMethod("online")}
										className={`flex items-center justify-center gap-2 py-3 rounded-lg border-2 text-sm font-medium transition-colors ${
											paymentMethod === "online"
												? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
												: "border-gray-600 bg-gray-700 text-gray-400 hover:border-gray-500"
										}`}>
										<CreditCard size={16} /> Pay Online
									</button>
									<button type="button" onClick={() => setPaymentMethod("cash")}
										className={`flex items-center justify-center gap-2 py-3 rounded-lg border-2 text-sm font-medium transition-colors ${
											paymentMethod === "cash"
												? "border-yellow-500 bg-yellow-500/10 text-yellow-400"
												: "border-gray-600 bg-gray-700 text-gray-400 hover:border-gray-500"
										}`}>
										<Banknote size={16} /> Pay at Home
									</button>
								</div>
								{paymentMethod === "cash" && (
									<p className="text-yellow-400/80 text-xs mt-2">💵 Pay in cash when the professional arrives at your home.</p>
								)}
							</div>

							<div className="flex gap-3 pt-2">
								<button type="submit" disabled={paying}
									className={`flex-1 disabled:opacity-60 text-white py-2 rounded-lg font-medium transition-colors ${
										paymentMethod === "cash" ? "bg-yellow-600 hover:bg-yellow-700" : "bg-emerald-600 hover:bg-emerald-700"
									}`}>
									{paying
										? "Processing..."
										: paymentMethod === "cash"
											? `Confirm Booking — Pay ₹${bookingService.price} at Home`
											: `Pay ₹${bookingService.price} Online`}
								</button>
								<button type="button" onClick={closeModal} disabled={paying}
									className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition-colors">
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default ServicesPage;
