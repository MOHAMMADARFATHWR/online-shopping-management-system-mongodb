import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import { TableRowSkeleton } from '../../components/SkeletonLoader';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/customers');
        if (res.data.success) {
          setCustomers(res.data.customers);
        }
      } catch (err) {
        console.error('Failed to load customer list:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.city && c.city.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div>
        <Link to="/admin" className="text-xs font-bold text-gray-500 hover:text-sky-600 flex items-center gap-1 mb-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-extrabold text-gray-900">Customer Management</h1>
        <p className="text-xs text-gray-500">Aggregated spending and order history per customer</p>
      </div>

      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Search customer by name, email, city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-4 pr-10 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none shadow-sm"
        />
        <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-700 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-4 px-4">Customer Name</th>
                <th className="py-4 px-4">Email</th>
                <th className="py-4 px-4">Phone</th>
                <th className="py-4 px-4">City / State</th>
                <th className="py-4 px-4">Registered Date</th>
                <th className="py-4 px-4">Orders Placed</th>
                <th className="py-4 px-4">Total Spending</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <TableRowSkeleton columns={7} />
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    No customers found matching search filter.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-gray-900">{c.name}</td>
                    <td className="py-3 px-4 font-medium text-sky-600">{c.email}</td>
                    <td className="py-3 px-4 text-gray-500">{c.phone || 'N/A'}</td>
                    <td className="py-3 px-4 text-gray-600">{c.city ? `${c.city}, ${c.state}` : 'N/A'}</td>
                    <td className="py-3 px-4 text-gray-400">
                      {new Date(c.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3 px-4 font-bold text-purple-700">{c.orderCount} Orders</td>
                    <td className="py-3 px-4 font-extrabold text-emerald-700">₹{(c.totalSpent || 0).toLocaleString('en-IN')}</td>
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
