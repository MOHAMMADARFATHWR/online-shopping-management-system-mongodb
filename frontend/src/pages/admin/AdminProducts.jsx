import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Plus, Edit, Trash2, Search, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import { TableRowSkeleton } from '../../components/SkeletonLoader';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products?limit=100${search ? `&search=${search}` : ''}`);
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from MongoDB?`)) {
      try {
        const res = await api.delete(`/products/${id}`);
        if (res.data.success) {
          setProducts(products.filter((p) => p._id !== id));
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link to="/admin" className="text-xs font-bold text-gray-500 hover:text-sky-600 flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900">Product Management</h1>
          <p className="text-xs text-gray-500">Create, edit, update stock & price, or delete products</p>
        </div>

        <Link
          to="/admin/products/new"
          className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Filter by name, category, brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-4 pr-10 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none shadow-sm"
        />
        <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-700 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-4 px-4">Product</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Brand</th>
                <th className="py-4 px-4">Price</th>
                <th className="py-4 px-4">Discount</th>
                <th className="py-4 px-4">Stock</th>
                <th className="py-4 px-4">Rating</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <TableRowSkeleton columns={8} />
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    No products found in MongoDB collection.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg bg-gray-100" />
                      <span className="font-bold text-gray-900 line-clamp-1 max-w-[180px]">{p.name}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-700">{p.category}</td>
                    <td className="py-3 px-4 text-gray-500">{p.brand}</td>
                    <td className="py-3 px-4 font-extrabold text-gray-900">₹{p.price.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-rose-600 font-bold">{p.discount > 0 ? `${p.discount}%` : '0%'}</td>
                    <td className="py-3 px-4">
                      <span className={`font-bold px-2 py-0.5 rounded-full ${p.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-amber-600">★ {p.rating.toFixed(1)}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link
                        to={`/admin/products/${p._id}/edit`}
                        className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-lg inline-block"
                        title="Edit product"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(p._id, p.name)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg inline-block"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
