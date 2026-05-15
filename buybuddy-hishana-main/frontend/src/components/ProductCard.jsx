import toast from "react-hot-toast";
import { ShoppingCart, Heart } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useWishlistStore } from "../stores/useWishlistStore";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
	const { user } = useUserStore();
	const { addToCart } = useCartStore();
	const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
	const inWishlist = isInWishlist(product._id);
	const handleWishlist = (e) => {
		e.preventDefault();
		if (!user) {
			toast.error("Please login to add to wishlist", { id: "login" });
			return;
		}
		if (inWishlist) {
			removeFromWishlist(product._id);
		} else {
			addToWishlist(product);
		}
	};

	const handleAddToCart = () => {
		if (!user) {
			toast.error("Please login to add products to cart", { id: "login" });
			return;
		} else {
			// add to cart
			addToCart(product);
		}
	};

	return (
		<Link to={`/product/${product._id}`} className='flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg hover:shadow-emerald-500/50 transition-all'>
			<div className='relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl'>
				<img className='object-cover w-full' src={product.image} alt='product image' />
				<div className='absolute inset-0 bg-black bg-opacity-20' />
				<button
					onClick={handleWishlist}
					className='absolute top-2 right-2 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors z-10'
				>
					<Heart
						size={20}
						className={inWishlist ? 'text-red-500 fill-red-500' : 'text-gray-600'}
					/>
				</button>
			</div>

			<div className='mt-4 px-5 pb-5 flex flex-col flex-1 justify-between'>
				<h5 className='text-xl font-semibold tracking-tight text-white'>{product.name}</h5>
				<div>
					<div className='mt-2 mb-5 flex items-center justify-between'>
						<p>
							<span className='text-3xl font-bold text-emerald-400'>₹{product.price}</span>
						</p>
					</div>
					<button
						className='flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
						onClick={(e) => {
							e.preventDefault();
							handleAddToCart();
						}}
					>
						<ShoppingCart size={22} className='mr-2' />
						Add to cart
					</button>
				</div>
			</div>
		</Link>
	);
};
export default ProductCard;
