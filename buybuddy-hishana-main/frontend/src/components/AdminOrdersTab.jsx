import { useEffect, useState } from "react";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const STATUSES = ["ordered", "processing", "shipped", "out_for_delivery", "delivered"];

const STATUS_LABELS = {
	ordered: "Ordered",
	processing: "Processing",
	shipped: "Shipped",
	out_for_delivery: "Out for Delivery",
	delivered: "Delivered",
};

const STATUS_COLORS = {
	ordered: "bg-gray-600 text-gray-200",
	processing: "bg-blue-700 text-blue-100",
	shipped: "bg-yellow-700 text-yellow-100",
	out_for_delivery: "bg-orange-700 text-orange-100",
	delivered: "bg-emerald-700 text-emerald-100",
};

const AdminOrdersTab = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [updating, setUpdating] = useState(null); // "orderId-itemId"

	useEffect(() => {
		axios.get("/payments/all-orders")
			.then((res) => setOrders(res.data))
			.catch(() => toast.error("Failed to load orders"))
			.finally(() => setLoading(false));
	}, []);

	const handleStatusChange = async (orderId, itemId, status) => {
		const key = `${orderId}-${itemId}`;
		setUpdating(key);
		try {
			await axios.patch(`/payments/orders/${orderId}/items/${itemId}/status`, { status });
			setOrders((prev) =>
				prev.map((order) =>
					order._id === orderId
						? {
								...order,
								products: order.products.map((item) =>
									item._id === itemId ? { ...item, status } : item
								),
						  }
						: order
				)
			);
			toast.success("Status updated");
		} catch {
			toast.error("Failed to update status");
		} finally {
			setUpdating(null);
		}
	};

	if (loading) return <div className="text-center py-12 text-gray-400">Loading orders...</div>;
	if (orders.length === 0) return <div className="text-center py-12 text-gray-400">No orders found.</div>;

	return (
		<div className="space-y-4 max-w-4xl mx-auto">
			{orders.map((order) => (
				<div key={order._id} className="bg-gray-800 rounded-lg p-4">
					<div className="flex justify-between items-start mb-3 flex-wrap gap-2">
						<div>
							<p className="text-white font-semibold text-sm">Order #{order._id.slice(-8).toUpperCase()}</p>
							<p className="text-gray-400 text-xs">
								{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
								{" · "}{order.user?.name || order.user?.email || "User"}
							</p>
						</div>
						<span className="text-emerald-400 font-bold text-sm">₹{order.totalAmount}</span>
					</div>

					<div className="space-y-3">
						{order.products.map((item) => {
							const key = `${order._id}-${item._id}`;
							return (
								<div key={item._id} className="bg-gray-700 rounded-lg p-3 flex items-center gap-3 flex-wrap">
									{item.product?.image && (
										<img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded object-cover flex-shrink-0" />
									)}
									<div className="flex-1 min-w-0">
										<p className="text-white text-sm font-medium truncate">{item.product?.name || "Product"}</p>
										<p className="text-gray-400 text-xs">Qty: {item.quantity} · ₹{item.price}</p>
									</div>
									<select
										value={item.status || "ordered"}
										disabled={updating === key}
										onChange={(e) => handleStatusChange(order._id, item._id, e.target.value)}
										className={`text-xs px-2 py-1.5 rounded-lg border-0 outline-none cursor-pointer ${STATUS_COLORS[item.status || "ordered"]}`}
									>
										{STATUSES.map((s) => (
											<option key={s} value={s} className="bg-gray-800 text-white">
												{STATUS_LABELS[s]}
											</option>
										))}
									</select>
								</div>
							);
						})}
					</div>
				</div>
			))}
		</div>
	);
};

export default AdminOrdersTab;
