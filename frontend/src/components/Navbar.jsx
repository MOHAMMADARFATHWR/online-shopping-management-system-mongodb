import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  Search,
  User,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  PackageCheck,
  ShieldCheck,
  Smartphone,
  Shirt,
  Home as HomeIcon,
  BookOpen,
  Dumbbell,
  Sparkle,
  Watch
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = [
  { name: 'Electronics', icon: Smartphone },
  { name: 'Fashion', icon: Shirt },
  { name: 'Home & Kitchen', icon: HomeIcon },
  { name: 'Books', icon: BookOpen },
  { name: 'Sports', icon: Dumbbell },
  { name: 'Beauty', icon: Sparkle },
  { name: 'Accessories', icon: Watch }
];

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#2874f0] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Flipkart Style Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="flex flex-col items-start leading-none">
              <span className="font-black italic text-xl tracking-tight text-white flex items-center gap-1">
                Shop<span className="text-[#ffe500]">Flip</span>
                <span className="text-[10px] not-italic font-bold bg-[#ffe500] text-[#2874f0] px-1 rounded">
                  Mongo
                </span>
              </span>
              <span className="text-[10px] text-amber-200 font-semibold italic tracking-wider hover:underline flex items-center gap-0.5">
                Explore <span className="text-[#ffe500] font-bold">Plus ✦</span>
              </span>
            </div>
          </Link>

          {/* Flipkart Style Central Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center relative flex-1 max-w-2xl">
            <input
              type="text"
              placeholder="Search for products, brands and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-sm py-2 pl-4 pr-10 text-sm focus:outline-none shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 bottom-0 px-3 text-[#2874f0] hover:text-blue-800"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Flipkart Action Buttons */}
          <div className="flex items-center gap-4 text-sm font-semibold">

            {/* Products Link */}
            <Link to="/products" className="hidden lg:block text-white hover:text-amber-200 transition-colors">
              All Products
            </Link>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-white/10 transition-colors relative"
            >
              <ShoppingBag className="w-5 h-5 text-white" />
              <span className="hidden md:inline-block">Cart</span>
              {cartCount > 0 && (
                <span className="bg-[#ffe500] text-gray-900 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Account / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 bg-white text-[#2874f0] px-4 py-1.5 rounded-sm font-bold text-sm shadow hover:bg-gray-100 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      onMouseLeave={() => setUserDropdownOpen(false)}
                      className="absolute right-0 mt-2 w-56 bg-white text-gray-900 rounded-sm shadow-2xl border border-gray-100 py-1.5 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
                        <p className="text-[11px] text-gray-500 font-medium">Signed in as</p>
                        <p className="text-xs font-bold text-gray-900 truncate">{user.email || user.phone}</p>
                        <span className="inline-block mt-0.5 text-[10px] font-bold px-1.5 py-0.2 bg-[#2874f0] text-white uppercase rounded">
                          {user.role}
                        </span>
                      </div>

                      {isAdmin ? (
                        <>
                          <Link
                            to="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-blue-50 hover:text-[#2874f0]"
                          >
                            <LayoutDashboard className="w-4 h-4 text-[#2874f0]" /> Admin Dashboard
                          </Link>
                          <Link
                            to="/admin/products"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-blue-50 hover:text-[#2874f0]"
                          >
                            <Sparkles className="w-4 h-4 text-amber-500" /> Manage Products
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/profile"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-blue-50 hover:text-[#2874f0]"
                          >
                            <User className="w-4 h-4 text-gray-500" /> My Profile
                          </Link>
                          <Link
                            to="/orders"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-blue-50 hover:text-[#2874f0]"
                          >
                            <PackageCheck className="w-4 h-4 text-emerald-600" /> My Orders
                          </Link>
                        </>
                      )}

                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                            navigate('/login');
                          }}
                          className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-white text-[#2874f0] px-6 py-1.5 rounded-sm font-bold text-sm shadow hover:bg-gray-100 transition-colors"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-1.5 text-white hover:bg-white/10 rounded"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="sm:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-gray-900 rounded-sm py-1.5 pl-3 pr-8 text-xs focus:outline-none"
            />
            <button type="submit" className="absolute right-2 top-2 text-[#2874f0]">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Flipkart Category Bar */}
      <div className="bg-white border-b border-gray-200 text-gray-800 shadow-sm hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between text-xs font-semibold">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="flex items-center gap-1.5 hover:text-[#2874f0] transition-colors py-1 px-2 rounded hover:bg-blue-50"
              >
                <Icon className="w-4 h-4 text-[#2874f0]" />
                <span>{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
