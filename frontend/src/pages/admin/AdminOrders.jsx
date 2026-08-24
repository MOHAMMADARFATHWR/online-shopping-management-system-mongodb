import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Eye, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { TableRowSkeleton } from '../../components/SkeletonLoader';

const statuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/orders');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      if (res.data.success) {
        setOrders(orders.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o)));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div>
        <Link to="/admin" className="text-xs font-bold text-gray-500 hover:text-sky-600 flex items-center gap-1 mb-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-extrabold text-gray-900">Order Management</h1>
        <p className="text-xs text-gray-500">Update order status across Pending, Confirmed, Shipped, Delivered, Cancelled</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-700 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-4 px-4">Order ID</th>
                <th className="py-4 px-4">Customer</th>
                <th className="py-4 px-4">Items Count</th>
                <th className="py-4 px-4">Total Amount</th>
                <th className="py-4 px-4">Payment Method</th>
                <th className="py-4 px-4">Payment Status</th>
                <th className="py-4 px-4">Order Status</th>
                <th className="py-4 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <TableRowSkeleton columns={8} />
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    No orders recorded yet.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-gray-900">{o._id}</td>
                    <td className="py-3 px-4 font-bold text-gray-900">
                      {o.userId?.name || 'Customer'}
                      <span className="block text-[10px] text-gray-400 font-normal">{o.userId?.email}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-700">{o.items?.length || 0} items</td>
                    <td className="py-3 px-4 font-extrabold text-gray-900">₹{o.totalAmount?.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-gray-600 font-medium">{o.paymentMethod}</td>
                    <td className="py-3 px-4">
                      <span className={`font-bold px-2 py-0.5 rounded-full ${o.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={o.orderStatus}
                        disabled={updatingId === o._id}
                        onChange={(e) => handleStatusChange(o._id, e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-bold text-gray-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      >
                        {statuses.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/orders/${o._id}`}
                        className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-lg inline-block font-bold text-xs"
                      >
                        Inspect
                      </Link>
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
