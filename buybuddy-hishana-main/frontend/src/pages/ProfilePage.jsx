import { useState, useEffect } from "react";
import { User, MapPin, Edit, Globe, Package, Heart, Tag, HelpCircle, Store, CreditCard, Shield, LogOut, Trash2, Plus, ShoppingCart } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useWishlistStore } from "../stores/useWishlistStore";
import { useCartStore } from "../stores/useCartStore";
import { useNavigate, Link } from "react-router-dom";
import BlockchainOrderTracker from "../components/BlockchainOrderTracker";

const ProfilePage = () => {
	const { user, logout } = useUserStore();
	const { wishlist, removeFromWishlist, fetchWishlist } = useWishlistStore();
	const { addToCart } = useCartStore();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("profile");
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
		if (user) {
			fetchWishlist();
		}
	}, [user, fetchWishlist]);

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
							<BlockchainOrderTracker orderId="ORD-12345" />
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
