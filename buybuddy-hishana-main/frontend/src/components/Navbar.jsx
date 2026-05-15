import { ShoppingCart, UserPlus, LogIn, LogOut, Lock, ShoppingBag, Search, User, Wrench } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useState } from "react";

const Navbar = () => {
	const { user, logout } = useUserStore();
	const isAdmin = user?.role === "admin";
	const isTasker = user?.role === "tasker";
	const { cart } = useCartStore();
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");

	const handleSearch = (e) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
			setSearchQuery("");
		}
	};

	return (
		<header className='fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800'>
			<div className='container mx-auto px-4 py-3'>
				<div className='flex flex-wrap justify-between items-center gap-4'>
					<Link to='/' className='flex items-center space-x-2 group'>
						<div className='relative'>
							<ShoppingBag className='w-8 h-8 text-emerald-400 group-hover:text-emerald-300 transition-colors' />
							<div className='absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse'></div>
						</div>
						<span className='text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:to-emerald-500 transition-all'>
							BUYBUDDY
						</span>
					</Link>

					{/* Search Bar */}
					<form onSubmit={handleSearch} className='flex-1 max-w-xl mx-4'>
						<div className='relative'>
							<input
								type='text'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder='Search for products...'
								className='w-full py-2 pl-4 pr-12 bg-gray-800 text-white rounded-full border border-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all'
							/>
							<button
								type='submit'
								className='absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 p-2 rounded-full transition-colors'
							>
								<Search size={18} className='text-white' />
							</button>
						</div>
					</form>

					<nav className='flex flex-wrap items-center gap-4'>
						<Link to="/" className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'>Home</Link>
						<Link to="/services" className='flex items-center gap-1 text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'>
							<Wrench size={18} /><span className="hidden sm:inline">Services</span>
						</Link>
						{user && (
							<Link
								to={"/cart"}
								className='relative group text-gray-300 hover:text-emerald-400 transition duration-300 
							ease-in-out'
							>
								<ShoppingCart className='inline-block mr-1 group-hover:text-emerald-400' size={20} />
								<span className='hidden sm:inline'>Cart</span>
								{cart.length > 0 && (
									<span
										className='absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 
									text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out'
									>
										{cart.length}
									</span>
								)}
							</Link>
						)}
						{isAdmin && (
							<Link
								className='bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium
								 transition duration-300 ease-in-out flex items-center'
								to={"/secret-dashboard"}
							>
								<Lock className='inline-block mr-1' size={18} />
								<span className='hidden sm:inline'>Dashboard</span>
							</Link>
						)}
						{isTasker && (
							<Link
								className='bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center'
								to="/tasker-dashboard"
							>
								<Wrench className='inline-block mr-1' size={18} />
								<span className='hidden sm:inline'>My Jobs</span>
							</Link>
						)}

						{user ? (
							<>
								<Link
									to="/profile"
									className="flex items-center gap-2 text-gray-300 hover:text-emerald-400 transition duration-300"
								>
									<User size={20} />
									<span className="hidden sm:inline">Profile</span>
								</Link>
								<button
									className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
							rounded-md flex items-center transition duration-300 ease-in-out'
									onClick={logout}
								>
									<LogOut size={18} />
									<span className='hidden sm:inline ml-2'>Log Out</span>
								</button>
							</>
						) : (
							<>
								<Link
									to={"/signup"}
									className='bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out'
								>
									<UserPlus className='mr-2' size={18} />
									Sign Up
								</Link>
								<Link
									to={"/login"}
									className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out'
								>
									<LogIn className='mr-2' size={18} />
									Login
								</Link>
							</>
						)}
					</nav>
				</div>
			</div>
		</header>
	);
};
export default Navbar;
