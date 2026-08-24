import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Your Shopping Cart</h2>
        <p className="text-sm text-gray-500">Please log in to view and manage your shopping cart.</p>
        <Link
          to="/login"
          className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl inline-block shadow-md transition-colors"
        >
          Log In
        </Link>
      </div>
    );
  }

  const items = cart.items || [];
  const subtotal = cart.totalAmount || 0;
  const shipping = subtotal > 1000 || items.length === 0 ? 0 : 99;
  const grandTotal = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Shopping Cart</h1>
          <p className="text-xs text-gray-500">Persisted in MongoDB `carts` collection</p>
        </div>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center space-y-6 max-w-md mx-auto shadow-sm">
          <div className="w-20 h-20 bg-sky-50 text-sky-500 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-extrabold text-gray-900">Your Cart is Empty</h3>
          <p className="text-sm text-gray-500">
            Looks like you haven't added anything to your cart yet. Explore our top products and start shopping!
          </p>
          <Link
            to="/products"
            className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl inline-flex items-center gap-2 shadow-md transition-colors"
          >
            Explore Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-4 justify-between"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.productId?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <Link
                        to={`/products/${item.productId?._id || item.productId}`}
                        className="font-bold text-sm text-gray-900 hover:text-sky-600 transition-colors line-clamp-1"
                      >
                        {item.productName}
                      </Link>
                      <p className="text-xs text-gray-400">Unit Price: ₹{item.price.toLocaleString('en-IN')}</p>
                      <p className="text-sm font-extrabold text-gray-900 sm:hidden">
                        Total: ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controls & Remove */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="px-3 py-1 font-bold text-gray-600 hover:bg-gray-200"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="px-3 py-1 font-bold text-gray-600 hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-extrabold text-gray-900">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="pt-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-sm font-bold text-sky-600 hover:text-sky-700"
              >
                <ArrowLeft className="w-4 h-4" /> Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Order Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                <span className="font-bold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Estimated Delivery</span>
                <span className="font-bold text-emerald-600">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              {subtotal < 1000 && (
                <p className="text-[11px] text-amber-600 bg-amber-50 p-2 rounded-lg font-semibold">
                  Add ₹{(1000 - subtotal).toLocaleString('en-IN')} more for FREE Express Shipping!
                </p>
              )}
            </div>

            <div className="border-t border-gray-100 pt-4 flex justify-between items-baseline">
              <span className="text-base font-extrabold text-gray-900">Total Amount</span>
              <span className="text-2xl font-extrabold text-sky-600">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-2xl shadow-lg shadow-sky-600/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 text-sm"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs text-gray-400 justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Guaranteed Safe & Secure Sandbox Checkout
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
