import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Eye, Check, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = React.useState(false);

  const finalPrice = product.discount > 0
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const success = await addToCart(product._id, 1);
    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-sm border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group p-3"
    >
      <div>
        {/* Product Image Container */}
        <div className="relative aspect-square overflow-hidden bg-white flex items-center justify-center p-2">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Flipkart Assured Badge */}
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-[#2874f0] text-white text-[10px] font-black px-1.5 py-0.5 rounded italic flex items-center gap-0.5 shadow-sm">
              <ShieldCheck className="w-3 h-3 text-[#ffe500]" /> Assured
            </span>
          </div>

          {/* Quick Details Eye */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <Link
              to={`/products/${product._id}`}
              className="p-2.5 bg-white text-gray-800 rounded-full shadow-lg hover:bg-[#2874f0] hover:text-white transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Flipkart Product Details */}
        <div className="pt-3 space-y-1.5">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            {product.brand}
          </p>

          <Link to={`/products/${product._id}`} className="block">
            <h3 className="text-xs font-semibold text-gray-900 line-clamp-2 hover:text-[#2874f0] transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Green Flipkart Rating Badge */}
          <div className="flex items-center gap-2 pt-0.5">
            <div className="bg-emerald-700 text-white font-extrabold text-[11px] px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <span>{product.rating.toFixed(1)}</span>
              <Star className="w-3 h-3 fill-white" />
            </div>
            <span className="text-[11px] text-gray-400 font-medium">({product.reviewCount || 0})</span>
          </div>

          {/* Price & Discount Tags */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-base font-extrabold text-gray-900">
              ₹{finalPrice.toLocaleString('en-IN')}
            </span>
            {product.discount > 0 && (
              <>
                <span className="text-xs text-gray-400 line-through font-medium">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-emerald-600">
                  {product.discount}% off
                </span>
              </>
            )}
          </div>

          <p className="text-[10px] text-gray-500 font-semibold">Free delivery</p>
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="pt-3">
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className={`w-full py-2 rounded-sm font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
            added
              ? 'bg-emerald-600 text-white'
              : product.stock <= 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-[#ff9f00] hover:bg-amber-600 text-white shadow-amber-500/20'
          }`}
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5" /> Added to Cart
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
