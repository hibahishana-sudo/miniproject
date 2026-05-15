import { useState } from "react";
import { motion } from "framer-motion";
import { Trash, Star, Pencil, X, Link } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const ProductsList = () => {
	const { deleteProduct, toggleFeaturedProduct, products, updateProduct, loading } = useProductStore();
	const [editProduct, setEditProduct] = useState(null);

	const handleEditSave = async (e) => {
		e.preventDefault();
		await updateProduct(editProduct._id, {
			name: editProduct.name,
			description: editProduct.description,
			price: editProduct.price,
			image: editProduct.image,
			category: editProduct.category,
		});
		setEditProduct(null);
	};

	return (
		<>
			<motion.div
				className='bg-gray-800 shadow-lg rounded-lg overflow-x-auto max-w-4xl mx-auto'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead className='bg-gray-700'>
						<tr>
							{["Product", "Price", "Category", "Featured", "Actions"].map((h) => (
								<th key={h} className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>{h}</th>
							))}
						</tr>
					</thead>
					<tbody className='bg-gray-800 divide-y divide-gray-700'>
						{products?.map((product) => (
							<tr key={product._id} className='hover:bg-gray-700'>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='flex items-center gap-3'>
										<img className='h-10 w-10 rounded-full object-cover' src={product.image} alt={product.name} />
										<div className='text-sm font-medium text-white'>{product.name}</div>
									</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>₹{product.price.toFixed(0)}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{product.category}</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<button
										onClick={() => toggleFeaturedProduct(product._id)}
										className={`p-1 rounded-full ${product.isFeatured ? "bg-yellow-400 text-gray-900" : "bg-gray-600 text-gray-300"} hover:bg-yellow-500 transition-colors`}
									>
										<Star className='h-5 w-5' />
									</button>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='flex items-center gap-3'>
										<button
											onClick={() => setEditProduct({ ...product })}
											className='text-emerald-400 hover:text-emerald-300 transition-colors'
											title='Edit'
										>
											<Pencil className='h-5 w-5' />
										</button>
										<button
											onClick={() => deleteProduct(product._id)}
											className='text-red-400 hover:text-red-300 transition-colors'
											title='Delete'
										>
											<Trash className='h-5 w-5' />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</motion.div>

			{/* Edit Modal */}
			{editProduct && (
				<div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4'>
					<div className='bg-gray-800 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto'>
						<div className='flex justify-between items-center mb-5'>
							<h2 className='text-xl font-bold text-white'>Edit Product</h2>
							<button onClick={() => setEditProduct(null)} className='text-gray-400 hover:text-white transition-colors'>
								<X size={22} />
							</button>
						</div>
						<form onSubmit={handleEditSave} className='space-y-4'>
							<div>
								<label className='text-gray-400 text-sm'>Product Name</label>
								<input type='text' value={editProduct.name}
									onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
									className='w-full mt-1 px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg outline-none focus:ring-2 focus:ring-emerald-500'
									required />
							</div>
							<div>
								<label className='text-gray-400 text-sm'>Description</label>
								<textarea value={editProduct.description}
									onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
									rows={3}
									className='w-full mt-1 px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 resize-none'
									required />
							</div>
							<div>
								<label className='text-gray-400 text-sm'>Price (₹)</label>
								<input type='text' value={editProduct.price}
									onChange={(e) => { if (e.target.value === "" || /^[0-9]+$/.test(e.target.value)) setEditProduct({ ...editProduct, price: e.target.value }); }}
									inputMode='numeric'
									className='w-full mt-1 px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg outline-none focus:ring-2 focus:ring-emerald-500'
									required />
							</div>
							<div>
								<label className='text-gray-400 text-sm'>Category</label>
								<input type='text' value={editProduct.category}
									onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
									className='w-full mt-1 px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg outline-none focus:ring-2 focus:ring-emerald-500'
									required />
							</div>
							<div>
								<label className='text-gray-400 text-sm'>Image URL</label>
								<div className='flex gap-2 mt-1'>
									<div className='relative flex-1'>
										<Link size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
										<input type='text' value={editProduct.image}
											onChange={(e) => setEditProduct({ ...editProduct, image: e.target.value })}
											placeholder='Paste image URL...'
											className='w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pl-9 pr-3 text-white outline-none focus:ring-2 focus:ring-emerald-500' />
									</div>
								</div>
								{editProduct.image && (
									<div className='mt-2 rounded-lg overflow-hidden border border-gray-600 h-32'>
										<img src={editProduct.image} alt='Preview' className='w-full h-full object-cover'
											onError={(e) => { e.target.style.display = "none"; }}
											onLoad={(e) => { e.target.style.display = "block"; }} />
									</div>
								)}
							</div>
							<div className='flex gap-3 pt-2'>
								<button type='submit' disabled={loading}
									className='flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50'>
									{loading ? "Saving..." : "Save Changes"}
								</button>
								<button type='button' onClick={() => setEditProduct(null)}
									className='flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition-colors'>
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	);
};

export default ProductsList;
