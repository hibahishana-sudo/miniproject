import { useEffect, useState } from "react";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";
import HeroCarousel from "../components/HeroCarousel";
import HorizontalCategories from "../components/HorizontalCategories";
import { ShoppingCart, Heart, Tag, Zap, Truck, Gift } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";
import { useWishlistStore } from "../stores/useWishlistStore";
import { Link } from "react-router-dom";
import axios from "../lib/axios";

/* ── single product card ── */
const ProductCard = ({ product }) => {
	const { addToCart } = useCartStore();
	const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
	const inWishlist = isInWishlist(product._id);
	const discount = product.originalPrice
		? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
		: null;

	return (
		<div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all group flex-shrink-0 w-44 sm:w-48">
			<Link to={`/product/${product._id}`} className="block relative">
				<img src={product.image} alt={product.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
				{discount && (
					<span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
						{discount}% OFF
					</span>
				)}
				<button
					onClick={(e) => {
						e.preventDefault();
						inWishlist ? removeFromWishlist(product._id) : addToWishlist(product);
					}}
					className="absolute top-2 right-2 p-1.5 bg-white rounded-full hover:bg-gray-100 transition-colors"
				>
					<Heart size={14} className={inWishlist ? "text-red-500 fill-red-500" : "text-gray-500"} />
				</button>
			</Link>
			<div className="p-3">
				<p className="text-white text-sm font-medium truncate">{product.name}</p>
				<div className="flex items-center gap-2 mt-1">
					<span className="text-emerald-400 font-bold text-sm">₹{product.price}</span>
					{product.originalPrice && (
						<span className="text-gray-500 text-xs line-through">₹{product.originalPrice}</span>
					)}
				</div>
				<button
					onClick={() => addToCart(product)}
					className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors"
				>
					<ShoppingCart size={13} /> Add to Cart
				</button>
			</div>
		</div>
	);
};

/* ── horizontal scrollable product row ── */
const ProductRow = ({ title, products }) => {
	if (!products || products.length === 0) return null;
	return (
		<div className="mb-10">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xl font-bold text-white capitalize">{title}</h2>
				<Link
					to={`/products/${title.toLowerCase()}`}
					className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
				>
					View All →
				</Link>
			</div>
			<div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-emerald-600 scrollbar-track-gray-800">
				{products.map((p) => <ProductCard key={p._id} product={p} />)}
			</div>
		</div>
	);
};

/* ── discount ad banners ── */
const ads = [
	{
		bg: "from-purple-900 via-purple-800 to-indigo-900",
		icon: Zap,
		iconColor: "text-yellow-400",
		badge: "FLASH SALE",
		badgeBg: "bg-yellow-400 text-black",
		title: "Up to 60% Off",
		subtitle: "On Electronics & Gadgets — Today Only!",
		cta: "Shop Now",
		ctaBg: "bg-yellow-400 hover:bg-yellow-300 text-black",
		link: "/category/electronics",
	},
	{
		bg: "from-rose-900 via-pink-800 to-red-900",
		icon: Gift,
		iconColor: "text-pink-300",
		badge: "SPECIAL OFFER",
		badgeBg: "bg-pink-400 text-white",
		title: "Buy 2 Get 1 Free",
		subtitle: "On Fashion & Apparel — Limited Stock!",
		cta: "Grab Deal",
		ctaBg: "bg-white hover:bg-gray-100 text-pink-700",
		link: "/category/fashion",
	},
	{
		bg: "from-emerald-900 via-teal-800 to-cyan-900",
		icon: Truck,
		iconColor: "text-cyan-300",
		badge: "FREE DELIVERY",
		badgeBg: "bg-cyan-400 text-black",
		title: "Free Shipping",
		subtitle: "On All Orders Above ₹499 — No Code Needed!",
		cta: "Start Shopping",
		ctaBg: "bg-cyan-400 hover:bg-cyan-300 text-black",
		link: "/",
	},
	{
		bg: "from-orange-900 via-amber-800 to-yellow-900",
		icon: Tag,
		iconColor: "text-orange-300",
		badge: "CLEARANCE",
		badgeBg: "bg-orange-400 text-white",
		title: "Flat ₹200 Off",
		subtitle: "On Orders Above ₹999 — Use Code SAVE200",
		cta: "Claim Offer",
		ctaBg: "bg-orange-400 hover:bg-orange-300 text-white",
		link: "/",
	},
];

const AdBanner = ({ ad }) => {
	const Icon = ad.icon;
	return (
		<div className={`bg-gradient-to-r ${ad.bg} rounded-2xl p-6 mb-10 flex items-center justify-between flex-wrap gap-4 shadow-lg`}>
			<div className="flex items-center gap-4">
				<div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center">
					<Icon size={28} className={ad.iconColor} />
				</div>
				<div>
					<span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ad.badgeBg}`}>{ad.badge}</span>
					<h3 className="text-white text-2xl font-bold mt-1">{ad.title}</h3>
					<p className="text-gray-300 text-sm">{ad.subtitle}</p>
				</div>
			</div>
			<Link
				to={ad.link}
				className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-colors ${ad.ctaBg}`}
			>
				{ad.cta}
			</Link>
		</div>
	);
};

/* ── HomePage ── */
const HomePage = () => {
	const { fetchRandomProducts, products, isLoading } = useProductStore();
	const [allProducts, setAllProducts] = useState([]);

	useEffect(() => {
		fetchRandomProducts();
		// fetch all products to build category rows
		axios.get("/products").then((res) => setAllProducts(res.data.products || [])).catch(() => {});
	}, []);

	// group products by category, max 10 per row
	const byCategory = allProducts.reduce((acc, p) => {
		const cat = p.category || "Other";
		if (!acc[cat]) acc[cat] = [];
		if (acc[cat].length < 10) acc[cat].push(p);
		return acc;
	}, {});

	const categoryEntries = Object.entries(byCategory);

	// interleave ad banners every 2 category rows
	const sections = [];
	categoryEntries.forEach(([cat, prods], i) => {
		sections.push({ type: "row", cat, prods });
		if ((i + 1) % 2 === 0 && i < categoryEntries.length - 1) {
			sections.push({ type: "ad", ad: ads[Math.floor(i / 2) % ads.length] });
		}
	});

	return (
		<div className="relative min-h-screen text-white overflow-hidden">
			<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<HeroCarousel />
			</div>

			<HorizontalCategories />

			<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">

				{/* Featured carousel */}
				{!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}

				{/* First ad banner right after featured */}
				<AdBanner ad={ads[0]} />

				{/* Category rows with ads interleaved */}
				{sections.map((s, i) =>
					s.type === "row" ? (
						<ProductRow key={s.cat} title={s.cat} products={s.prods} />
					) : (
						<AdBanner key={`ad-${i}`} ad={s.ad} />
					)
				)}

				{/* Final ad banner */}
				{categoryEntries.length > 0 && <AdBanner ad={ads[3]} />}
			</div>
		</div>
	);
};

export default HomePage;
