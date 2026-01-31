import ProductCard from '../components/ProductCard';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { API_URL } from '../config';

const ProductList = () => {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search')?.toLowerCase() || '';
    const categoryQuery = searchParams.get('category');

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filters, setFilters] = useState({
        categories: [],
        sizes: [],
        priceRange: 100000 // Set to max range so all products appear by default
    });
    const [sort, setSort] = useState('recommended');

    useEffect(() => {
        if (categoryQuery) {
            setFilters(prev => ({ ...prev, categories: [categoryQuery] }));
        }
    }, [categoryQuery]);

    useEffect(() => {
        fetch(`${API_URL}/api/products`)
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setFilteredProducts(data);
            })
            .catch(err => console.error(err));
    }, []);

    // Apply Filters & Sort
    useEffect(() => {
        let result = [...products];

        // Filter by Search Query
        if (searchQuery) {
            result = result.filter(p =>
                p.title.toLowerCase().includes(searchQuery) ||
                p.category.toLowerCase().includes(searchQuery)
            );
        }

        // Filter by Category
        if (filters.categories.length > 0) {
            result = result.filter(p => filters.categories.includes(p.category));
        }

        // Filter by Size
        if (filters.sizes.length > 0) {
            result = result.filter(p =>
                p.sizes && p.sizes.some(s => filters.sizes.includes(s))
            );
        }

        // Filter by Price
        result = result.filter(p => parseFloat(p.price) <= filters.priceRange);

        // Sort (unchanged logic)
        if (sort === 'price-low') {
            result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if (sort === 'price-high') {
            result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        }

        setFilteredProducts(result);
    }, [products, filters, sort, searchQuery]);

    const handleCategoryChange = (category) => {
        setFilters(prev => {
            const newCategories = prev.categories.includes(category)
                ? prev.categories.filter(c => c !== category)
                : [...prev.categories, category];
            return { ...prev, categories: newCategories };
        });
    };

    const handleSizeChange = (size) => {
        setFilters(prev => {
            const newSizes = prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size];
            return { ...prev, sizes: newSizes };
        });
    };



    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="sticky top-24 space-y-10 max-h-[85vh] overflow-y-auto pr-2 pb-10 scrollbar-hide">
                        <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 transition-colors">
                            <h3 className="font-black uppercase tracking-widest text-xs mb-6 text-gray-400 dark:text-gray-500">Categories</h3>
                            <ul className="space-y-3 text-sm">
                                {['Dresses', 'Tops', 'Bottoms', 'Accessories', 'Outerwear', 'Shoes', 'Bags'].map(cat => (
                                    <li key={cat}>
                                        <label className="flex items-center group cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={filters.categories.includes(cat)}
                                                onChange={() => handleCategoryChange(cat)}
                                                className="w-4 h-4 rounded border-gray-300 dark:border-white/10 text-black dark:text-shein-red focus:ring-black dark:focus:ring-shein-red bg-white dark:bg-black/20"
                                            />
                                            <span className="ml-3 text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">{cat}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 transition-colors">
                            <h3 className="font-black uppercase tracking-widest text-xs mb-6 text-gray-400 dark:text-gray-500">Size</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                                    <button
                                        key={size}
                                        onClick={() => handleSizeChange(size)}
                                        className={`py-2 border rounded-lg transition-all text-[10px] font-bold ${filters.sizes.includes(size)
                                            ? 'bg-black dark:bg-shein-red text-white border-black dark:border-shein-red shadow-md'
                                            : 'bg-gray-50 dark:bg-black/20 border-transparent dark:border-white/5 hover:border-black dark:hover:border-white text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 transition-colors">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-black uppercase tracking-widest text-xs text-gray-400 dark:text-gray-500">Price</h3>
                                <span className="text-xs font-bold dark:text-white">{filters.priceRange.toLocaleString()} RWF</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="100000"
                                step="1000"
                                value={filters.priceRange}
                                onChange={(e) => setFilters({ ...filters, priceRange: Number(e.target.value) })}
                                className="w-full h-1.5 bg-gray-100 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-black dark:accent-shein-red"
                            />
                            <div className="flex justify-between text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-3 uppercase tracking-tighter">
                                <span>0 RWF</span>
                                <span>100,000 RWF</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-bold dark:text-white">
                            {filters.categories.length === 1 ? filters.categories[0] : 'All Products'} ({filteredProducts.length})
                        </h1>
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="border dark:border-white/10 bg-white dark:bg-[#1a1a1a] dark:text-white rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-colors"
                        >
                            <option value="recommended">Sort by: Recommended</option>
                            <option value="price-low">Price Low to High</option>
                            <option value="price-high">Price High to Low</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <ProductCard key={product.id} {...product} showDiscount={false} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                No products match your filters.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
