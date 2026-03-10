import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HeroCarousel = () => {
	const [currentSlide, setCurrentSlide] = useState(0);

	const slides = [
		{
			type: "image",
			url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=500&fit=crop",
			title: "Summer Collection 2024",
			subtitle: "Up to 50% Off on Selected Items",
			cta: "Shop Now"
		},
		{
			type: "image",
			url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=500&fit=crop",
			title: "New Arrivals",
			subtitle: "Discover the Latest Fashion Trends",
			cta: "Explore"
		},
		{
			type: "image",
			url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=500&fit=crop",
			title: "Premium Quality",
			subtitle: "Handpicked Products Just for You",
			cta: "Browse"
		},
		{
			type: "image",
			url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=500&fit=crop",
			title: "Exclusive Deals",
			subtitle: "Limited Time Offers",
			cta: "Get Deals"
		}
	];

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % slides.length);
		}, 5000);
		return () => clearInterval(timer);
	}, [slides.length]);

	const nextSlide = () => {
		setCurrentSlide((prev) => (prev + 1) % slides.length);
	};

	const prevSlide = () => {
		setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
	};

	return (
		<div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-lg mb-8 group">
			{slides.map((slide, index) => (
				<div
					key={index}
					className={`absolute inset-0 transition-opacity duration-1000 ${
						index === currentSlide ? "opacity-100" : "opacity-0"
					}`}
				>
					{slide.type === "image" ? (
						<img
							src={slide.url}
							alt={slide.title}
							className="w-full h-full object-cover"
						/>
					) : (
						<video
							src={slide.url}
							autoPlay
							muted
							loop
							className="w-full h-full object-cover"
						/>
					)}
					
					{/* Overlay */}
					<div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
						<div className="max-w-7xl mx-auto px-8 md:px-16">
							<h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
								{slide.title}
							</h2>
							<p className="text-xl md:text-2xl text-gray-200 mb-6">
								{slide.subtitle}
							</p>
							<button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300">
								{slide.cta}
							</button>
						</div>
					</div>
				</div>
			))}

			{/* Navigation Buttons */}
			<button
				onClick={prevSlide}
				className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
			>
				<ChevronLeft className="w-6 h-6 text-white" />
			</button>
			<button
				onClick={nextSlide}
				className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
			>
				<ChevronRight className="w-6 h-6 text-white" />
			</button>

			{/* Dots Indicator */}
			<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
				{slides.map((_, index) => (
					<button
						key={index}
						onClick={() => setCurrentSlide(index)}
						className={`w-3 h-3 rounded-full transition-all ${
							index === currentSlide
								? "bg-emerald-500 w-8"
								: "bg-white/50 hover:bg-white/80"
						}`}
					/>
				))}
			</div>
		</div>
	);
};

export default HeroCarousel;
