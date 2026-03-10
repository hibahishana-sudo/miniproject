import { useState } from "react";
import { Package, Truck, CheckCircle, Clock, Link as LinkIcon, Shield } from "lucide-react";

const BlockchainOrderTracker = ({ orderId = "ORD-12345" }) => {
	const [selectedBlock, setSelectedBlock] = useState(null);

	const blocks = [
		{
			id: 1,
			status: "Order Placed",
			timestamp: "2024-12-25 10:30 AM",
			hash: "0x7f9a8b3c2d1e4f5a6b7c8d9e0f1a2b3c",
			prevHash: "0x0000000000000000000000000000000",
			icon: Package,
			verified: true,
			details: "Order confirmed and payment received"
		},
		{
			id: 2,
			status: "Processing",
			timestamp: "2024-12-25 11:15 AM",
			hash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f",
			prevHash: "0x7f9a8b3c2d1e4f5a6b7c8d9e0f1a2b3c",
			icon: Clock,
			verified: true,
			details: "Order is being prepared for shipment"
		},
		{
			id: 3,
			status: "Shipped",
			timestamp: "2024-12-25 02:30 PM",
			hash: "0x9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
			prevHash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f",
			icon: Truck,
			verified: true,
			details: "Package handed to courier service"
		},
		{
			id: 4,
			status: "Delivered",
			timestamp: "2024-12-27 04:45 PM",
			hash: "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
			prevHash: "0x9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
			icon: CheckCircle,
			verified: true,
			details: "Successfully delivered to customer"
		}
	];

	return (
		<div className="bg-gray-800 rounded-lg p-6">
			<div className="flex items-center gap-3 mb-6">
				<Shield className="text-emerald-400" size={28} />
				<div>
					<h2 className="text-2xl font-bold text-white">Blockchain Order Tracking</h2>
					<p className="text-gray-400 text-sm">Order ID: {orderId}</p>
				</div>
			</div>

			{/* Blockchain Visualization */}
			<div className="relative">
				<div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-4">
					{blocks.map((block, index) => (
						<div key={block.id} className="flex items-center">
							<div
								onClick={() => setSelectedBlock(block)}
								className={`min-w-[200px] bg-gradient-to-br from-gray-700 to-gray-800 border-2 rounded-lg p-4 cursor-pointer transition-all hover:scale-105 ${
									selectedBlock?.id === block.id
										? "border-emerald-500 shadow-lg shadow-emerald-500/50"
										: "border-gray-600"
								}`}
							>
								<div className="flex items-center justify-between mb-3">
									<block.icon className="text-emerald-400" size={24} />
									{block.verified && (
										<div className="flex items-center gap-1 bg-emerald-600 px-2 py-1 rounded-full">
											<Shield size={12} className="text-white" />
											<span className="text-white text-xs font-semibold">Verified</span>
										</div>
									)}
								</div>
								<h3 className="text-white font-semibold mb-1">{block.status}</h3>
								<p className="text-gray-400 text-xs mb-2">{block.timestamp}</p>
								<div className="flex items-center gap-1 text-emerald-400 text-xs">
									<LinkIcon size={12} />
									<span className="truncate">Block #{block.id}</span>
								</div>
							</div>
							{index < blocks.length - 1 && (
								<div className="hidden md:block w-8 h-0.5 bg-emerald-500 mx-2"></div>
							)}
						</div>
					))}
				</div>
			</div>

			{/* Block Details */}
			{selectedBlock && (
				<div className="mt-6 bg-gray-700 rounded-lg p-4 border border-emerald-500">
					<h3 className="text-white font-semibold mb-3 flex items-center gap-2">
						<LinkIcon className="text-emerald-400" size={18} />
						Block Details
					</h3>
					<div className="space-y-2 text-sm">
						<div className="flex justify-between">
							<span className="text-gray-400">Status:</span>
							<span className="text-white font-semibold">{selectedBlock.status}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-400">Timestamp:</span>
							<span className="text-white">{selectedBlock.timestamp}</span>
						</div>
						<div className="flex flex-col gap-1">
							<span className="text-gray-400">Block Hash:</span>
							<code className="text-emerald-400 text-xs bg-gray-800 p-2 rounded break-all">
								{selectedBlock.hash}
							</code>
						</div>
						<div className="flex flex-col gap-1">
							<span className="text-gray-400">Previous Hash:</span>
							<code className="text-gray-500 text-xs bg-gray-800 p-2 rounded break-all">
								{selectedBlock.prevHash}
							</code>
						</div>
						<div className="flex flex-col gap-1">
							<span className="text-gray-400">Details:</span>
							<span className="text-white">{selectedBlock.details}</span>
						</div>
					</div>
				</div>
			)}

			{/* Blockchain Info */}
			<div className="mt-6 bg-emerald-900/20 border border-emerald-600 rounded-lg p-4">
				<div className="flex items-start gap-3">
					<Shield className="text-emerald-400 mt-1" size={20} />
					<div>
						<h4 className="text-emerald-400 font-semibold mb-1">Blockchain Verified</h4>
						<p className="text-gray-300 text-sm">
							This order is tracked on our secure blockchain network. All updates are immutable and 
							cryptographically verified, ensuring complete transparency and authenticity.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BlockchainOrderTracker;
