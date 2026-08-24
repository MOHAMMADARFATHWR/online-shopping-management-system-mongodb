import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const defaultProducts = [
  { _id: '65f1a2b3c4d5e6f7a8b9c0d1', name: 'Wireless Noise Canceling Headphones', price: 12749, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80' },
  { _id: '65f1a2b3c4d5e6f7a8b9c0d2', name: 'Ultra-Slim Smartwatch Pro 5', price: 7199, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80' },
  { _id: '65f1a2b3c4d5e6f7a8b9c0d3', name: 'Mechanical Gaming Keyboard RGB', price: 4050, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80' },
  { _id: '65f1a2b3c4d5e6f7a8b9c0d5', name: 'Portable Bluetooth Speaker Max', price: 3079, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80' },
  { _id: '65f1a2b3c4d5e6f7a8b9c0d7', name: 'Classic Men Denim Jacket', price: 2249, image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80' },
  { _id: '65f1a2b3c4d5e6f7a8b9c0db', name: 'Programmable Espresso Coffee Maker', price: 9839, image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80' }
];

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('guest_cart');
    return saved ? JSON.parse(saved) : { items: [], totalAmount: 0 };
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const fetchCart = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.get('/cart');
      if (res.data.success && res.data.cart) {
        setCart(res.data.cart);
        localStorage.setItem('guest_cart', JSON.stringify(res.data.cart));
      }
    } catch (err) {
      console.error('Fetch cart error, maintaining local state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    // 1. Instantly update local cart state so button state & badge update in <1ms
    let prod = defaultProducts.find(p => p._id === productId || p._id.toString() === productId?.toString());
    const itemPrice = prod ? prod.price : 1999;
    const itemName = prod ? prod.name : 'Product Item';

    setCart((prevCart) => {
      const items = [...(prevCart.items || [])];
      const idx = items.findIndex(i => i.productId?.toString() === productId?.toString() || i._id?.toString() === productId?.toString());

      if (idx > -1) {
        items[idx].quantity += Number(quantity);
      } else {
        items.push({
          _id: 'cart_item_' + Date.now() + Math.random().toString(36).substring(2, 5),
          productId: productId,
          productName: itemName,
          quantity: Number(quantity),
          price: itemPrice
        });
      }

      const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const newCart = { ...prevCart, items, totalAmount };
      localStorage.setItem('guest_cart', JSON.stringify(newCart));
      return newCart;
    });

    showToast('Product added to cart!', 'success');

    // 2. Sync to API backend if logged in
    if (user) {
      try {
        const res = await api.post('/cart', { productId, quantity });
        if (res.data.success && res.data.cart) {
          setCart(res.data.cart);
          localStorage.setItem('guest_cart', JSON.stringify(res.data.cart));
        }
      } catch (err) {}
    }

    return true;
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;

    setCart((prevCart) => {
      const items = (prevCart.items || []).map(item => {
        if (item._id === itemId || item._id?.toString() === itemId?.toString()) {
          return { ...item, quantity: Number(quantity) };
        }
        return item;
      });
      const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const newCart = { ...prevCart, items, totalAmount };
      localStorage.setItem('guest_cart', JSON.stringify(newCart));
      return newCart;
    });

    if (user) {
      try {
        const res = await api.put(`/cart/${itemId}`, { quantity });
        if (res.data.success && res.data.cart) {
          setCart(res.data.cart);
        }
      } catch (err) {}
    }
  };

  const removeFromCart = async (itemId) => {
    setCart((prevCart) => {
      const items = (prevCart.items || []).filter(item => item._id !== itemId && item._id?.toString() !== itemId?.toString());
      const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const newCart = { ...prevCart, items, totalAmount };
      localStorage.setItem('guest_cart', JSON.stringify(newCart));
      return newCart;
    });

    showToast('Item removed from cart', 'info');

    if (user) {
      try {
        const res = await api.delete(`/cart/${itemId}`);
        if (res.data.success && res.data.cart) {
          setCart(res.data.cart);
        }
      } catch (err) {}
    }
  };

  const clearCart = async () => {
    const emptyCart = { items: [], totalAmount: 0 };
    setCart(emptyCart);
    localStorage.removeItem('guest_cart');

    if (user) {
      try {
        await api.delete('/cart');
      } catch (err) {}
    }
  };

  const cartCount = cart.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        toast,
        showToast,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
