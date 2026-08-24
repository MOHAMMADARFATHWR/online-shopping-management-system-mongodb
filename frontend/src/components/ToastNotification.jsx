import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ToastNotification() {
  const { toast } = useCart();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-sky-500" />
  };

  const bgStyles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    error: 'bg-rose-50 border-rose-200 text-rose-900',
    info: 'bg-sky-50 border-sky-200 text-sky-900'
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 pointer-events-none">
      <AnimatePresence>
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.25 }}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-md pointer-events-auto max-w-md ${
            bgStyles[toast.type] || bgStyles.info
          }`}
        >
          {icons[toast.type] || icons.info}
          <span className="text-sm font-semibold leading-tight">{toast.message}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
