import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Star, RefreshCw, X, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { ProductSkeletonCard } from '../components/SkeletonLoader';

const categories = ['All', 'Electronics', 'Fashion', 'Home & Kitchen', 'Books', 'Sports', 'Beauty', 'Accessories'];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Filters from URL query params
  const categoryParam = searchParams.get('category') || 'All';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const pageParam = Number(searchParams.get('page')) || 1;
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const ratingParam = searchParams.get('rating') || '';

  // Local state for filter inputs
  const [searchInput, setSearchInput] = useState(searchParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortOption, setSortOption] = useState(sortParam);
  const [minPrice, setMinPrice] = useState(minPriceParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);
  const [ratingFilter, setRatingFilter] = useState(ratingParam);

  useEffect(() => {
    setSelectedCategory(categoryParam);
    setSearchInput(searchParam);
    setSortOption(sortParam);
    setMinPrice(minPriceParam);
    setMaxPrice(maxPriceParam);
    setRatingFilter(ratingParam);
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (searchParam) query.set('search', searchParam);
      if (categoryParam && categoryParam !== 'All') query.set('category', categoryParam);
      if (sortParam) query.set('sort', sortParam);
      if (pageParam) query.set('page', pageParam);
      if (minPriceParam) query.set('minPrice', minPriceParam);
      if (maxPriceParam) query.set('maxPrice', maxPriceParam);
      if (ratingParam) query.set('rating', ratingParam);

      const res = await api.get(`/products?${query.toString()}`);
      if (res.data.success) {
        setProducts(res.data.products);
        setTotal(res.data.total);
        setPages(res.data.pages);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (searchInput.trim()) params.set('search', searchInput.trim());
    if (selectedCategory && selectedCategory !== 'All') params.set('category', selectedCategory);
    if (sortOption) params.set('sort', sortOption);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (ratingFilter) params.set('rating', ratingFilter);
    params.set('page', '1');
    setSearchParams(params);
    setFilterDrawerOpen(false);
  };

  const resetFilters = () => {
    setSearchInput('');
    setSelectedCategory('All');
    setSortOption('newest');
    setMinPrice('');
    setMaxPrice('');
    setRatingFilter('');
    setSearchParams({});
    setFilterDrawerOpen(false);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-700 to-indigo-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="max-w-2xl space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight">Product Catalog</h1>
          <p className="text-sky-100 text-sm">
            Search, filter, and sort products with real-time MongoDB indexing and compound queries.
          </p>
        </div>
      </div>

      {/* Controls & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search by name, brand, description..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
          />
          <button onClick={applyFilters} className="absolute right-3 top-3 text-gray-400 hover:text-sky-600">
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setFilterDrawerOpen(true)}
            className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-sm font-semibold"
          >
            <Filter className="w-4 h-4" /> Filters
          </button>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 hidden sm:inline-block">Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value);
                const params = new URLSearchParams(searchParams);
                params.set('sort', e.target.value);
                setSearchParams(params);
              }}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Highest Rated</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Catalog Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-sky-600" /> Filters
            </h3>
            <button onClick={resetFilters} className="text-xs text-rose-600 hover:underline flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Categories Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Category</label>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === cat
                      ? 'bg-sky-50 text-sky-700 font-bold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Price Range (₹)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Minimum Rating</label>
            <div className="space-y-1">
              {[4, 3, 2, 1].map((r) => (
                <button
                  key={r}
                  onClick={() => setRatingFilter(ratingFilter === r.toString() ? '' : r.toString())}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-sm flex items-center gap-2 ${
                    ratingFilter === r.toString() ? 'bg-amber-50 font-bold text-amber-800' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400" />
                  </div>
                  <span>{r} Stars & Above</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={applyFilters}
            className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md transition-colors"
          >
            Apply Filters
          </button>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Active Filter Badges */}
          {(searchParam || (categoryParam && categoryParam !== 'All') || minPriceParam || maxPriceParam || ratingParam) && (
            <div className="flex flex-wrap items-center gap-2 bg-sky-50/70 p-3 rounded-2xl border border-sky-100 text-xs">
              <span className="font-bold text-sky-900">Active Filters:</span>
              {searchParam && (
                <span className="bg-white px-2.5 py-1 rounded-full text-sky-800 font-medium border border-sky-200">
                  "{searchParam}"
                </span>
              )}
              {categoryParam !== 'All' && (
                <span className="bg-white px-2.5 py-1 rounded-full text-sky-800 font-medium border border-sky-200">
                  Category: {categoryParam}
                </span>
              )}
              {(minPriceParam || maxPriceParam) && (
                <span className="bg-white px-2.5 py-1 rounded-full text-sky-800 font-medium border border-sky-200">
                  Price: ₹{minPriceParam || 0} - ₹{maxPriceParam || '∞'}
                </span>
              )}
              {ratingParam && (
                <span className="bg-white px-2.5 py-1 rounded-full text-sky-800 font-medium border border-sky-200">
                  Rating ≥ {ratingParam}★
                </span>
              )}
              <button onClick={resetFilters} className="text-rose-600 font-bold ml-auto hover:underline">
                Clear All
              </button>
            </div>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs text-gray-500 px-1">
            <span>Showing {products.length} of {total} products</span>
            <span>Page {pageParam} of {pages}</span>
          </div>

          {/* Grid View */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <ProductSkeletonCard key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No Products Found</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                We couldn't find any products matching your selected criteria. Try adjusting your search query or reset filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-sky-600 text-white font-bold text-sm rounded-xl hover:bg-sky-700 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              <button
                onClick={() => handlePageChange(pageParam - 1)}
                disabled={pageParam <= 1}
                className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: pages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-colors ${
                      pageParam === pageNum
                        ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(pageParam + 1)}
                disabled={pageParam >= pages}
                className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </main>
      </div>

    </div>
  );
}
