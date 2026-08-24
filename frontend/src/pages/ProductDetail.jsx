import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, ShoppingBag, Truck, ShieldCheck, RefreshCw, Check, User as UserIcon, Send, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  // New Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const fetchProductAndReviews = async () => {
    try {
      setLoading(true);
      const prodRes = await api.get(`/products/${id}`);
      if (prodRes.data.success) {
        setProduct(prodRes.data.product);
      }

      const revRes = await api.get(`/products/${id}/reviews`);
      if (revRes.data.success) {
        setReviews(revRes.data.reviews);
      }
    } catch (err) {
      console.error('Failed to load product details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductAndReviews();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
        <Link to="/products" className="px-6 py-2.5 bg-sky-600 text-white font-bold rounded-xl inline-block">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const finalPrice = product.discount > 0
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;

  const handleAddToCart = async () => {
    const success = await addToCart(product._id, quantity);
    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleBuyNow = async () => {
    const success = await addToCart(product._id, quantity);
    if (success) {
      navigate('/cart');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setReviewError('Please enter a comment for your review');
      return;
    }

    try {
      setSubmittingReview(true);
      setReviewError('');
      const res = await api.post('/reviews', {
        productId: product._id,
        rating,
        comment: comment.trim()
      });

      if (res.data.success) {
        setComment('');
        fetchProductAndReviews(); // refresh rating & review list
      }
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Product Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-sm">
        
        {/* Product Image */}
        <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.discount > 0 && (
            <span className="absolute top-4 left-4 bg-rose-500 text-white font-extrabold text-xs px-3 py-1.5 rounded-full shadow-lg">
              {product.discount}% OFF
            </span>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-600 uppercase tracking-widest px-3 py-1 bg-sky-50 rounded-full">
                {product.category} • {product.brand}
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${product.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {product.stock > 0 ? `${product.stock} items in stock` : 'Out of Stock'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating summary */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500 mr-1" />
                <span className="font-extrabold text-amber-900 text-sm">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-gray-500">Based on {reviews.length} customer reviews</span>
            </div>

            {/* Price Box */}
            <div className="pt-2 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-gray-900">
                ₹{finalPrice.toLocaleString('en-IN')}
              </span>
              {product.discount > 0 && (
                <span className="text-lg text-gray-400 line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <p className="text-sm text-gray-600 leading-relaxed pt-2 border-t border-gray-100">
              {product.description}
            </p>
          </div>

          {/* Action Area */}
          <div className="space-y-4 pt-6 border-t border-gray-100">
            
            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-sm font-bold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : product.stock <= 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/20'
                }`}
              >
                {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                {added ? 'Added to Cart' : 'Add to Cart'}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="py-3.5 bg-gray-900 hover:bg-black text-white font-bold text-sm rounded-2xl transition-all shadow-md disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>

            {/* Micro Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100 text-[11px] font-semibold text-gray-500">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-sky-600" /> Free Delivery
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Genuine
              </div>
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-purple-600" /> 7 Days Replacement
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews & Ratings Section */}
      <section className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-sm space-y-8">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">Customer Reviews & Ratings</h2>
          <p className="text-xs text-gray-500">Stored dynamically in MongoDB `reviews` collection</p>
        </div>

        {/* Submit Review Form */}
        {user ? (
          <form onSubmit={handleReviewSubmit} className="bg-sky-50/60 p-5 rounded-2xl border border-sky-100 space-y-4">
            <h3 className="text-sm font-bold text-sky-900">Write a Customer Review</h3>
            
            {reviewError && (
              <div className="flex items-center gap-2 p-3 bg-rose-100 text-rose-700 text-xs rounded-xl font-semibold">
                <AlertCircle className="w-4 h-4" /> {reviewError}
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-700">Rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 focus:outline-none"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={3}
              placeholder="Share your experience with this product..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />

            <button
              type="submit"
              disabled={submittingReview}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md transition-colors"
            >
              <Send className="w-3.5 h-3.5" /> Submit Review
            </button>
          </form>
        ) : (
          <div className="p-4 bg-gray-50 rounded-2xl text-xs text-gray-600 flex items-center justify-between">
            <span>Sign in to submit your product review.</span>
            <Link to="/login" className="font-bold text-sky-600 hover:underline">
              Log In
            </Link>
          </div>
        )}

        {/* Existing Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No reviews yet. Be the first to review this product!</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev._id} className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-xs">
                      <UserIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-gray-900">
                      {rev.userId?.name || 'Customer'}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400">
                    {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <div className="flex text-amber-400 fill-amber-400 gap-0.5">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>

                <p className="text-xs text-gray-700 leading-relaxed">{rev.comment}</p>
              </div>
            ))
          )}
        </div>
      </section>

    </div>
  );
}
