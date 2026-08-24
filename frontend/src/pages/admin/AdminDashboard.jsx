import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Package,
  ShoppingBag,
  IndianRupee,
  Star,
  TrendingUp,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { StatCardSkeleton } from '../../components/SkeletonLoader';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/dashboard');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const charts = data?.charts || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Admin Title Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-sky-950 to-indigo-950 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-900/60 px-3 py-1 rounded-full border border-sky-700">
            MongoDB Aggregation Control Panel
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-2">Admin Analytics Dashboard</h1>
          <p className="text-gray-300 text-xs mt-1">
            Real-time pipeline calculations using MongoDB `$match`, `$group`, `$lookup`, and `$unwind` stages.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/products/new"
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            + Add New Product
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Customers */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3"
        >
          <div className="flex justify-between items-center text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Customers</span>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-gray-900">{stats.totalCustomers || 0}</h3>
          <p className="text-xs text-blue-600 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> Registered Users
          </p>
        </motion.div>

        {/* Total Products */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3"
        >
          <div className="flex justify-between items-center text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Products</span>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-gray-900">{stats.totalProducts || 0}</h3>
          <p className="text-xs text-amber-600 font-semibold flex items-center gap-1">
            Across 7 Categories
          </p>
        </motion.div>

        {/* Total Orders */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3"
        >
          <div className="flex justify-between items-center text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-gray-900">{stats.totalOrders || 0}</h3>
          <p className="text-xs text-purple-600 font-semibold flex items-center gap-1">
            Fulfilled & Processing
          </p>
        </motion.div>

        {/* Total Revenue */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3"
        >
          <div className="flex justify-between items-center text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-gray-900">
            ₹{(stats.totalRevenue || 0).toLocaleString('en-IN')}
          </h3>
          <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            Aggregated Net Revenue
          </p>
        </motion.div>

      </div>

      {/* MongoDB Aggregation Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Category Revenue Breakdown */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-sky-600" /> Category Revenue Pipeline
              </h3>
              <p className="text-xs text-gray-400">Aggregated via `$lookup` & `$unwind` on order items</p>
            </div>
          </div>

          <div className="space-y-4">
            {charts.categoryRevenue?.map((cat) => {
              const maxSales = Math.max(...charts.categoryRevenue.map((c) => c.totalSales || 1));
              const percentage = Math.round((cat.totalSales / maxSales) * 100);

              return (
                <div key={cat.category} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-bold text-gray-800">
                    <span>{cat.category}</span>
                    <span>₹{cat.totalSales?.toLocaleString('en-IN')} ({cat.totalQuantity} items)</span>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8 }}
                      className="bg-gradient-to-r from-sky-500 to-indigo-600 h-full rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Orders by Status Distribution */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-600" /> Orders Status Grouping
              </h3>
              <p className="text-xs text-gray-400">Grouped by `orderStatus` using `$group` stage</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {charts.ordersByStatus?.map((st) => (
              <div key={st.status} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                <span className="text-xs font-bold text-gray-500">{st.status}</span>
                <h4 className="text-2xl font-extrabold text-gray-900">{st.count} Orders</h4>
              </div>
            ))}
          </div>

          {/* Top Selling Products List */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500">Top 5 Best Selling Products</h4>
            <div className="space-y-2 text-xs">
              {charts.topProducts?.map((tp, i) => (
                <div key={tp.productId} className="flex justify-between items-center p-2.5 bg-sky-50/50 rounded-xl">
                  <span className="font-bold text-gray-800 line-clamp-1">{i + 1}. {tp.productName}</span>
                  <span className="font-extrabold text-sky-700">{tp.totalSold} Units Sold</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Admin Quick Management Links */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Link
          to="/admin/products"
          className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-sky-300 transition-all text-center space-y-2 group"
        >
          <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
            <Package className="w-5 h-5" />
          </div>
          <span className="block text-xs font-bold text-gray-900">Manage Products</span>
        </Link>

        <Link
          to="/admin/customers"
          className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-sky-300 transition-all text-center space-y-2 group"
        >
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <span className="block text-xs font-bold text-gray-900">Manage Customers</span>
        </Link>

        <Link
          to="/admin/orders"
          className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-sky-300 transition-all text-center space-y-2 group"
        >
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <span className="block text-xs font-bold text-gray-900">Manage Orders</span>
        </Link>

        <Link
          to="/admin/payments"
          className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-sky-300 transition-all text-center space-y-2 group"
        >
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
            <IndianRupee className="w-5 h-5" />
          </div>
          <span className="block text-xs font-bold text-gray-900">Payment Audit</span>
        </Link>

        <Link
          to="/admin/reviews"
          className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-sky-300 transition-all text-center space-y-2 group"
        >
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
            <Star className="w-5 h-5" />
          </div>
          <span className="block text-xs font-bold text-gray-900">Review Moderation</span>
        </Link>
      </div>

    </div>
  );
}
