import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Clock, Truck, Package, ArrowLeft, CreditCard, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const statusSteps = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];

export default function OrderDetail() {
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/orders/${id}`);
        if (res.data.success) {
          setOrderData(res.data);
        }
      } catch (err) {
        console.error('Failed to load order details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex justify-center">
        <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!orderData || !orderData.order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Order Not Found</h2>
        <Link to="/orders" className="px-6 py-2 bg-sky-600 text-white font-bold rounded-xl inline-block">
          Back to My Orders
        </Link>
      </div>
    );
  }

  const { order, payment } = orderData;
  const currentStepIndex = statusSteps.indexOf(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/orders" className="text-sm font-bold text-gray-500 hover:text-sky-600 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
        <span className="text-xs font-mono bg-sky-50 text-sky-700 px-3 py-1 rounded-full border border-sky-100 font-bold">
          ID: {order._id}
        </span>
      </div>

      {/* Visual Tracking Timeline Component */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-sm space-y-8">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-gray-900">Order Tracking Timeline</h2>
          <p className="text-xs text-gray-500">Live order progress tracked in MongoDB Atlas</p>
        </div>

        {/* Stepper Visual Bar */}
        <div className="relative flex items-center justify-between max-w-2xl mx-auto px-4 pt-4">
          {statusSteps.map((stepName, idx) => {
            const isCompleted = currentStepIndex >= idx;
            const isCurrent = currentStepIndex === idx;

            return (
              <div key={stepName} className="flex flex-col items-center relative z-10">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: isCurrent ? 1.15 : 1 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-md transition-all ${
                    isCompleted
                      ? 'bg-sky-600 text-white shadow-sky-600/30'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {idx === 0 && <Clock className="w-5 h-5" />}
                  {idx === 1 && <Package className="w-5 h-5" />}
                  {idx === 2 && <Truck className="w-5 h-5" />}
                  {idx === 3 && <CheckCircle2 className="w-5 h-5" />}
                </motion.div>
                <span className={`text-xs font-extrabold mt-3 ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                  {stepName}
                </span>
              </div>
            );
          })}

          {/* Background Connecting Line */}
          <div className="absolute top-10 left-12 right-12 h-1 bg-gray-200 -z-0">
            <div
              className="h-full bg-sky-600 transition-all duration-500"
              style={{
                width: `${Math.max(0, (currentStepIndex / (statusSteps.length - 1)) * 100)}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Items List */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-3">Ordered Items</h3>
          <div className="space-y-3">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-gray-900">{item.productName}</p>
                  <p className="text-gray-400">Qty: {item.quantity} x ₹{item.price.toLocaleString('en-IN')}</p>
                </div>
                <span className="font-extrabold text-gray-900">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-3 flex justify-between text-sm font-extrabold">
            <span>Total Paid</span>
            <span className="text-sky-600">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Shipping & Payment Summary */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-3">Shipping & Payment</h3>
          
          <div className="text-xs text-gray-600 space-y-1">
            <p className="font-bold text-gray-900">{order.shippingAddress?.name}</p>
            <p>{order.shippingAddress?.address}</p>
            <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
            <p className="text-gray-400">Phone: {order.shippingAddress?.phone}</p>
          </div>

          <div className="pt-3 border-t border-gray-100 space-y-1 text-xs">
            <p><strong className="text-gray-800">Method:</strong> {order.paymentMethod}</p>
            <p><strong className="text-gray-800">Status:</strong> {order.paymentStatus}</p>
            {payment?.transactionId && (
              <p className="font-mono text-gray-500 pt-1">Txn ID: {payment.transactionId}</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
