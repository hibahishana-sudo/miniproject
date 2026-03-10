import { Shield, Star, CheckCircle, AlertCircle } from "lucide-react";

const BlockchainReviews = ({ productId }) => {
	const reviews = [
		{
			id: 1,
			user: "John D.",
			rating: 5,
			comment: "Excellent quality! Exactly as described. Fast delivery too.",
			date: "2024-12-20",
			verified: true,
			blockchainHash: "0x8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d",
			purchaseDate: "2024-12-15"
		},
		{
			id: 2,
			user: "Sarah M.",
			rating: 4,
			comment: "Good product, slightly smaller than expected but overall satisfied.",
			date: "2024-12-18",
			verified: true,
			blockchainHash: "0x4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c",
			purchaseDate: "2024-12-10"
		},
		{
			id: 3,
			user: "Mike R.",
			rating: 5,
			comment: "Perfect! Will definitely buy again. Highly recommended!",
			date: "2024-12-22",
			verified: true,
			blockchainHash: "0x2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b",
			purchaseDate: "2024-12-18"
		}
	];

	const averageRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);
	const verifiedCount = reviews.filter(r => r.verified).length;

	return (
		<div className="bg-gray-800 rounded-lg p-6">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<div>
					<h2 className="text-2xl font-bold text-white mb-2">Customer Reviews</h2>
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<Star className="text-yellow-400 fill-yellow-400" size={24} />
							<span className="text-2xl font-bold text-white">{averageRating}</span>
							<span className="text-gray-400">({reviews.length} reviews)</span>
						</div>
						<div className="flex items-center gap-2 bg-emerald-900/30 px-3 py-1 rounded-full">
							<Shield className="text-emerald-400" size={16} />
							<span className="text-emerald-400 text-sm font-semibold">
								{verifiedCount} Blockchain Verified
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Blockchain Info Banner */}
			<div className="mb-6 bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-600 rounded-lg p-4">
				<div className="flex items-start gap-3">
					<Shield className="text-emerald-400 mt-1" size={24} />
					<div>
						<h3 className="text-emerald-400 font-semibold mb-1">100% Authentic Reviews</h3>
						<p className="text-gray-300 text-sm">
							All reviews are verified through blockchain technology. Only customers who purchased 
							this product can leave a review, preventing fake reviews and ensuring authenticity.
						</p>
					</div>
				</div>
			</div>

			{/* Reviews List */}
			<div className="space-y-4">
				{reviews.map((review) => (
					<div key={review.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
						{/* Review Header */}
						<div className="flex items-start justify-between mb-3">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
									{review.user.charAt(0)}
								</div>
								<div>
									<div className="flex items-center gap-2">
										<span className="text-white font-semibold">{review.user}</span>
										{review.verified && (
											<div className="flex items-center gap-1 bg-emerald-600 px-2 py-0.5 rounded-full">
												<CheckCircle size={12} className="text-white" />
												<span className="text-white text-xs font-semibold">Verified Purchase</span>
											</div>
										)}
									</div>
									<div className="flex items-center gap-2 mt-1">
										<div className="flex">
											{[...Array(5)].map((_, i) => (
												<Star
													key={i}
													size={14}
													className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}
												/>
											))}
										</div>
										<span className="text-gray-400 text-xs">{review.date}</span>
									</div>
								</div>
							</div>
						</div>

						{/* Review Content */}
						<p className="text-gray-300 mb-3">{review.comment}</p>

						{/* Blockchain Verification */}
						{review.verified && (
							<div className="bg-gray-800 rounded p-3 border border-emerald-600/30">
								<div className="flex items-center gap-2 mb-2">
									<Shield className="text-emerald-400" size={16} />
									<span className="text-emerald-400 text-sm font-semibold">Blockchain Verified</span>
								</div>
								<div className="space-y-1 text-xs">
									<div className="flex justify-between">
										<span className="text-gray-400">Purchase Date:</span>
										<span className="text-white">{review.purchaseDate}</span>
									</div>
									<div className="flex flex-col gap-1">
										<span className="text-gray-400">Transaction Hash:</span>
										<code className="text-emerald-400 bg-gray-900 p-1 rounded text-[10px] break-all">
											{review.blockchainHash}
										</code>
									</div>
								</div>
							</div>
						)}
					</div>
				))}
			</div>

			{/* Write Review Button */}
			<button className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
				<Star size={20} />
				Write a Verified Review
			</button>
		</div>
	);
};

export default BlockchainReviews;
