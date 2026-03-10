import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, ShoppingCart, Heart } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import { useWishlistStore } from "../stores/useWishlistStore";
import { useUserStore } from "../stores/useUserStore";
import toast from "react-hot-toast";

const SearchPage = () => {
	const [searchParams] = useSearchParams();
	const query = searchParams.get("q") || "";
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const { addToCart } = useCartStore();
	const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
	const { user } = useUserStore();

	useEffect(() => {
		const fetchProducts = async () => {
			setLoading(true);
			try {
				const response = await fetch("/api/products");
				if (!response.ok) {
					throw new Error('Failed to fetch');
				}
				const data = await response.json();
				
				if (data.products && data.products.length > 0) {
					// Filter products based on search query (case-insensitive)
					const searchLower = query.toLowerCase().trim();
					const filtered = data.products.filter((product) => {
						const nameMatch = product.name?.toLowerCase().includes(searchLower);
						const descMatch = product.description?.toLowerCase().includes(searchLower);
						const catMatch = product.category?.toLowerCase().includes(searchLower);
						return nameMatch || descMatch || catMatch;
					});
					setProducts(filtered);
				} else {
					setProducts([]);
				}
			} catch (error) {
				console.error("Error fetching products:", error);
				setProducts([]);
			} finally {
				setLoading(false);
			}
		};

		if (query) {
			fetchProducts();
		} else {
			setProducts([]);
			setLoading(false);
		}
	}, [query]);

	const handleAddToCart = (product) => {
		if (!user) {
			toast.error("Please login to add products to cart");
			return;
		}
		addToCart(product);
	};

	return (
		<div className="min-h-screen pt-20 px-4 pb-10">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-white mb-2">
						Search Results for "{query}"
					</h1>
					<p className="text-gray-400">
						{loading ? "Searching..." : `Found ${products.length} product(s)`}
					</p>
				</div>

				{loading ? (
					<div className="flex justify-center items-center h-64">
						<div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div>
					</div>
				) : products.length === 0 ? (
					<div className="text-center py-20">
						<Search className="w-24 h-24 text-gray-600 mx-auto mb-4" />
						<h2 className="text-2xl font-semibold text-gray-400 mb-2">
							No products found
						</h2>
						<p className="text-gray-500 mb-6">
							Try searching with different keywords
						</p>
						<Link
							to="/"
							className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg inline-block transition-colors"
						>
							Back to Home
						</Link>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{products.map((product) => (
							<Link
								key={product._id}
								to={`/product/${product._id}`}
								className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 group"
							>
								<div className="relative overflow-hidden h-64">
									<img
										src={product.image}
										alt={product.name}
										className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
									/>
									<div className="absolute top-2 right-2 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
										${product.price}
									</div>
									<button
										onClick={(e) => {
											e.preventDefault();
											if (!user) {
												toast.error("Please login");
												return;
											}
											if (isInWishlist(product._id)) {
												removeFromWishlist(product._id);
											} else {
												addToWishlist(product);
											}
										}}
										className="absolute top-2 left-2 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
									>
										<Heart
											size={18}
											className={isInWishlist(product._id) ? 'text-red-500 fill-red-500' : 'text-gray-600'}
										/>
									</button>
								</div>
								<div className="p-4">
									<h3 className="text-lg font-semibold text-white mb-2 truncate">
										{product.name}
									</h3>
									<p className="text-gray-400 text-sm mb-2 line-clamp-2">
										{product.description}
									</p>
									<div className="flex items-center justify-between">
										<span className="text-emerald-400 text-sm font-medium capitalize">
											{product.category}
										</span>
										<button
											onClick={(e) => {
												e.preventDefault();
												handleAddToCart(product);
											}}
											className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg transition-colors flex items-center gap-2"
										>
											<ShoppingCart size={18} />
											<span className="text-sm">Add</span>
										</button>
									</div>
								</div>
							</Link>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default SearchPage;
