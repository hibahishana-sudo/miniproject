import { Link } from "react-router-dom";
import { Shirt, Smartphone, Sparkles, Laptop, Home, Zap, Sofa, Baby, UtensilsCrossed, Dumbbell, BookOpen } from "lucide-react";

const categories = [
	{ name: "Fashion", icon: Shirt, path: "/category/fashion" },
	{ name: "Mobiles", icon: Smartphone, path: "/category/mobiles" },
	{ name: "Beauty", icon: Sparkles, path: "/category/beauty" },
	{ name: "Electronics", icon: Laptop, path: "/category/electronics" },
	{ name: "Home", icon: Home, path: "/category/home" },
	{ name: "Appliances", icon: Zap, path: "/category/appliances" },
	{ name: "Furniture", icon: Sofa, path: "/category/furniture" },
	{ name: "Toys", icon: Baby, path: "/category/toys" },
	{ name: "Food", icon: UtensilsCrossed, path: "/category/food" },
	{ name: "Sports", icon: Dumbbell, path: "/category/sports" },
	{ name: "Books", icon: BookOpen, path: "/category/books" },
];

const HorizontalCategories = () => {
	return (
		<div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-3 mb-6 shadow-lg border-y border-gray-700">
			<div className="max-w-7xl mx-auto px-4">
				<div 
					className="flex gap-8 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-emerald-600 scrollbar-track-gray-700" 
					style={{ scrollBehavior: 'smooth' }}
				>
					{categories.map((category) => (
						<Link
							key={category.name}
							to={category.path}
							className="flex flex-col items-center min-w-[80px] group cursor-pointer"
						>
							<div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center mb-2 group-hover:from-emerald-600 group-hover:to-emerald-700 transition-all duration-300 shadow-md group-hover:shadow-emerald-500/50 group-hover:scale-110">
								<category.icon className="w-7 h-7 text-emerald-400 group-hover:text-white transition-colors" />
							</div>
							<span className="text-xs font-medium text-gray-300 text-center group-hover:text-emerald-400 transition-colors">
								{category.name}
							</span>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default HorizontalCategories;
