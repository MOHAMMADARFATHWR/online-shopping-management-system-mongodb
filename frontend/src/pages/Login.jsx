import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(emailOrPhone, password);
      if (res.success) {
        if (res.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please check your login details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center max-w-4xl mx-auto px-4 py-10">
      
      {/* Flipkart Style Dual Column Container */}
      <div className="w-full bg-white rounded-sm border border-gray-200 shadow-xl grid grid-cols-1 md:grid-cols-5 overflow-hidden min-h-[480px]">
        
        {/* Left Flipkart Blue Branding Panel */}
        <div className="md:col-span-2 bg-[#2874f0] text-white p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-extrabold tracking-tight">Login</h2>
            <p className="text-blue-100 text-xs leading-relaxed font-medium">
              Get access to your Orders, Wishlist and Flipkart-style Recommendations powered by MongoDB Atlas.
            </p>
          </div>

          <div className="hidden md:flex justify-center items-center py-6">
            <div className="w-28 h-28 rounded-full bg-white/10 flex items-center justify-center text-white border-2 border-white/20">
              <ShoppingBag className="w-14 h-14 text-[#ffe500]" />
            </div>
          </div>

          <div className="text-[11px] text-blue-200 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-[#ffe500]" /> 100% Safe & Secure Login
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

            {/* ONLY Admin Credentials Helper as requested by USER */}
            <div className="bg-amber-50 p-3.5 rounded border border-amber-200 text-xs space-y-1.5">
              <p className="font-extrabold text-amber-900 flex items-center gap-1">
                🔑 Admin Credentials (System Owner):
              </p>
              <div className="text-[11px] text-amber-800 space-y-1 font-mono">
                <p><strong>Email:</strong> admin@shopmongo.com</p>
                <p><strong>Password:</strong> adminpassword123</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEmailOrPhone('admin@shopmongo.com');
                  setPassword('adminpassword123');
                }}
                className="mt-1 px-3 py-1 bg-[#2874f0] text-white font-bold text-[11px] rounded shadow hover:bg-blue-700 transition-colors"
              >
                Auto-fill Admin Credentials
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase">Email Address or Phone Number</label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    required
                    placeholder="Enter Email or Phone Number"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm py-2.5 pl-9 pr-3 text-xs focus:ring-2 focus:ring-[#2874f0] focus:bg-white focus:outline-none"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-2.5 top-3" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase">Password</label>
                <div className="relative mt-1">
                  <input
                    type="password"
                    required
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-sm py-2.5 pl-9 pr-3 text-xs focus:ring-2 focus:ring-[#2874f0] focus:bg-white focus:outline-none"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-2.5 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#fb641b] hover:bg-orange-700 text-white font-bold text-sm rounded-sm shadow transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Logging In...' : 'CONTINUE'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-100">
            New customer?{' '}
            <Link to="/register" className="font-bold text-[#2874f0] hover:underline">
              Create an account with your Name & Phone/Email
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
