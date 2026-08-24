import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import { TableRowSkeleton } from '../../components/SkeletonLoader';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = await api.get('/payments');
        if (res.data.success) {
          setPayments(res.data.payments);
        }
      } catch (err) {
        console.error('Failed to fetch payments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div>
        <Link to="/admin" className="text-xs font-bold text-gray-500 hover:text-sky-600 flex items-center gap-1 mb-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-extrabold text-gray-900">Payment Audit Trail</h1>
        <p className="text-xs text-gray-500">Simulated payment transactions recorded in MongoDB `payments` collection</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-700 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-4 px-4">Transaction ID</th>
                <th className="py-4 px-4">Order ID</th>
                <th className="py-4 px-4">Customer</th>
                <th className="py-4 px-4">Amount</th>
                <th className="py-4 px-4">Payment Method</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <TableRowSkeleton columns={7} />
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    No payment logs recorded.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-sky-700">{p.transactionId}</td>
                    <td className="py-3 px-4 font-mono text-gray-700">{p.orderId?._id || p.orderId}</td>
                    <td className="py-3 px-4 font-bold text-gray-900">{p.userId?.name || 'Customer'}</td>
                    <td className="py-3 px-4 font-extrabold text-gray-900">₹{p.amount?.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-gray-700 font-medium">{p.paymentMethod}</td>
                    <td className="py-3 px-4">
                      <span className={`font-bold px-2.5 py-0.5 rounded-full ${p.paymentStatus === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {new Date(p.paymentDate || p.createdAt).toLocaleString('en-IN')}
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
