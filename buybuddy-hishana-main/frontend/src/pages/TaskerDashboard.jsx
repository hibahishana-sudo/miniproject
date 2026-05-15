import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const STATUS_COLORS = {
	pending: "bg-yellow-600",
	confirmed: "bg-blue-600",
	completed: "bg-emerald-600",
	cancelled: "bg-red-600",
};

const TaskerDashboard = () => {
	const [jobs, setJobs] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		axios.get("/bookings/tasker-jobs")
			.then((res) => setJobs(res.data))
			.catch(() => toast.error("Failed to load jobs"))
			.finally(() => setLoading(false));
	}, []);

	const updateStatus = async (id, status) => {
		try {
			const res = await axios.patch(`/bookings/${id}/tasker-status`, { status });
			setJobs((prev) => prev.map((j) => (j._id === id ? res.data : j)));
			toast.success("Status updated");
		} catch (error) {
			toast.error(error.response?.data?.message || "Update failed");
		}
	};

	if (loading) return <div className="text-center text-white mt-20">Loading jobs...</div>;

	return (
		<div className="min-h-screen p-6">
			<motion.h1
				className="text-3xl font-bold text-emerald-400 mb-8 text-center"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
			>
				My Assigned Jobs
			</motion.h1>

			{jobs.length === 0 ? (
				<p className="text-center text-gray-400">No jobs assigned to you yet.</p>
			) : (
				<div className="max-w-4xl mx-auto space-y-4">
					{jobs.map((job) => (
						<div key={job._id} className="bg-gray-800 rounded-lg p-5 shadow">
							<div className="flex justify-between items-start flex-wrap gap-2">
								<div>
									<p className="text-white font-semibold text-lg">{job.service?.name}</p>
									<p className="text-gray-400 text-sm">Customer: {job.user?.name} ({job.user?.email})</p>
									<p className="text-gray-400 text-sm">Date: {job.date} at {job.time}</p>
									<p className="text-gray-400 text-sm">Address: {job.address}</p>
									<p className="text-gray-400 text-sm">Amount: ₹{job.totalAmount}</p>
									<span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${
										job.paymentMethod === "cash"
											? "bg-yellow-600/30 text-yellow-400"
											: "bg-emerald-600/30 text-emerald-400"
									}`}>
										{job.paymentMethod === "cash" ? "💵 Pay at Home" : "💳 Paid Online"}
									</span>
								</div>
								<span className={`text-white text-xs px-3 py-1 rounded-full ${STATUS_COLORS[job.status]}`}>
									{job.status}
								</span>
							</div>

							{job.status !== "completed" && job.status !== "cancelled" && (
								<div className="mt-4 flex gap-3">
									{job.status === "pending" && (
										<button
											onClick={() => updateStatus(job._id, "confirmed")}
											className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm"
										>
											Confirm Job
										</button>
									)}
									{job.status === "confirmed" && (
										<button
											onClick={() => updateStatus(job._id, "completed")}
											className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded text-sm"
										>
											Mark Completed
										</button>
									)}
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default TaskerDashboard;
