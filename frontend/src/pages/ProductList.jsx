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
        priceRange: 500 // Increased default range to ensure products show up
    });
    const [sort, setSort] = useState('recommended');

    useEffect(() => {
        if (categoryQuery) {
            setFilters(prev => ({ ...prev, categories: [categoryQuery] }));
        }
    }, [categoryQuery]);

    useEffect(() => {
        fetch('http://localhost:5000/api/products')
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
                    <div className="sticky top-20 space-y-8">
                        <div>
                            <h3 className="font-bold mb-4">Categories</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                {['Dresses', 'Tops', 'Bottoms', 'Accessories', 'Outerwear'].map(cat => (
                                    <li key={cat}>
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={filters.categories.includes(cat)}
                                                onChange={() => handleCategoryChange(cat)}
                                                className="rounded text-black focus:ring-black"
                                            />
                                            <span>{cat}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold mb-4">Size</h3>
                            <div className="flex flex-wrap gap-2">
                                {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                                    <button
                                        key={size}
                                        onClick={() => handleSizeChange(size)}
                                        className={`w-8 h-8 border rounded transition text-xs ${filters.sizes.includes(size)
                                            ? 'bg-black text-white border-black'
                                            : 'hover:bg-black hover:text-white'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold mb-4">Max Price: ${filters.priceRange}</h3>
                            <input
                                type="range"
                                min="0" max="200"
                                value={filters.priceRange}
                                onChange={(e) => setFilters({ ...filters, priceRange: Number(e.target.value) })}
                                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                            />
                            <div className="flex justify-between text-xs mt-2">
                                <span>$0</span>
                                <span>$200</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-bold">Clothing ({filteredProducts.length})</h1>
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="border rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                        >
                            <option value="recommended">Sort by: Recommended</option>
                            <option value="price-low">Price Low to High</option>
                            <option value="price-high">Price High to Low</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <ProductCard key={product.id} {...product} />
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
