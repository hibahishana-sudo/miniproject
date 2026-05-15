/* eslint-disable */
import { useEffect, useState } from "react";
import { useServiceStore } from "../stores/useServiceStore";
import { Trash, Loader, PlusCircle, X, Link, Pencil } from "lucide-react";

const defaultServiceCategories = ["Cleaning", "Plumbing", "Electrical", "Painting", "Carpentry", "Appliance Repair", "Beauty", "Fitness", "Tutoring"];

const getStoredServiceCategories = () => {
	try {
		const stored = localStorage.getItem("serviceCategories");
		return stored ? JSON.parse(stored) : defaultServiceCategories;
	} catch { return defaultServiceCategories; }
};

const statusColors = {
	pending: "bg-yellow-500/20 text-yellow-400",
	confirmed: "bg-blue-500/20 text-blue-400",
	completed: "bg-emerald-500/20 text-emerald-400",
	cancelled: "bg-red-500/20 text-red-400",
};

const AdminServicesTab = () => {
	const { adminServices, adminBookings, fetchAdminServices, fetchAdminBookings, createService, updateService, deleteService, updateBookingStatus, loading } = useServiceStore();
	const [tab, setTab] = useState("services");
	const [form, setForm] = useState({ name: "", description: "", price: "", category: "", duration: "", image: "" });
	const [serviceCategories, setServiceCategories] = useState(getStoredServiceCategories);
	const [newCategory, setNewCategory] = useState("");
	const [showCatInput, setShowCatInput] = useState(false);
	const [editService, setEditService] = useState(null);

	const handleAddCategory = () => {
		const trimmed = newCategory.trim();
		if (!trimmed || serviceCategories.includes(trimmed)) return;
		const updated = [...serviceCategories, trimmed];
		setServiceCategories(updated);
		localStorage.setItem("serviceCategories", JSON.stringify(updated));
		setNewCategory("");
		setShowCatInput(false);
	};

	const handleRemoveCategory = (cat) => {
		const updated = serviceCategories.filter(c => c !== cat);
		setServiceCategories(updated);
		localStorage.setItem("serviceCategories", JSON.stringify(updated));
		if (form.category === cat) setForm({ ...form, category: "" });
	};

	useEffect(() => {
		fetchAdminServices();
		fetchAdminBookings();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		await createService(form);
		setForm({ name: "", description: "", price: "", category: "", duration: "", image: "" });
	};

	return (
		<>
			<div className="flex gap-4 mb-6">
				<button onClick={() => setTab("services")} className={`px-5 py-2 rounded-lg font-medium transition-colors ${tab === "services" ? "bg-emerald-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>
					Manage Services
				</button>
				<button onClick={() => setTab("bookings")} className={`px-5 py-2 rounded-lg font-medium transition-colors ${tab === "bookings" ? "bg-emerald-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}>
					All Bookings
				</button>
			</div>

			{tab === "services" && (
				<div className="space-y-8">
					{/* Create Service Form */}
					<div className="bg-gray-800 rounded-xl p-6">
						<h2 className="text-xl font-semibold text-emerald-300 mb-5">Add New Service</h2>
						<form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="text-gray-400 text-sm">Service Name</label>
								<input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
									className="w-full mt-1 px-4 py-2 bg-gray-700 text-white rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" required />
							</div>
							<div>
								<div className="flex items-center justify-between mb-1">
									<label className="text-gray-400 text-sm">Category</label>
									<button type="button" onClick={() => setShowCatInput(!showCatInput)}
										className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors">
										<PlusCircle size={13} /> Add Category
									</button>
								</div>
								{showCatInput && (
									<div className="flex gap-2 mb-2">
										<input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
											onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCategory())}
											placeholder="New category name"
											className="flex-1 bg-gray-600 border border-gray-500 rounded-md py-1.5 px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
										<button type="button" onClick={handleAddCategory}
											className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md text-sm transition-colors">Add</button>
									</div>
								)}
								<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
									className="w-full mt-1 px-4 py-2 bg-gray-700 text-white rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" required>
									<option value="">Select category</option>
									{serviceCategories.map(c => <option key={c} value={c}>{c}</option>)}
								</select>
								<div className="flex flex-wrap gap-2 mt-2">
									{serviceCategories.filter(c => !defaultServiceCategories.includes(c)).map(cat => (
										<span key={cat} className="flex items-center gap-1 bg-emerald-900/40 text-emerald-400 text-xs px-2 py-1 rounded-full">
											{cat}
											<button type="button" onClick={() => handleRemoveCategory(cat)} className="hover:text-red-400 transition-colors"><X size={12} /></button>
										</span>
									))}
								</div>
							</div>
							<div>
								<label className="text-gray-400 text-sm">Price (₹)</label>
								<input type="text" value={form.price}
									onChange={(e) => { if (e.target.value === "" || /^[0-9]+$/.test(e.target.value)) setForm({ ...form, price: e.target.value }); }}
									inputMode="numeric" placeholder="Enter price in rupees"
									className="w-full mt-1 px-4 py-2 bg-gray-700 text-white rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" required />
							</div>
							<div>
								<label className="text-gray-400 text-sm">Duration</label>
								<input type="text" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}
									placeholder="e.g. 2 hours"
									className="w-full mt-1 px-4 py-2 bg-gray-700 text-white rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" required />
							</div>
							<div className="md:col-span-2">
								<label className="text-gray-400 text-sm">Description</label>
								<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
									rows={3} className="w-full mt-1 px-4 py-2 bg-gray-700 text-white rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 resize-none" required />
							</div>
							<div className="md:col-span-2">
								<label className="text-gray-400 text-sm">Image URL</label>
								<div className="flex gap-2 mt-1">
									<div className="relative flex-1">
										<Link size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
										<input type="text" value={form.image}
											onChange={(e) => setForm({ ...form, image: e.target.value })}
											placeholder="Paste image URL here..."
											className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 pl-9 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
											required />
									</div>
									{form.image && (
										<button type="button" onClick={() => setForm({ ...form, image: '' })}
											className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-400 hover:text-red-400 transition-colors">
											<X size={16} />
										</button>
									)}
								</div>
								{form.image && (
									<div className="mt-2 rounded-md overflow-hidden border border-gray-600 h-40">
										<img src={form.image} alt="Preview"
											className="w-full h-full object-cover"
											onError={(e) => { e.target.style.display = 'none'; }}
											onLoad={(e) => { e.target.style.display = 'block'; }} />
									</div>
								)}
							</div>
							<div className="md:col-span-2">
								<button type="submit" disabled={loading}
									className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
									{loading ? <Loader className="animate-spin" size={18} /> : <PlusCircle size={18} />}
									{loading ? "Creating..." : "Create Service"}
								</button>
							</div>
						</form>
					</div>

					{/* Services List */}
					<div className="bg-gray-800 rounded-xl overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-700">
								<tr>
									{["Service", "Category", "Price", "Duration", "Actions"].map(h => (
										<th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">{h}</th>
									))}
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-700">
								{adminServices.map((service) => (
									<tr key={service._id} className="hover:bg-gray-700">
										<td className="px-4 py-3">
											<div className="flex items-center gap-3">
												<img src={service.image} alt={service.name} className="w-10 h-10 rounded-lg object-cover" />
												<span className="text-white text-sm font-medium">{service.name}</span>
											</div>
										</td>
										<td className="px-4 py-3 text-gray-300 text-sm">{service.category}</td>
										<td className="px-4 py-3 text-emerald-400 text-sm font-medium">₹{service.price}</td>
										<td className="px-4 py-3 text-gray-300 text-sm">{service.duration}</td>
										<td className="px-4 py-3">
											<div className="flex items-center gap-3">
												<button onClick={() => setEditService({ ...service })} className="text-emerald-400 hover:text-emerald-300 transition-colors" title="Edit">
													<Pencil size={18} />
												</button>
												<button onClick={() => deleteService(service._id)} className="text-red-400 hover:text-red-300 transition-colors" title="Delete">
													<Trash size={18} />
												</button>
											</div>
										</td>
									</tr>
								))}
								{adminServices.length === 0 && (
									<tr><td colSpan={5} className="text-center py-8 text-gray-400">No services added yet</td></tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			)}

			{tab === "bookings" && (
				<div className="bg-gray-800 rounded-xl overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-700">
							<tr>
								{["Customer", "Service", "Date & Time", "Address", "Amount", "Status"].map(h => (
									<th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">{h}</th>
								))}
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-700">
							{adminBookings.map((booking) => (
								<tr key={booking._id} className="hover:bg-gray-700">
									<td className="px-4 py-3">
										<p className="text-white text-sm font-medium">{booking.user?.name}</p>
										<p className="text-gray-400 text-xs">{booking.user?.email}</p>
									</td>
									<td className="px-4 py-3 text-gray-300 text-sm">{booking.service?.name}</td>
									<td className="px-4 py-3 text-gray-300 text-sm">{booking.date}<br /><span className="text-xs text-gray-400">{booking.time}</span></td>
									<td className="px-4 py-3 text-gray-300 text-sm max-w-[150px] truncate">{booking.address}</td>
									<td className="px-4 py-3 text-emerald-400 text-sm font-medium">₹{booking.totalAmount}</td>
									<td className="px-4 py-3">
										<select
											value={booking.status}
											onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
											className={`text-xs px-2 py-1 rounded-full border-0 outline-none cursor-pointer ${statusColors[booking.status]}`}
										>
											<option value="pending">Pending</option>
											<option value="confirmed">Confirmed</option>
											<option value="completed">Completed</option>
											<option value="cancelled">Cancelled</option>
										</select>
									</td>
								</tr>
							))}
							{adminBookings.length === 0 && (
								<tr><td colSpan={6} className="text-center py-8 text-gray-400">No bookings yet</td></tr>
							)}
						</tbody>
					</table>
				</div>
			)}

			{/* Edit Service Modal */}
			{editService && (
				<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
					<div className="bg-gray-800 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
						<div className="flex justify-between items-center mb-5">
							<h2 className="text-xl font-bold text-white">Edit Service</h2>
							<button onClick={() => setEditService(null)} className="text-gray-400 hover:text-white transition-colors"><X size={22} /></button>
						</div>
						<form onSubmit={async (e) => { e.preventDefault(); await updateService(editService._id, editService); setEditService(null); }} className="space-y-4">
							<div>
								<label className="text-gray-400 text-sm">Service Name</label>
								<input type="text" value={editService.name} onChange={(e) => setEditService({ ...editService, name: e.target.value })}
									className="w-full mt-1 px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" required />
							</div>
							<div>
								<label className="text-gray-400 text-sm">Description</label>
								<textarea value={editService.description} onChange={(e) => setEditService({ ...editService, description: e.target.value })}
									rows={3} className="w-full mt-1 px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 resize-none" required />
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="text-gray-400 text-sm">Price (₹)</label>
									<input type="text" value={editService.price}
										onChange={(e) => { if (e.target.value === "" || /^[0-9]+$/.test(e.target.value)) setEditService({ ...editService, price: e.target.value }); }}
										inputMode="numeric"
										className="w-full mt-1 px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" required />
								</div>
								<div>
									<label className="text-gray-400 text-sm">Duration</label>
									<input type="text" value={editService.duration} onChange={(e) => setEditService({ ...editService, duration: e.target.value })}
										className="w-full mt-1 px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" required />
								</div>
							</div>
							<div>
								<label className="text-gray-400 text-sm">Category</label>
								<input type="text" value={editService.category} onChange={(e) => setEditService({ ...editService, category: e.target.value })}
									className="w-full mt-1 px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" required />
							</div>
							<div>
								<label className="text-gray-400 text-sm">Image URL</label>
								<div className="flex gap-2 mt-1">
									<div className="relative flex-1">
										<Link size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
										<input type="text" value={editService.image} onChange={(e) => setEditService({ ...editService, image: e.target.value })}
											placeholder="Paste image URL..."
											className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pl-9 pr-3 text-white outline-none focus:ring-2 focus:ring-emerald-500" />
									</div>
								</div>
								{editService.image && (
									<div className="mt-2 rounded-lg overflow-hidden border border-gray-600 h-32">
										<img src={editService.image} alt="Preview" className="w-full h-full object-cover"
											onError={(e) => { e.target.style.display = "none"; }}
											onLoad={(e) => { e.target.style.display = "block"; }} />
									</div>
								)}
							</div>
							<div className="flex gap-3 pt-2">
								<button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition-colors">Save Changes</button>
								<button type="button" onClick={() => setEditService(null)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition-colors">Cancel</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	);
};

export default AdminServicesTab;
