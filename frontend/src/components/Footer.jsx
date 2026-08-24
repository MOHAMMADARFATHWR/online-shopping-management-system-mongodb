import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Database, ShieldCheck, Truck, RefreshCw, Headphones, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Proposition Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gray-800 text-sky-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold">Fast Express Shipping</h4>
              <p className="text-xs text-gray-400">Doorstep delivery across all cities</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gray-800 text-sky-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold">Simulated Payments</h4>
              <p className="text-xs text-gray-400">100% secure checkout sandbox</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gray-800 text-sky-400">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold">Easy Returns</h4>
              <p className="text-xs text-gray-400">Hassle-free 7 day replacement</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gray-800 text-sky-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold">MongoDB Atlas Driven</h4>
              <p className="text-xs text-gray-400">Real-time NoSQL aggregation backend</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Shop<span className="text-sky-400">Mongo</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              An Academic Minor Project demonstrating modern document-oriented database design, Mongoose aggregation pipelines, and high-performance React E-Commerce architecture.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-sky-950/80 text-sky-300 border border-sky-800">
              <Database className="w-3.5 h-3.5" /> Powered by MongoDB Atlas
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-sky-400 transition-colors">Home Page</Link></li>
              <li><Link to="/products" className="hover:text-sky-400 transition-colors">Product Catalog</Link></li>
              <li><Link to="/cart" className="hover:text-sky-400 transition-colors">Shopping Cart</Link></li>
              <li><Link to="/orders" className="hover:text-sky-400 transition-colors">Order Tracking</Link></li>
              <li><Link to="/login" className="hover:text-sky-400 transition-colors">Account Login</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Categories</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/products?category=Electronics" className="hover:text-sky-400 transition-colors">Electronics & Gadgets</Link></li>
              <li><Link to="/products?category=Fashion" className="hover:text-sky-400 transition-colors">Fashion & Apparel</Link></li>
              <li><Link to="/products?category=Home%20%26%20Kitchen" className="hover:text-sky-400 transition-colors">Home & Kitchen</Link></li>
              <li><Link to="/products?category=Books" className="hover:text-sky-400 transition-colors">Books & Tech Manuals</Link></li>
              <li><Link to="/products?category=Sports" className="hover:text-sky-400 transition-colors">Sports & Fitness</Link></li>
            </ul>
          </div>

          {/* Academic Information */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Project Overview</h4>
            <p className="text-xs text-gray-400 mb-3">
              B.Tech / CSE Minor Project submission on NoSQL Database Systems.
            </p>
            <div className="bg-gray-800 p-3.5 rounded-xl border border-gray-700 space-y-1 text-xs">
              <p><strong className="text-white">Database:</strong> online_shopping_db</p>
              <p><strong className="text-white">Collections:</strong> users, products, carts, orders, payments, reviews</p>
              <p><strong className="text-white">Tech:</strong> Node.js, Express, React, Vite, Tailwind CSS</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} ShopMongo Management System. Built for academic evaluation.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> using Mongoose & Express.
          </p>
        </div>
      </div>
    </footer>
  );
}
