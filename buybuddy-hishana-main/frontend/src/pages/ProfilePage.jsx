import { useState, useEffect } from "react";
import { User, MapPin, Edit, Globe, Package, Heart, Tag, HelpCircle, Store, CreditCard, Shield, LogOut, Trash2, Plus, ShoppingCart, Wrench, Star, CheckCircle, Clock } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useWishlistStore } from "../stores/useWishlistStore";
import { useCartStore } from "../stores/useCartStore";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const TRACKING_STEPS = [
	{ key: "ordered", label: "Ordered" },
	{ key: "processing", label: "Processing" },
	{ key: "shipped", label: "Shipped" },
	{ key: "out_for_delivery", label: "Out for Delivery" },
	{ key: "delivered", label: "Delivered" },
];

const TrackingTimeline = ({ status }) => {
	const currentIndex = TRACKING_STEPS.findIndex((s) => s.key === status);
	return (
		<div className="flex items-center gap-0 mt-1">
			{TRACKING_STEPS.map((step, i) => (
				<div key={step.key} className="flex items-center flex-1 last:flex-none">
					<div className="flex flex-col items-center">
						{i <= currentIndex ? (
							<CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
						) : (
							<Clock size={16} className="text-gray-500 flex-shrink-0" />
						)}
						<span className={`text-xs mt-0.5 text-center leading-tight ${
							i <= currentIndex ? "text-emerald-400" : "text-gray-500"
						}`} style={{ fontSize: "10px", maxWidth: 56 }}>{step.label}</span>
					</div>
					{i < TRACKING_STEPS.length - 1 && (
						<div className={`h-0.5 flex-1 mx-1 ${
							i < currentIndex ? "bg-emerald-400" : "bg-gray-600"
						}`} />
					)}
				</div>
			))}
		</div>
	);
};

