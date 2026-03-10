import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, Truck, RefreshCw, Star, ChevronRight, Package, Shield, Heart } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import { useWishlistStore } from "../stores/useWishlistStore";
import toast from "react-hot-toast";
import BlockchainReviews from "../components/BlockchainReviews";

const ProductDetailPage = () => {
	const { id } = useParams();
	const [product, setProduct] = useState(null);
	const [similarProducts, setSimilarProducts] = useState([]);
	const [selectedSize, setSelectedSize] = useState("");
	const [loading, setLoading] = useState(true);
	const { addToCart } = useCartStore();
	const { user } = useUserStore();
	const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
	const inWishlist = isInWishlist(id);

	console.log("Product ID from URL:", id);

	const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
	const deliveryDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
		weekday: 'short', 
		month: 'short', 
		day: 'numeric' 
	});

	useEffect(() => {
		const fetchProduct = async () => {
			setLoading(true);
			try {
				const response = await fetch("/api/products");
				if (!response.ok) {
					throw new Error('Failed to fetch products');
				}
				const data = await response.json();
				
				if (!data.products || data.products.length === 0) {
					setProduct(null);
					setSimilarProducts([]);
					return;
				}
				
				const foundProduct = data.products.find(p => p._id === id);
				setProduct(foundProduct || null);

				// Get similar products from same category
				if (foundProduct) {
					const similar = data.products
						.filter(p => p.category === foundProduct.category && p._id !== id)
						.slice(0, 4);
					setSimilarProducts(similar);
				}
			} catch (error) {
				console.error("Error:", error);
				// Don't show error toast, just set product to null
				setProduct(null);
			} finally {
				setLoading(false);
			}
		};
		fetchProduct();
	}, [id]);

	const handleAddToCart = () => {
		if (!user) {
			toast.error("Please login to add to cart");
			return;
		}
		if (!selectedSize) {
			toast.error("Please select a size");
			return;
		}
		addToCart(product);
		toast.success("Added to cart!");
	};

	const handleWishlist = () => {
		if (!user) {
			toast.error("Please login to add to wishlist");
			return;
		}
		if (inWishlist) {
			removeFromWishlist(product._id);
		} else {
			addToWishlist(product);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen pt-20 flex justify-center items-center">
				<div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div>
			</div>
		);
	}

	if (!product) {
		return (
			<div className="min-h-screen pt-20 text-center">
				<h2 className="text-2xl text-white">Product not found</h2>
			</div>
		);
	}

	return (
		<div className="min-h-screen pt-20 px-4 pb-10">
			<div className="max-w-7xl mx-auto">
				{/* Breadcrumb */}
				<div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
					<Link to="/" className="hover:text-emerald-400">Home</Link>
					<ChevronRight size={16} />
					<Link to={`/category/${product.category}`} className="hover:text-emerald-400 capitalize">{product.category}</Link>
					<ChevronRight size={16} />
					<span className="text-white">{product.name}</span>
				</div>

				<div className="grid md:grid-cols-2 gap-8 mb-12">
					{/* Product Image */}
					<div className="bg-gray-800 rounded-lg overflow-hidden">
						<img src={product.image} alt={product.name} className="w-full h-[600px] object-cover" />
					</div>

					{/* Product Details */}
					<div className="space-y-6">
						<div>
							<h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
							<p className="text-gray-400 capitalize">{product.category}</p>
						</div>

						{/* Price & Rating */}
						<div className="flex items-center gap-4">
							<span className="text-3xl font-bold text-emerald-400">₹{product.price}</span>
							<div className="flex items-center gap-1 bg-emerald-600 px-2 py-1 rounded">
								<Star size={16} fill="white" className="text-white" />
								<span className="text-white font-semibold">4.5</span>
							</div>
							<span className="text-gray-400">(234 reviews)</span>
						</div>

						{/* Offers */}
						<div className="bg-emerald-900/30 border border-emerald-600 rounded-lg p-4">
							<h3 className="text-emerald-400 font-semibold mb-2">🎉 Special Offers</h3>
							<ul className="text-sm text-gray-300 space-y-1">
								<li>• Get 10% off on orders above ₹1000</li>
								<li>• Free shipping on this product</li>
								<li>• Buy 2 Get 1 Free on selected items</li>
							</ul>
						</div>

						{/* Size Selection */}
						<div>
							<h3 className="text-white font-semibold mb-3">SELECT SIZE</h3>
							<div className="flex gap-3">
								{sizes.map((size) => (
									<button
										key={size}
										onClick={() => setSelectedSize(size)}
										className={`w-14 h-14 rounded-full border-2 font-semibold transition-all ${
											selectedSize === size
												? "border-emerald-500 bg-emerald-500 text-white"
												: "border-gray-600 text-gray-400 hover:border-emerald-400"
										}`}
									>
										{size}
									</button>
								))}
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex gap-3">
							<button
								onClick={handleAddToCart}
								className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
							>
								<ShoppingCart size={20} />
								ADD TO CART
							</button>
							<button
								onClick={handleWishlist}
								className={`p-4 rounded-lg font-semibold transition-colors ${
									inWishlist 
										? 'bg-red-600 hover:bg-red-700 text-white' 
										: 'bg-gray-700 hover:bg-gray-600 text-white'
								}`}
							>
								<Heart size={20} className={inWishlist ? 'fill-white' : ''} />
							</button>
						</div>

						{/* Delivery Info */}
						<div className="border-t border-gray-700 pt-6 space-y-4">
							<h3 className="text-white font-semibold">DELIVERY OPTIONS</h3>
							<div className="flex items-start gap-3">
								<Truck className="text-emerald-400 mt-1" size={20} />
								<div>
									<p className="text-white font-medium">Get it by {deliveryDate}</p>
									<p className="text-sm text-gray-400">Free delivery on orders above ₹500</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<Package className="text-emerald-400 mt-1" size={20} />
								<div>
									<p className="text-white font-medium">Cash on Delivery Available</p>
									<p className="text-sm text-gray-400">Pay when you receive</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<RefreshCw className="text-emerald-400 mt-1" size={20} />
								<div>
									<p className="text-white font-medium">Easy 30 Days Return & Exchange</p>
									<p className="text-sm text-gray-400">Return within 30 days of delivery</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<Shield className="text-emerald-400 mt-1" size={20} />
								<div>
									<p className="text-white font-medium">100% Original Products</p>
									<p className="text-sm text-gray-400">Authentic & quality assured</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Product Description */}
				<div className="bg-gray-800 rounded-lg p-6 mb-8">
					<h2 className="text-2xl font-bold text-white mb-4">Product Details</h2>
					<p className="text-gray-300 leading-relaxed">{product.description}</p>
					<div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
						<div>
							<span className="text-gray-400">Material:</span>
							<span className="text-white ml-2">Premium Cotton Blend</span>
						</div>
						<div>
							<span className="text-gray-400">Care:</span>
							<span className="text-white ml-2">Machine Wash</span>
						</div>
						<div>
							<span className="text-gray-400">Fit:</span>
							<span className="text-white ml-2">Regular Fit</span>
						</div>
						<div>
							<span className="text-gray-400">Country of Origin:</span>
							<span className="text-white ml-2">USA</span>
						</div>
					</div>
				</div>

				{/* Customer Reviews */}
				<BlockchainReviews productId={id} />

				{/* Similar Products */}
				{similarProducts.length > 0 && (
					<div>
						<h2 className="text-2xl font-bold text-white mb-6">Similar Products</h2>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{similarProducts.map((item) => (
								<Link
									key={item._id}
									to={`/product/${item._id}`}
									className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-emerald-500/50 transition-all group"
								>
									<img
										src={item.image}
										alt={item.name}
										className="w-full h-48 object-cover group-hover:scale-110 transition-transform"
									/>
									<div className="p-3">
										<h3 className="text-white font-semibold truncate">{item.name}</h3>
										<p className="text-emerald-400 font-bold">₹{item.price}</p>
									</div>
								</Link>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ProductDetailPage;
