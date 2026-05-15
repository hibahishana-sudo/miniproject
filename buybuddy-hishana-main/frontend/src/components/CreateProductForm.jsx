import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Loader, X, Link } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const defaultCategories = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags", "mobiles", "beauty", "electronics", "home", "appliances", "airfryer", "microwave", "washing-machine", "refrigerator", "furniture", "toys", "food", "sports", "books"];

const mainCategoryMap = {
	fashion: ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"],
	mobiles: ["mobiles", "smartphones", "accessories"],
	beauty: ["beauty", "skincare", "haircare", "makeup"],
	electronics: ["electronics", "laptops", "cameras", "headphones", "tablets"],
	home: ["home", "kitchen", "decor", "bedding"],
	appliances: ["appliances", "airfryer", "microwave", "washing-machine", "refrigerator", "ac", "fan", "mixer"],
	furniture: ["furniture", "sofa", "bed", "table", "chair"],
	toys: ["toys", "board-games", "action-figures", "dolls"],
	food: ["food", "snacks", "beverages", "dairy"],
	sports: ["sports", "fitness", "cricket", "football"],
	books: ["books", "fiction", "non-fiction", "academic"],
};

const getMainCategory = (cat) => {
	for (const [main, subs] of Object.entries(mainCategoryMap)) {
		if (subs.includes(cat)) return main;
	}
	return "other";
};

const getStoredCategories = () => {
	try {
		const stored = localStorage.getItem("productCategories");
		return stored ? JSON.parse(stored) : defaultCategories;
	} catch { return defaultCategories; }
};

const CreateProductForm = () => {
	const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "", category: "", image: "" });
	const [categories, setCategories] = useState(getStoredCategories);
	const [newCategory, setNewCategory] = useState("");
	const [showCatInput, setShowCatInput] = useState(false);
	const { createProduct, loading } = useProductStore();

	const handleAddCategory = () => {
		const trimmed = newCategory.trim().toLowerCase();
		if (!trimmed || categories.includes(trimmed)) return;
		const updated = [...categories, trimmed];
		setCategories(updated);
		localStorage.setItem("productCategories", JSON.stringify(updated));
		setNewCategory("");
		setShowCatInput(false);
	};

	const handleRemoveCategory = (cat) => {
		const updated = categories.filter(c => c !== cat);
		setCategories(updated);
		localStorage.setItem("productCategories", JSON.stringify(updated));
		if (newProduct.category === cat) setNewProduct({ ...newProduct, category: "" });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await createProduct(newProduct);
			setNewProduct({ name: "", description: "", price: "", category: "", image: "" });
		} catch {
			console.log("error creating a product");
		}
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => setNewProduct({ ...newProduct, image: reader.result });
			reader.readAsDataURL(file);
		}
	};

	return (
		<motion.div
			className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<h2 className='text-2xl font-semibold mb-6 text-emerald-300'>Create New Product</h2>

			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label htmlFor='name' className='block text-sm font-medium text-gray-300'>Product Name</label>
					<input type='text' id='name' name='name' value={newProduct.name}
						onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
						required />
				</div>

				<div>
					<label htmlFor='description' className='block text-sm font-medium text-gray-300'>Description</label>
					<textarea id='description' name='description' value={newProduct.description}
						onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
						rows='3'
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
						required />
				</div>

				<div>
					<label htmlFor='price' className='block text-sm font-medium text-gray-300'>Price (₹)</label>
					<input type='text' id='price' name='price' value={newProduct.price}
						onChange={(e) => { const v = e.target.value; if (v === '' || /^[0-9]+$/.test(v)) setNewProduct({ ...newProduct, price: v }); }}
						inputMode='numeric' pattern='[0-9]*' placeholder='Enter price in rupees'
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
						required />
				</div>

				<div>
					<div className='flex items-center justify-between mb-1'>
						<label htmlFor='category' className='block text-sm font-medium text-gray-300'>Category</label>
						<button type='button' onClick={() => setShowCatInput(!showCatInput)}
							className='text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors'>
							<PlusCircle size={14} /> Add Category
						</button>
					</div>

					{showCatInput && (
						<div className='flex gap-2 mb-2'>
							<input type='text' value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
								onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
								placeholder='New category name'
								className='flex-1 bg-gray-700 border border-gray-600 rounded-md py-1.5 px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500' />
							<button type='button' onClick={handleAddCategory}
								className='bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md text-sm transition-colors'>Add</button>
						</div>
					)}

					<select id='category' name='category' value={newProduct.category}
						onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
						required>
						<option value=''>Select a category</option>
						{Object.entries(mainCategoryMap).map(([main, subs]) => {
							const available = categories.filter(c => subs.includes(c));
							if (available.length === 0) return null;
							return (
								<optgroup key={main} label={`── ${main.toUpperCase()} ──`}>
									{available.map(cat => <option key={cat} value={cat}>{cat}</option>)}
								</optgroup>
							);
						})}
						{categories.filter(c => getMainCategory(c) === "other").length > 0 && (
							<optgroup label='── OTHER ──'>
								{categories.filter(c => getMainCategory(c) === "other").map(cat => (
									<option key={cat} value={cat}>{cat}</option>
								))}
							</optgroup>
						)}
					</select>

					<div className='flex flex-wrap gap-2 mt-2'>
						{categories.filter(c => !defaultCategories.includes(c)).map(cat => (
							<span key={cat} className='flex items-center gap-1 bg-emerald-900/40 text-emerald-400 text-xs px-2 py-1 rounded-full'>
								{cat}
								<button type='button' onClick={() => handleRemoveCategory(cat)} className='hover:text-red-400 transition-colors'><X size={12} /></button>
							</span>
						))}
					</div>
				</div>

				<div>
					<label className='block text-sm font-medium text-gray-300'>Image URL</label>
					<div className='flex gap-2 mt-1'>
						<div className='relative flex-1'>
							<Link size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
							<input
								type='text'
								value={newProduct.image}
								onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
								placeholder='Paste image URL here...'
								className='w-full bg-gray-700 border border-gray-600 rounded-md py-2 pl-9 pr-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
								required
							/>
						</div>
						{newProduct.image && (
							<button type='button' onClick={() => setNewProduct({ ...newProduct, image: '' })}
								className='p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-400 hover:text-red-400 transition-colors'>
								<X size={16} />
							</button>
						)}
					</div>
					{newProduct.image && (
						<div className='mt-2 rounded-md overflow-hidden border border-gray-600 h-40'>
							<img
								src={newProduct.image}
								alt='Preview'
								className='w-full h-full object-cover'
								onError={(e) => { e.target.style.display = 'none'; }}
								onLoad={(e) => { e.target.style.display = 'block'; }}
							/>
						</div>
					)}
				</div>

				<button type='submit'
					className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50'
					disabled={loading}>
					{loading ? (
						<><Loader className='mr-2 h-5 w-5 animate-spin' />Loading...</>
					) : (
						<><PlusCircle className='mr-2 h-5 w-5' />Create Product</>
					)}
				</button>
			</form>
		</motion.div>
	);
};
export default CreateProductForm;
