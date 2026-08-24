import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Trash2, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import { TableRowSkeleton } from '../../components/SkeletonLoader';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/reviews');
      if (res.data.success) {
        setReviews(res.data.reviews);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review? Product rating will automatically update.')) {
      try {
        const res = await api.delete(`/reviews/${id}`);
        if (res.data.success) {
          setReviews(reviews.filter((r) => r._id !== id));
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete review');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div>
        <Link to="/admin" className="text-xs font-bold text-gray-500 hover:text-sky-600 flex items-center gap-1 mb-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-extrabold text-gray-900">Review Moderation</h1>
        <p className="text-xs text-gray-500">Inspect and remove inappropriate reviews from MongoDB `reviews` collection</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-700 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-4 px-4">Customer</th>
                <th className="py-4 px-4">Product</th>
                <th className="py-4 px-4">Rating</th>
                <th className="py-4 px-4">Comment</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <TableRowSkeleton columns={6} />
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    No customer reviews recorded.
                  </td>
                </tr>
              ) : (
                reviews.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-gray-900">{r.userId?.name || 'Customer'}</td>
                    <td className="py-3 px-4 font-semibold text-sky-700">{r.productId?.name || 'Product'}</td>
                    <td className="py-3 px-4 font-bold text-amber-500">★ {r.rating} / 5</td>
                    <td className="py-3 px-4 text-gray-700 max-w-xs truncate">{r.comment}</td>
                    <td className="py-3 px-4 text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg inline-block"
                        title="Delete review"
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
