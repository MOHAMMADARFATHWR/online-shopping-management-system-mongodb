import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Lock, Mail, User, Phone, MapPin, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.name || (!formData.email && !formData.phone)) {
      setError('Please provide your Name and either Email or Phone Number');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // If user provided phone but no email, construct email fallback
      const submitData = {
        ...formData,
        email: formData.email ? formData.email.toLowerCase() : `${formData.phone}@shopmongo.com`
      };

      const res = await register(submitData);
      if (res.success) {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center max-w-4xl mx-auto px-4 py-10">
      
      <div className="w-full bg-white rounded-sm border border-gray-200 shadow-xl grid grid-cols-1 md:grid-cols-5 overflow-hidden min-h-[500px]">
        
        {/* Left Flipkart Blue Panel */}
        <div className="md:col-span-2 bg-[#2874f0] text-white p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-extrabold tracking-tight">Looks like you're new here!</h2>
            <p className="text-blue-100 text-xs leading-relaxed font-medium">
              Sign up with your Name, Email/Phone Number to get started with ShopMongo E-Commerce.
            </p>
          </div>

          <div className="hidden md:flex justify-center items-center py-6">
            <div className="w-28 h-28 rounded-full bg-white/10 flex items-center justify-center text-white border-2 border-white/20">
              <ShoppingBag className="w-14 h-14 text-[#ffe500]" />
            </div>
          </div>

          <div className="text-[11px] text-blue-200 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-[#ffe500]" /> Guaranteed Password Security & Encryption
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="md:col-span-3 p-8 flex flex-col justify-between space-y-6 bg-white">
          <div className="space-y-4">
            
            {error && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded font-semibold">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter Your Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full mt-1 bg-gray-50 border border-gray-300 rounded-sm py-2 px-3 text-xs focus:ring-2 focus:ring-[#2874f0] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full mt-1 bg-gray-50 border border-gray-300 rounded-sm py-2 px-3 text-xs focus:ring-2 focus:ring-[#2874f0] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase">Mobile Phone Number</label>
                  <input
                    type="text"
                    placeholder="10-digit Mobile Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full mt-1 bg-gray-50 border border-gray-300 rounded-sm py-2 px-3 text-xs focus:ring-2 focus:ring-[#2874f0] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase">Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full mt-1 bg-gray-50 border border-gray-300 rounded-sm py-2 px-3 text-xs focus:ring-2 focus:ring-[#2874f0] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase">Confirm Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full mt-1 bg-gray-50 border border-gray-300 rounded-sm py-2 px-3 text-xs focus:ring-2 focus:ring-[#2874f0] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase">Delivery Address</label>
                <input
                  type="text"
                  placeholder="Street Address, City, State, PIN"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full mt-1 bg-gray-50 border border-gray-300 rounded-sm py-2 px-3 text-xs focus:ring-2 focus:ring-[#2874f0] focus:bg-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#fb641b] hover:bg-orange-700 text-white font-bold text-sm rounded-sm shadow transition-all flex items-center justify-center gap-2 mt-2"
              >
                {loading ? 'Registering...' : 'CONTINUE & REGISTER'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="text-center text-xs text-gray-500 pt-3 border-t border-gray-100">
            Existing user?{' '}
            <Link to="/login" className="font-bold text-[#2874f0] hover:underline">
              Log in to your account
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
