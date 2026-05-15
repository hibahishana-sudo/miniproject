import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "../lib/axios";

// Maps each main category to its known subcategories
// New subcategories added via admin will auto-appear if they match the main category
const mainCategoryMap = {
	fashion: ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"],
	mobiles: ["mobiles", "smartphones", "feature-phones", "accessories"],
	beauty: ["beauty", "skincare", "haircare", "makeup", "perfumes"],
	electronics: ["electronics", "laptops", "cameras", "headphones", "tablets"],
	home: ["home", "kitchen", "decor", "bedding", "lighting"],
	appliances: ["appliances", "airfryer", "microwave", "washing-machine", "refrigerator", "ac", "fan", "mixer"],
	furniture: ["furniture", "sofa", "bed", "table", "chair", "wardrobe"],
	toys: ["toys", "board-games", "action-figures", "dolls", "puzzles"],
	food: ["food", "snacks", "beverages", "dairy", "organic"],
	sports: ["sports", "fitness", "cricket", "football", "yoga"],
	books: ["books", "fiction", "non-fiction", "academic", "comics"],
};

const SubcategoryPage = () => {
	const { category } = useParams();
	const navigate = useNavigate();
	const [subcategories, setSubcategories] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchSubcategories = async () => {
			setLoading(true);
			try {
				// Fetch all products and find unique categories that belong to this main category
				const res = await axios.get("/products");
				const allProducts = res.data.products || [];

				const knownSubs = mainCategoryMap[category?.toLowerCase()] || [];

				// Get unique categories from products that match known subcategories OR
				// whose category starts with / matches the main category
				const productCategories = [...new Set(allProducts.map((p) => p.category?.toLowerCase()))];

				// Include: known subcategories that have products + any product category that matches main category name
				const matchedSubs = productCategories.filter(
					(cat) => knownSubs.includes(cat) || cat === category?.toLowerCase()
				);

				// Also include known subs even if no products yet (show empty pages)
				const allSubs = [...new Set([...matchedSubs])];

				if (allSubs.length === 0) {
					// No subcategories found, go directly to products page
					navigate(`/products/${category}`, { replace: true });
					return;
				}

				// If only one sub and it matches the main category exactly, go to products
				if (allSubs.length === 1 && allSubs[0] === category?.toLowerCase()) {
					navigate(`/products/${category}`, { replace: true });
					return;
				}

				// Build subcategory objects with product count and first product image
				const subData = allSubs.map((sub) => {
					const subProducts = allProducts.filter((p) => p.category?.toLowerCase() === sub);
					return {
						name: sub.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
						slug: sub,
						count: subProducts.length,
						image: subProducts[0]?.image || null,
					};
				});

				setSubcategories(subData);
			} catch (error) {
				console.error(error);
				navigate(`/products/${category}`, { replace: true });
			} finally {
				setLoading(false);
			}
		};

		fetchSubcategories();
	}, [category, navigate]);

	if (loading) {
		return (
			<div className="min-h-screen pt-20 flex justify-center items-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500" />
			</div>
		);
	}

	return (
		<div className="min-h-screen pt-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
				<button
					onClick={() => navigate(-1)}
					className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-6 transition-colors"
				>
					<ArrowLeft size={20} /><span>Back</span>
				</button>

				<motion.h1
					className="text-4xl sm:text-5xl font-bold text-emerald-400 mb-2 capitalize"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					{category}
				</motion.h1>
				<p className="text-gray-400 mb-10">Browse by subcategory</p>

				<motion.div
					className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
				>
					{subcategories.map((sub) => (
						<Link
							key={sub.slug}
							to={`/products/${sub.slug}`}
							className="group relative overflow-hidden rounded-xl bg-gray-800 hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300"
						>
							<div className="aspect-square overflow-hidden bg-gray-700">
								{sub.image ? (
									<img
										src={sub.image}
										alt={sub.name}
										className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center text-gray-500 text-4xl">
										🛍️
									</div>
								)}
							</div>
							<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col items-center justify-end pb-4 px-2">
								<h3 className="text-white font-semibold text-base text-center">{sub.name}</h3>
								<p className="text-emerald-400 text-xs mt-1">{sub.count} {sub.count === 1 ? "product" : "products"}</p>
							</div>
						</Link>
					))}
				</motion.div>
			</div>
		</div>
	);
};

export default SubcategoryPage;
