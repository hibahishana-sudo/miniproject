import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { UserPlus, ToggleLeft, ToggleRight } from "lucide-react";

const AdminTaskersTab = () => {
	const [taskers, setTaskers] = useState([]);
	const [bookings, setBookings] = useState([]);
	const [form, setForm] = useState({ name: "", email: "", password: "" });
	const [creating, setCreating] = useState(false);

	useEffect(() => {
		axios.get("/auth/taskers").then((r) => setTaskers(r.data)).catch(() => toast.error("Failed to load taskers"));
		axios.get("/bookings/all").then((r) => setBookings(r.data)).catch(() => toast.error("Failed to load bookings"));
	}, []);

	const createTasker = async (e) => {
		e.preventDefault();
		setCreating(true);
		try {
			const res = await axios.post("/auth/taskers", form);
			setTaskers((prev) => [...prev, res.data]);
			setForm({ name: "", email: "", password: "" });
			toast.success("Tasker created");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to create tasker");
		} finally {
			setCreating(false);
		}
	};

	const toggleAccess = async (id) => {
		try {
			const res = await axios.patch(`/auth/taskers/${id}/toggle`);
			setTaskers((prev) => prev.map((t) => (t._id === id ? { ...t, isActive: res.data.isActive } : t)));
			toast.success(`Tasker ${res.data.isActive ? "enabled" : "disabled"}`);
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to toggle access");
		}
	};

	const assignBooking = async (bookingId, taskerId) => {
		try {
			const res = await axios.patch(`/bookings/${bookingId}/assign`, { taskerId: taskerId || null });
			setBookings((prev) => prev.map((b) => (b._id === bookingId ? res.data : b)));
			toast.success(taskerId ? "Tasker assigned" : "Assignment removed");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to assign");
		}
	};

	return (
		<div className="space-y-10">
			{/* Create Tasker */}
			<div className="bg-gray-800 rounded-lg p-6">
				<h2 className="text-xl font-semibold text-emerald-400 mb-4 flex items-center gap-2">
					<UserPlus size={20} /> Add Tasker
				</h2>
				<form onSubmit={createTasker} className="flex flex-wrap gap-3">
					<input
						className="bg-gray-700 text-white rounded px-3 py-2 text-sm flex-1 min-w-[150px]"
						placeholder="Name"
						value={form.name}
						onChange={(e) => setForm({ ...form, name: e.target.value })}
						required
					/>
					<input
						className="bg-gray-700 text-white rounded px-3 py-2 text-sm flex-1 min-w-[150px]"
						placeholder="Email"
						type="email"
						value={form.email}
						onChange={(e) => setForm({ ...form, email: e.target.value })}
						required
					/>
					<input
						className="bg-gray-700 text-white rounded px-3 py-2 text-sm flex-1 min-w-[150px]"
						placeholder="Password"
						type="password"
						value={form.password}
						onChange={(e) => setForm({ ...form, password: e.target.value })}
						required
					/>
					<button
						type="submit"
						disabled={creating}
						className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded text-sm"
					>
						{creating ? "Creating..." : "Create"}
					</button>
				</form>
			</div>

			{/* Taskers List */}
			<div className="bg-gray-800 rounded-lg p-6">
				<h2 className="text-xl font-semibold text-emerald-400 mb-4">Taskers</h2>
				{taskers.length === 0 ? (
					<p className="text-gray-400 text-sm">No taskers yet.</p>
				) : (
					<table className="w-full text-sm text-gray-300">
						<thead>
							<tr className="text-left text-gray-500 border-b border-gray-700">
								<th className="pb-2">Name</th>
								<th className="pb-2">Email</th>
								<th className="pb-2">Status</th>
								<th className="pb-2">Action</th>
							</tr>
						</thead>
						<tbody>
							{taskers.map((t) => (
								<tr key={t._id} className="border-b border-gray-700">
									<td className="py-2">{t.name}</td>
									<td className="py-2">{t.email}</td>
									<td className="py-2">
										<span className={`px-2 py-0.5 rounded-full text-xs ${t.isActive !== false ? "bg-emerald-700" : "bg-red-700"}`}>
											{t.isActive !== false ? "Active" : "Disabled"}
										</span>
									</td>
									<td className="py-2">
										<button onClick={() => toggleAccess(t._id)} className="text-gray-400 hover:text-white">
											{t.isActive !== false ? <ToggleRight size={22} className="text-emerald-400" /> : <ToggleLeft size={22} />}
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>

			{/* Assign Bookings */}
			<div className="bg-gray-800 rounded-lg p-6">
				<h2 className="text-xl font-semibold text-emerald-400 mb-4">Assign Bookings to Taskers</h2>
				{bookings.length === 0 ? (
					<p className="text-gray-400 text-sm">No bookings found.</p>
				) : (
					<div className="space-y-3">
						{bookings.map((b) => (
							<div key={b._id} className="flex flex-wrap items-center justify-between gap-3 bg-gray-700 rounded p-3">
								<div>
									<p className="text-white text-sm font-medium">{b.service?.name}</p>
									<p className="text-gray-400 text-xs">{b.user?.name} · {b.date} {b.time}</p>
									<div className="flex items-center gap-2 mt-1 flex-wrap">
										<span className={`text-xs px-2 py-0.5 rounded-full text-white ${
											b.status === "completed" ? "bg-emerald-700" :
											b.status === "cancelled" ? "bg-red-700" :
											b.status === "confirmed" ? "bg-blue-700" : "bg-yellow-700"
										}`}>{b.status}</span>
										<span className={`text-xs px-2 py-0.5 rounded-full ${
											b.paymentMethod === "cash"
												? "bg-yellow-600/40 text-yellow-300"
												: "bg-emerald-600/40 text-emerald-300"
										}`}>
											{b.paymentMethod === "cash" ? "💵 Pay at Home" : "💳 Online"}
										</span>
									</div>
								</div>
								<select
									className="bg-gray-600 text-white text-sm rounded px-3 py-1.5"
									value={b.assignedTo?._id || b.assignedTo || ""}
									onChange={(e) => assignBooking(b._id, e.target.value)}
									disabled={b.status === "cancelled" || b.status === "completed"}
								>
									<option value="">Unassigned</option>
									{taskers.filter((t) => t.isActive !== false).map((t) => (
										<option key={t._id} value={t._id}>{t.name}</option>
									))}
								</select>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default AdminTaskersTab;