const ProfilePage = () => {
	const { user, logout } = useUserStore();
	const { wishlist, removeFromWishlist, fetchWishlist } = useWishlistStore();
	const { addToCart } = useCartStore();
	const navigate = useNavigate();
	const location = useLocation();
	const [activeTab, setActiveTab] = useState(location.state?.tab || "profile");
	const [orders, setOrders] = useState([]);
	const [bookings, setBookings] = useState([]);
	const [ordersLoading, setOrdersLoading] = useState(false);
	const [orderSubTab, setOrderSubTab] = useState("products");
	const [reviewForm, setReviewForm] = useState({}); // { [bookingId]: { rating, comment, open } }

	const handleReviewSubmit = async (bookingId) => {
		const { rating, comment } = reviewForm[bookingId] || {};
		if (!rating) return toast.error("Please select a star rating");
		try {
			const res = await axios.post(`/bookings/${bookingId}/review`, { rating, comment: comment || "" });
			setBookings((prev) => prev.map((b) => b._id === bookingId ? res.data : b));
			setReviewForm((prev) => ({ ...prev, [bookingId]: { open: false } }));
			toast.success("Review submitted!");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to submit review");
		}
	};
	const [addresses, setAddresses] = useState([
		{
			id: 1,
			name: "John Doe",
			houseNo: "123",
			place: "Main Street",
			city: "New York",
			phone: "+1 234-567-8900",
			isDefault: true
		}
	]);
	const [editingAddress, setEditingAddress] = useState(null);
	const [showAddForm, setShowAddForm] = useState(false);
	const [newAddress, setNewAddress] = useState({
		name: "",
		houseNo: "",
		place: "",
		city: "",
		phone: ""
	});

	useEffect(() => {
		if (user) fetchWishlist();
	}, [user, fetchWishlist]);

	useEffect(() => {
		if (activeTab === "orders") {
			setOrdersLoading(true);
			Promise.all([
				axios.get("/payments/my-orders"),
				axios.get("/bookings/my-bookings"),
			])
				.then(([ordersRes, bookingsRes]) => {
					setOrders(ordersRes.data);
					setBookings(bookingsRes.data);
				})
				.catch(() => {})
				.finally(() => setOrdersLoading(false));
		}
	}, [activeTab]);

	const handleAddAddress = () => {
		if (newAddress.name && newAddress.houseNo && newAddress.place && newAddress.city && newAddress.phone) {
			setAddresses([...addresses, { ...newAddress, id: Date.now(), isDefault: false }]);
			setNewAddress({ name: "", houseNo: "", place: "", city: "", phone: "" });
			setShowAddForm(false);
		}
	};

	const handleEditAddress = (id) => {
		const address = addresses.find(a => a.id === id);
		setEditingAddress(address);
	};

	const handleSaveEdit = () => {
		setAddresses(addresses.map(a => a.id === editingAddress.id ? editingAddress : a));
		setEditingAddress(null);
	};

	const handleDeleteAddress = (id) => {
		setAddresses(addresses.filter(a => a.id !== id));
	};

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	const menuItems = [
		{ id: "profile", icon: User, label: "Edit Profile" },
		{ id: "address", icon: MapPin, label: "Saved Addresses" },
		{ id: "orders", icon: Package, label: "My Orders" },
		{ id: "wishlist", icon: Heart, label: "Wishlist" },
		{ id: "coupons", icon: Tag, label: "Coupons" },
		{ id: "cards", icon: CreditCard, label: "Saved Cards" },
		{ id: "language", icon: Globe, label: "Language" },
		{ id: "help", icon: HelpCircle, label: "Help Center" },
		{ id: "sell", icon: Store, label: "Sell on BUYBUDDY" },
		{ id: "privacy", icon: Shield, label: "Privacy Center" },
	];

	return (
		<div className="min-h-screen pt-20 px-4 pb-10">
			<div className="max-w-7xl mx-auto">
				<div className="grid md:grid-cols-4 gap-6">
					<div className="md:col-span-1">
						<div className="bg-gray-800 rounded-lg p-6 sticky top-24">
							<div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-700">
								<div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
									{user?.name?.charAt(0).toUpperCase()}
								</div>
								<div>
									<h3 className="text-white font-semibold">{user?.name}</h3>
									<p className="text-gray-400 text-sm">{user?.email}</p>
								</div>
							</div>
							<nav className="space-y-2">
								{menuItems.map((item) => (
									<button
										key={item.id}
										onClick={() => setActiveTab(item.id)}
										className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
											activeTab === item.id ? "bg-emerald-600 text-white" : "text-gray-300 hover:bg-gray-700"
										}`}
									>
										<item.icon size={20} />
										<span className="text-sm">{item.label}</span>
									</button>
								))}
								<button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-all">
									<LogOut size={20} />
									<span className="text-sm">Logout</span>
								</button>
							</nav>
						</div>
					</div>

					<div className="md:col-span-3">
						{activeTab === "orders" ? (
							<div className="bg-gray-800 rounded-lg p-6">
								<h2 className="text-2xl font-bold text-white mb-6">My Orders</h2>

								{/* Sub-tabs */}
								<div className="flex gap-3 mb-6">
									<button
										onClick={() => setOrderSubTab("products")}
										className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
											orderSubTab === "products" ? "bg-emerald-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
										}`}
									>
										<Package size={16} /> Product Orders
									</button>
									<button
										onClick={() => setOrderSubTab("services")}
										className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
											orderSubTab === "services" ? "bg-emerald-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
										}`}
									>
										<Wrench size={16} /> Service Bookings
									</button>
								</div>

								{ordersLoading ? (
									<div className="text-center py-12 text-gray-400">Loading...</div>
								) : orderSubTab === "products" ? (
									orders.length === 0 ? (
										<div className="text-center py-12">
											<Package className="w-16 h-16 text-gray-600 mx-auto mb-3" />
											<p className="text-gray-400">No product orders yet</p>
											<Link to="/" className="mt-4 inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-sm transition-colors">Shop Now</Link>
										</div>
									) : (
										<div className="space-y-4">
											{orders.map((order) => (
												<div key={order._id} className="bg-gray-700 rounded-lg p-4">
													<div className="flex justify-between items-start mb-3 flex-wrap gap-2">
														<div>
															<p className="text-white font-semibold text-sm">Order #{order._id.slice(-8).toUpperCase()}</p>
															<p className="text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
														</div>
														<div className="flex items-center gap-2">
															<span className={`text-xs px-2 py-0.5 rounded-full ${
																order.paymentMethod === "cod" ? "bg-yellow-600/40 text-yellow-300" : "bg-emerald-600/40 text-emerald-300"
															}`}>
																{order.paymentMethod === "cod" ? "🚚 Cash on Delivery" : "💳 Paid Online"}
															</span>
															<span className="text-emerald-400 font-bold text-sm">₹{order.totalAmount}</span>
														</div>
													</div>
													<div className="space-y-2">
														{order.products.map((item, i) => (
															<div key={i} className="bg-gray-600 rounded-lg p-3">
																<div className="flex items-center gap-3 mb-3">
																	{item.product?.image && (
																		<img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded object-cover" />
																	)}
																	<div>
																		<p className="text-white text-sm">{item.product?.name || "Product"}</p>
																		<p className="text-gray-400 text-xs">Qty: {item.quantity} · ₹{item.price}</p>
																	</div>
																</div>
																{/* Tracking timeline */}
																<TrackingTimeline status={item.status || "ordered"} />
															</div>
														))}
													</div>
												</div>
											))}
										</div>
									)
								) : (
									bookings.length === 0 ? (
										<div className="text-center py-12">
											<Wrench className="w-16 h-16 text-gray-600 mx-auto mb-3" />
											<p className="text-gray-400">No service bookings yet</p>
											<Link to="/services" className="mt-4 inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-sm transition-colors">Browse Services</Link>
										</div>
									) : (
										<div className="space-y-4">
											{bookings.map((booking) => {
												const rf = reviewForm[booking._id] || {};
												const canReview = booking.status === "completed" && !booking.review?.rating;
												return (
													<div key={booking._id} className="bg-gray-700 rounded-lg p-4">
														<div className="flex justify-between items-start flex-wrap gap-2">
															<div>
																<p className="text-white font-semibold">{booking.service?.name}</p>
																<p className="text-gray-400 text-sm">{booking.date} at {booking.time}</p>
																<p className="text-gray-400 text-sm">{booking.address}</p>
															</div>
															<div className="flex flex-col items-end gap-1">
																<span className={`text-xs px-2 py-0.5 rounded-full text-white ${
																	booking.status === "completed" ? "bg-emerald-700" :
																	booking.status === "cancelled" ? "bg-red-700" :
																	booking.status === "confirmed" ? "bg-blue-700" : "bg-yellow-700"
																}`}>{booking.status}</span>
																<span className={`text-xs px-2 py-0.5 rounded-full ${
																	booking.paymentMethod === "cash" ? "bg-yellow-600/40 text-yellow-300" : "bg-emerald-600/40 text-emerald-300"
																}`}>
																	{booking.paymentMethod === "cash" ? "💵 Pay at Home" : "💳 Paid Online"}
																</span>
																<span className="text-emerald-400 font-bold text-sm">₹{booking.totalAmount}</span>
															</div>
														</div>

														{/* Existing review display */}
														{booking.review?.rating && (
															<div className="mt-3 pt-3 border-t border-gray-600">
																<p className="text-gray-400 text-xs mb-1">Your Review</p>
																<div className="flex items-center gap-1 mb-1">
																	{[1,2,3,4,5].map((s) => (
																		<Star key={s} size={14} className={s <= booking.review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"} />
																	))}
																</div>
																{booking.review.comment && (
																	<p className="text-gray-300 text-sm italic">"{booking.review.comment}"</p>
																)}
															</div>
														)}

														{/* Write review button */}
														{canReview && !rf.open && (
															<button
																onClick={() => setReviewForm((prev) => ({ ...prev, [booking._id]: { open: true, rating: 0, comment: "" } }))}
																className="mt-3 flex items-center gap-1 text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors"
															>
																<Star size={15} className="fill-yellow-400" /> Write a Review
															</button>
														)}

														{/* Review form */}
														{canReview && rf.open && (
															<div className="mt-3 pt-3 border-t border-gray-600">
																<p className="text-white text-sm font-medium mb-2">Rate this service</p>
																<div className="flex items-center gap-1 mb-3">
																	{[1,2,3,4,5].map((s) => (
																		<button key={s} type="button"
																			onClick={() => setReviewForm((prev) => ({ ...prev, [booking._id]: { ...prev[booking._id], rating: s } }))}
																		>
																			<Star size={24} className={`transition-colors ${
																				s <= (rf.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-500 hover:text-yellow-300"
																			}`} />
																		</button>
																	))}
																	<span className="text-gray-400 text-sm ml-2">
																		{["","Poor","Fair","Good","Very Good","Excellent"][rf.rating || 0]}
																	</span>
																</div>
																<textarea rows={2}
																	placeholder="Share your experience (optional)"
																	value={rf.comment || ""}
																	onChange={(e) => setReviewForm((prev) => ({ ...prev, [booking._id]: { ...prev[booking._id], comment: e.target.value } }))}
																	className="w-full px-3 py-2 bg-gray-600 text-white text-sm rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 resize-none mb-3"
																/>
																<div className="flex gap-2">
																	<button onClick={() => handleReviewSubmit(booking._id)}
																		className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-1.5 rounded-lg text-sm transition-colors">
																		Submit Review
																	</button>
																	<button onClick={() => setReviewForm((prev) => ({ ...prev, [booking._id]: { open: false } }))}
																		className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-1.5 rounded-lg text-sm transition-colors">
																		Cancel
																	</button>
																</div>
															</div>
														)}
													</div>
												);
											})}
										</div>
									)
								)}
							</div>
						) : (
							<div className="bg-gray-800 rounded-lg p-6">
								{activeTab === "profile" && (
									<div>
										<h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>
										<div className="space-y-4">
											<div>
												<label className="text-gray-400 text-sm">Full Name</label>
												<input type="text" defaultValue={user?.name} className="w-full mt-2 px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
											</div>
											<div>
												<label className="text-gray-400 text-sm">Email</label>
												<input type="email" defaultValue={user?.email} className="w-full mt-2 px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
											</div>
											<button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">Save Changes</button>
										</div>
									</div>
								)}
								{activeTab === "address" && (
									<div>
										<div className="flex justify-between items-center mb-6">
											<h2 className="text-2xl font-bold text-white">Saved Addresses</h2>
											<button
												onClick={() => setShowAddForm(!showAddForm)}
												className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
											>
												<Plus size={18} />
												Add New Address
											</button>
										</div>

										{showAddForm && (
											<div className="bg-gray-700 p-6 rounded-lg mb-6">
												<h3 className="text-white font-semibold mb-4">Add New Address</h3>
												<div className="grid md:grid-cols-2 gap-4">
													<div>
														<label className="text-gray-400 text-sm">Full Name</label>
														<input
															type="text"
															value={newAddress.name}
															onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
															className="w-full mt-2 px-4 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
															placeholder="Enter your name"
														/>
													</div>
													<div>
														<label className="text-gray-400 text-sm">House No / Building</label>
														<input
															type="text"
															value={newAddress.houseNo}
															onChange={(e) => setNewAddress({...newAddress, houseNo: e.target.value})}
															className="w-full mt-2 px-4 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
															placeholder="House/Flat No"
														/>
													</div>
													<div>
														<label className="text-gray-400 text-sm">Street / Place</label>
														<input
															type="text"
															value={newAddress.place}
															onChange={(e) => setNewAddress({...newAddress, place: e.target.value})}
															className="w-full mt-2 px-4 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
															placeholder="Street name"
														/>
													</div>
													<div>
														<label className="text-gray-400 text-sm">City</label>
														<input
															type="text"
															value={newAddress.city}
															onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
															className="w-full mt-2 px-4 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
															placeholder="City name"
														/>
													</div>
													<div className="md:col-span-2">
														<label className="text-gray-400 text-sm">Phone Number</label>
														<input
															type="tel"
															value={newAddress.phone}
															onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
															className="w-full mt-2 px-4 py-2 bg-gray-600 text-white rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
															placeholder="+1 234-567-8900"
														/>
													</div>
												</div>
												<div className="flex gap-3 mt-4">
													<button
														onClick={handleAddAddress}
														className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors"
													>
														Save Address
													</button>
													<button
														onClick={() => setShowAddForm(false)}
														className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-lg transition-colors"
													>
														Cancel
													</button>
												</div>
											</div>
										)}

										<div className="space-y-4">
											{addresses.map((address) => (
												<div key={address.id} className="bg-gray-700 p-4 rounded-lg">
													{editingAddress?.id === address.id ? (
														<div className="space-y-3">
															<input
																type="text"
																value={editingAddress.name}
																onChange={(e) => setEditingAddress({...editingAddress, name: e.target.value})}
																className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg outline-none"
																placeholder="Name"
															/>
															<input
																type="text"
																value={editingAddress.houseNo}
																onChange={(e) => setEditingAddress({...editingAddress, houseNo: e.target.value})}
																className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg outline-none"
																placeholder="House No"
															/>
															<input
																type="text"
																value={editingAddress.place}
																onChange={(e) => setEditingAddress({...editingAddress, place: e.target.value})}
																className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg outline-none"
																placeholder="Place"
															/>
															<input
																type="text"
																value={editingAddress.city}
																onChange={(e) => setEditingAddress({...editingAddress, city: e.target.value})}
																className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg outline-none"
																placeholder="City"
															/>
															<input
																type="tel"
																value={editingAddress.phone}
																onChange={(e) => setEditingAddress({...editingAddress, phone: e.target.value})}
																className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg outline-none"
																placeholder="Phone"
															/>
															<div className="flex gap-2">
																<button
																	onClick={handleSaveEdit}
																	className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
																>
																	Save
																</button>
																<button
																	onClick={() => setEditingAddress(null)}
																	className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
																>
																	Cancel
																</button>
															</div>
														</div>
													) : (
														<div className="flex justify-between items-start">
															<div>
																<h3 className="text-white font-semibold mb-2">{address.name}</h3>
																<p className="text-gray-300 text-sm">{address.houseNo}, {address.place}</p>
																<p className="text-gray-300 text-sm">{address.city}</p>
																<p className="text-gray-300 text-sm">Phone: {address.phone}</p>
																{address.isDefault && (
																	<span className="inline-block mt-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded">Default</span>
																)}
															</div>
															<div className="flex gap-2">
																<button
																	onClick={() => handleEditAddress(address.id)}
																	className="text-emerald-400 hover:text-emerald-300 transition-colors"
																>
																	<Edit size={18} />
																</button>
																<button
																	onClick={() => handleDeleteAddress(address.id)}
																	className="text-red-400 hover:text-red-300 transition-colors"
																>
																	<Trash2 size={18} />
																</button>
															</div>
														</div>
													)}
												</div>
											))}
										</div>
									</div>
								)}
								{activeTab === "wishlist" && (
									<div>
										<h2 className="text-2xl font-bold text-white mb-6">My Wishlist ({wishlist.length})</h2>
										{wishlist.length === 0 ? (
											<div className="text-center py-12">
												<Heart className="w-24 h-24 text-gray-600 mx-auto mb-4" />
												<p className="text-gray-400 mb-4">Your wishlist is empty</p>
												<Link to="/" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg inline-block transition-colors">
													Start Shopping
												</Link>
											</div>
										) : (
											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
												{wishlist.map((product) => (
													<div key={product._id} className="bg-gray-700 rounded-lg overflow-hidden group">
														<Link to={`/product/${product._id}`} className="block">
															<div className="relative h-48 overflow-hidden">
																<img
																	src={product.image}
																	alt={product.name}
																	className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
																/>
															</div>
														</Link>
														<div className="p-4">
															<h3 className="text-white font-semibold mb-2 truncate">{product.name}</h3>
															<p className="text-emerald-400 font-bold text-lg mb-3">₹{product.price}</p>
															<div className="flex gap-2">
																<button
																	onClick={() => {
																		addToCart(product);
																		removeFromWishlist(product._id);
																	}}
																	className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
																>
																	<ShoppingCart size={18} />
																	Add to Cart
																</button>
																<button
																	onClick={() => removeFromWishlist(product._id)}
																	className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
																>
																	<Trash2 size={18} />
																</button>
															</div>
														</div>
													</div>
												))}
											</div>
										)}
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
