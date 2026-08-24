import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  Smartphone,
  Shirt,
  Home as HomeIcon,
  BookOpen,
  Dumbbell,
  Sparkle,
  Watch,
  ChevronRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { ProductSkeletonCard } from '../components/SkeletonLoader';

const categoryItems = [
  { name: 'Electronics', icon: Smartphone, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80' },
  { name: 'Fashion', icon: Shirt, image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=300&q=80' },
  { name: 'Home & Kitchen', icon: HomeIcon, image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=300&q=80' },
  { name: 'Books', icon: BookOpen, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&q=80' },
  { name: 'Sports', icon: Dumbbell, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=300&q=80' },
  { name: 'Beauty', icon: Sparkle, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&q=80' },
  { name: 'Accessories', icon: Watch, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&q=80' }
];

const fallbackCatalog = [
  {
    _id: '65f1a2b3c4d5e6f7a8b9c0d1',
    name: 'Wireless Noise Canceling Headphones',
    description: 'Immersive sound quality with active noise cancellation, 30-hour battery life, and ultra-soft memory foam earcups.',
    category: 'Electronics',
    brand: 'AudioPhonic',
    price: 14999,
    discount: 15,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    rating: 4.8,
    reviewCount: 24
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c0d2',
    name: 'Ultra-Slim Smartwatch Pro 5',
    description: 'AMOLED display, GPS tracking, heart rate monitor, sleep analysis, and water resistance up to 50 meters.',
    category: 'Electronics',
    brand: 'TechGear',
    price: 8999,
    discount: 20,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    rating: 4.5,
    reviewCount: 18
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c0d3',
    name: 'Mechanical Gaming Keyboard RGB',
    description: 'Tactile blue switches, customizable per-key RGB backlighting, durable aluminum top plate, and detachable USB-C cable.',
    category: 'Electronics',
    brand: 'CyberKeys',
    price: 4500,
    discount: 10,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
    rating: 4.7,
    reviewCount: 32
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c0d5',
    name: 'Portable Bluetooth Speaker Max',
    description: 'Deep bass sound output, IPX7 waterproof rating, 24-hour continuous playtime, and built-in power bank capability.',
    category: 'Electronics',
    brand: 'SoundBoom',
    price: 3499,
    discount: 12,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
    rating: 4.6,
    reviewCount: 29
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c0d7',
    name: 'Classic Men Denim Jacket',
    description: '100% premium cotton denim jacket with standard fit, button front closure, and button-flap chest pockets.',
    category: 'Fashion',
    brand: 'UrbanCraft',
    price: 2999,
    discount: 25,
    stock: 60,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80',
    rating: 4.6,
    reviewCount: 22
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c0d8',
    name: 'Women Floral Summer Midi Dress',
    description: 'Lightweight breathable rayon fabric, attractive A-line silhouette, square neckline, and comfortable puff sleeves.',
    category: 'Fashion',
    brand: 'VogueStyle',
    price: 1899,
    discount: 15,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
    rating: 4.7,
    reviewCount: 19
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c0db',
    name: 'Programmable Espresso Coffee Maker',
    description: '15-bar Italian pressure pump, built-in milk frother, digital touchscreen display, and automatic shutoff timer.',
    category: 'Home & Kitchen',
    brand: 'BrewMaster',
    price: 11999,
    discount: 18,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80',
    rating: 4.9,
    reviewCount: 41
  },
  {
    _id: '65f1a2b3c4d5e6f7a8b9c0de',
    name: 'Designing Data-Intensive Applications',
    description: 'The definitive guide to the architecture, storage engines, distributed data processing, and NoSQL systems by Martin Kleppmann.',
    category: 'Books',
    brand: 'OReilly Press',
    price: 1499,
    discount: 10,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
    rating: 4.95,
    reviewCount: 58
  }
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState(fallbackCatalog);
  const [popularProducts, setPopularProducts] = useState(fallbackCatalog.slice(0, 4));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        setLoading(true);
        const featuredRes = await api.get('/products?limit=8&sort=newest');
        if (featuredRes.data.success && featuredRes.data.products?.length > 0) {
          setFeaturedProducts(featuredRes.data.products);
        }

        const popularRes = await api.get('/products?limit=4&sort=popular');
        if (popularRes.data.success && popularRes.data.products?.length > 0) {
          setPopularProducts(popularRes.data.products);
        }
      } catch (err) {
        console.error('API fetch error, using built-in catalog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeProducts();
  }, []);

  return (
    <div className="bg-[#f1f2f4] min-h-screen pb-12 space-y-4">
      
      {/* Flipkart Main Sale Banner */}
      <section className="bg-gradient-to-r from-[#2874f0] via-blue-700 to-indigo-900 text-white py-8 px-4 sm:px-8 shadow-md">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          <div className="space-y-4 text-center md:text-left">
            <span className="inline-block bg-[#ffe500] text-gray-900 font-extrabold text-xs px-3 py-1 rounded shadow">
              THE BIG SHOPPING DAYS • MONGODB ATLAS EDITION
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black italic tracking-tight leading-tight">
              UP TO 80% OFF <br />
              <span className="text-[#ffe500] not-italic">Top Electronics & Brands</span>
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm max-w-lg leading-relaxed">
              Shop authentic products with live stock management, simulated payment gateways, and visual order tracking.
            </p>
            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#ff9f00] hover:bg-amber-600 text-white font-extrabold text-sm rounded shadow-lg transition-transform hover:scale-105"
              >
                SHOP NOW <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="hidden md:flex justify-end relative">
            <div className="w-full max-w-md aspect-video bg-white/10 rounded-lg p-2 border border-white/20 shadow-2xl relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80"
                alt="Flipkart Style Sale Banner"
                className="w-full h-full object-cover rounded"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Top Categories Row */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-sm border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
            <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#2874f0]" /> Top Featured Categories
            </h2>
            <Link to="/products" className="text-xs font-bold text-[#2874f0] hover:underline flex items-center">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {categoryItems.map((cat) => (
              <Link
                key={cat.name}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded p-3 text-center transition-all flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden bg-white border border-gray-200 shadow-sm p-1">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-xs font-bold text-gray-800 group-hover:text-[#2874f0] line-clamp-1">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Deal of the Day / Featured Products */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-sm border border-gray-200 p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div>
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                Deals of the Day <span className="bg-[#2874f0] text-white text-[10px] px-2 py-0.5 rounded font-bold">24H Special</span>
              </h2>
              <p className="text-xs text-gray-500">Unbeatable prices on bestselling items</p>
            </div>
            <Link
              to="/products"
              className="bg-[#2874f0] text-white font-bold text-xs px-4 py-2 rounded shadow hover:bg-blue-700 transition-colors"
            >
              VIEW ALL DEALS
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredProducts.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Flipkart Promotional Banner 2 */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-[#ffe500] text-gray-900 p-6 rounded-sm border border-amber-300 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs font-black uppercase tracking-wider bg-[#2874f0] text-white px-2 py-0.5 rounded">
              ShopMongo Assured Guarantee
            </span>
            <h3 className="text-xl font-black">100% Genuine Quality Products Delivered Fast</h3>
            <p className="text-xs font-semibold text-gray-700">
              Tested with real MongoDB CRUD operations, Mongoose schemas, and instant stock deduction.
            </p>
          </div>
          <Link
            to="/products"
            className="bg-[#2874f0] text-white font-black text-xs px-6 py-3 rounded shadow hover:bg-blue-700 transition-colors flex-shrink-0"
          >
            EXPLORE CATALOG
          </Link>
        </div>
      </section>

      {/* Popular Products */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-sm border border-gray-200 p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div>
              <h2 className="text-lg font-black text-gray-900">Highest Rated & Popular</h2>
              <p className="text-xs text-gray-500">Based on verified customer reviews in MongoDB</p>
            </div>
            <Link
              to="/products?sort=popular"
              className="text-xs font-bold text-[#2874f0] hover:underline"
            >
              See All Popular Items
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductSkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {popularProducts.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
