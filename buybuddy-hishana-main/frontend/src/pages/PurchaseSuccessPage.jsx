import { ArrowRight, CheckCircle, HandHeart, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import axios from "../lib/axios";
import Confetti from "react-confetti";

const PurchaseSuccessPage = () => {
	const [isProcessing, setIsProcessing] = useState(true);
	const { clearCart } = useCartStore();
	const [error, setError] = useState(null);
	const [isService, setIsService] = useState(false);
	const [isCod, setIsCod] = useState(false);
	const [booking, setBooking] = useState(null);
	const [codData, setCodData] = useState(null);
	const location = useLocation();

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const sessionId = params.get("session_id");
		const type = params.get("type");

		// COD — data passed via router state
		if (type === "cod") {
			setIsCod(true);
			setCodData(location.state || {});
			setIsProcessing(false);
			return;
		}

		if (!sessionId) {
			setIsProcessing(false);
			setError("No session ID found in the URL");
			return;
		}

		if (type === "service") {
			setIsService(true);
			axios.post("/payments/service-checkout-success", { sessionId })
				.then((res) => setBooking(res.data.booking))
				.catch((err) => setError(err.response?.data?.message || "Failed to confirm booking"))
				.finally(() => setIsProcessing(false));
		} else {
			axios.post("/payments/checkout-success", { sessionId })
				.then(() => clearCart())
				.catch((err) => console.log(err))
				.finally(() => setIsProcessing(false));
		}
	}, [clearCart, location.state]);

	if (isProcessing) return <div className="text-center text-white mt-40">Processing your payment...</div>;
	if (error) return <div className="text-center text-red-400 mt-40">Error: {error}</div>;

	return (
		<div className="min-h-screen flex items-center justify-center px-4 py-10">
			<Confetti
				width={window.innerWidth}
				height={window.innerHeight}
				gravity={0.1}
				style={{ zIndex: 99 }}
				numberOfPieces={700}
				recycle={false}
			/>

			<div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10">
				<div className="p-6 sm:p-8">
					<div className="flex justify-center">
						<CheckCircle className="text-emerald-400 w-16 h-16 mb-4" />
					</div>

					<h1 className="text-2xl sm:text-3xl font-bold text-center text-emerald-400 mb-2">
						{isService ? "Booking Confirmed!" : "Order Placed!"}
					</h1>

					{/* COD order details */}
					{isCod && codData && (
						<>
							<div className="flex items-center justify-center gap-2 mb-4">
								<Truck size={18} className="text-yellow-400" />
								<span className="text-yellow-400 font-medium text-sm">Cash on Delivery</span>
							</div>

							{codData.orderId && (
								<p className="text-center text-gray-400 text-xs mb-4">
									Order ID: <span className="text-emerald-400 font-mono">#{codData.orderId.slice(-8).toUpperCase()}</span>
								</p>
							)}

							{/* Products list */}
							{codData.products && codData.products.length > 0 && (
								<div className="bg-gray-700 rounded-lg p-4 mb-4 space-y-3">
									{codData.products.map((item, i) => (
										<div key={i} className="flex items-center gap-3">
											{item.image && (
												<img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover flex-shrink-0" />
											)}
											<div className="flex-1 min-w-0">
												<p className="text-white text-sm font-medium truncate">{item.name || "Product"}</p>
												<p className="text-gray-400 text-xs">Qty: {item.quantity} · ₹{item.price}</p>
											</div>
											<p className="text-emerald-400 text-sm font-semibold flex-shrink-0">
												₹{(item.price * item.quantity).toFixed(0)}
											</p>
										</div>
									))}
									<div className="border-t border-gray-600 pt-3 flex justify-between">
										<span className="text-gray-300 text-sm font-medium">Total</span>
										<span className="text-emerald-400 font-bold">₹{codData.totalAmount?.toFixed(0)}</span>
									</div>
								</div>
							)}

							<p className="text-gray-400 text-center text-sm mb-6">
								Pay ₹{codData.totalAmount?.toFixed(0)} when your order arrives at your door.
							</p>
						</>
					)}

					{/* Service booking details */}
					{isService && booking && (
						<div className="bg-gray-700 rounded-lg p-4 mb-6 text-sm space-y-2">
							<p className="text-white font-semibold">{booking.service?.name}</p>
							<p className="text-gray-400">Date: {booking.date} at {booking.time}</p>
							<p className="text-gray-400">Address: {booking.address}</p>
							<p className="text-emerald-400 font-medium">Amount Paid: ₹{booking.totalAmount}</p>
							<p className="text-blue-400">Status: {booking.status}</p>
						</div>
					)}

					{/* Online product order */}
					{!isCod && !isService && (
						<>
							<p className="text-gray-300 text-center mb-2">Thank you for your order. We&apos;re processing it now.</p>
							<p className="text-emerald-400 text-center text-sm mb-6">Check your email for order details and updates.</p>
							<div className="bg-gray-700 rounded-lg p-4 mb-6">
								<div className="flex items-center justify-between">
									<span className="text-sm text-gray-400">Estimated delivery</span>
									<span className="text-sm font-semibold text-emerald-400">3-5 business days</span>
								</div>
							</div>
						</>
					)}

					<div className="space-y-3">
						<Link
							to="/profile"
							state={{ tab: "orders" }}
							className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2"
						>
							<HandHeart size={18} />
							View My Orders
						</Link>
						<Link
							to={isService ? "/services" : "/"}
							className="w-full bg-gray-700 hover:bg-gray-600 text-emerald-400 font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center"
						>
							{isService ? "Browse More Services" : "Continue Shopping"}
							<ArrowRight className="ml-2" size={18} />
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};
export default PurchaseSuccessPage;
