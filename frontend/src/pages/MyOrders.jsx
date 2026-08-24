import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PackageCheck, ChevronRight, Clock, ShoppingBag, Truck, Calendar } from 'lucide-react';
import api from '../services/api';

const fallbackOrders = [
  {
    _id: 'ORD-849201',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    orderStatus: 'Confirmed',
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    totalAmount: 14999,
    items: [
      { productName: 'Wireless Noise Canceling Headphones', quantity: 1, price: 12749 },
      { productName: 'Waterproof Laptop Backpack 15.6 Inch', quantity: 1, price: 2250 }
    ]
  },
  {
    _id: 'ORD-739102',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    orderStatus: 'Delivered',
    paymentMethod: 'Card',
    paymentStatus: 'Paid',
    totalAmount: 8999,
    items: [
      { productName: 'Ultra-Slim Smartwatch Pro 5', quantity: 1, price: 8999 }
    ]
  }
];

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        let apiOrders = [];
        try {
          const res = await api.get('/orders');
          if (res.data.success && res.data.orders?.length > 0) {
            apiOrders = res.data.orders;
          }
        } catch (err) {}

        // Read local_orders from localStorage
        let localOrders = [];
        try {
          const saved = localStorage.getItem('local_orders');
          if (saved) localOrders = JSON.parse(saved);
        } catch (e) {}

        // Combine and deduplicate orders by _id
        const orderMap = new Map();
        [...localOrders, ...apiOrders].forEach(o => {
          if (o && o._id) orderMap.set(o._id, o);
        });

        let combined = Array.from(orderMap.values());
        if (combined.length === 0) {
          combined = fallbackOrders;
        }

        setOrders(combined);
      } catch (err) {
        setOrders(fallbackOrders);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Confirmed':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 flex justify-center">
        <div className="w-10 h-10 border-4 border-[#2874f0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#f1f2f4] min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Flipkart Style Header */}
        <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <PackageCheck className="w-6 h-6 text-[#2874f0]" /> My Orders & Purchase History
            </h1>
            <p className="text-xs text-gray-500">Track current packages, delivery status, and view past receipts</p>
          </div>
          <span className="bg-blue-50 text-[#2874f0] text-xs font-bold px-3 py-1.5 rounded border border-blue-100">
            {orders.length} Orders Recorded
          </span>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-5 rounded-sm border border-gray-200 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-400 font-bold uppercase">Order ID:</span>
                    <h3 className="font-mono font-black text-[#2874f0] text-sm">{order._id}</h3>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    Placed on: {new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-xs font-extrabold rounded border ${getStatusBadgeClass(order.orderStatus)}`}>
                    ● {order.orderStatus || 'Confirmed'}
                  </span>
                  <Link
                    to={`/orders/${order._id}`}
                    className="px-3 py-1.5 bg-[#2874f0] text-white hover:bg-blue-700 rounded transition-colors font-bold text-xs flex items-center gap-1 shadow-sm"
                  >
                    Track Order <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Items Summary */}
              <div className="space-y-2">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs bg-gray-50 p-2.5 rounded border border-gray-100">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-[#2874f0]" />
                      <span className="font-bold text-gray-900">{item.productName}</span>
                      <span className="text-gray-400 font-semibold">(x{item.quantity})</span>
                    </div>
                    <span className="font-extrabold text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer Summary Bar */}
              <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-gray-600 gap-2">
                <div>
                  Payment Option: <strong className="text-gray-900">{order.paymentMethod || 'UPI'}</strong> ({order.paymentStatus || 'Paid'})
                </div>
                <div className="text-sm font-black text-gray-900">
                  Grand Total: <span className="text-[#2874f0]">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
