'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trash2, ArrowRight, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { supabase } from '@/lib/supabase';
import toast, { Toaster } from 'react-hot-toast';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const totalPrice = getTotalPrice();

  const handleCheckout = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (user.walletBalance < totalPrice) {
      toast.error('Insufficient wallet balance. Please top up your wallet.');
      router.push('/wallet');
      return;
    }

    try {
      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: totalPrice,
          status: 'processing',
          shipping_address: 'Pending',
          shipping_city: 'Pending',
          shipping_state: 'Pending',
          shipping_postal_code: 'Pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: orderData.id,
        product_id: item.productId,
        quantity: item.quantity,
        price_at_purchase: item.product?.real_price || 0,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Deduct from wallet
      const newBalance = user.walletBalance - totalPrice;
      await supabase
        .from('profiles')
        .update({ wallet_balance: newBalance })
        .eq('id', user.id);

      clearCart();
      toast.success('Order placed successfully!');
      router.push('/account');
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order');
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Toaster position="top-center" />
        <div className="min-h-screen bg-dark-900 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-100 mb-12">Shopping Cart</h1>

            <div className="bg-dark-800 border border-dark-700 rounded-lg p-12 text-center">
              <ShoppingCart size={48} className="mx-auto text-gray-500 mb-4" />
              <p className="text-gray-400 text-lg mb-6">Your cart is empty</p>
              <Link href="/products" className="btn-primary inline-block">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-dark-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-100 mb-12">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, idx) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-dark-800 border border-dark-700 rounded-lg p-6 flex gap-6 hover:border-accent-gold transition-colors"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-dark-700 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <span className="text-accent-gold text-sm font-semibold text-center px-2">
                      {item.product?.name || 'Product'}
                    </span>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-100 mb-1">
                      {item.product?.name}
                    </h3>
                    <p className="text-accent-gold font-bold">
                      ₹{item.product?.real_price}
                    </p>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                      className="bg-dark-700 hover:bg-dark-600 px-3 py-1 rounded transition-colors"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="bg-dark-700 hover:bg-dark-600 px-3 py-1 rounded transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-24">
                    <p className="text-xl font-bold text-accent-gold">
                      ₹{((item.product?.real_price || 0) * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Remove */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeItem(item.productId)}
                    className="btn-icon text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={20} />
                  </motion.button>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky top-24 h-fit"
            >
              <div className="bg-dark-800 border border-dark-700 rounded-lg p-6 space-y-6">
                <h2 className="text-2xl font-bold text-gray-100">Order Summary</h2>

                <div className="space-y-3 border-b border-dark-700 pb-6">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span className="text-accent-gold">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Tax</span>
                    <span>₹0</span>
                  </div>
                </div>

                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-accent-gold">₹{totalPrice.toFixed(2)}</span>
                </div>

                {!user ? (
                  <Link href="/auth/login" className="btn-primary w-full block text-center">
                    Login to Checkout
                  </Link>
                ) : user.walletBalance < totalPrice ? (
                  <>
                    <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 text-red-200 text-sm">
                      Insufficient balance. Please top up your wallet.
                    </div>
                    <Link href="/wallet" className="btn-secondary w-full block text-center">
                      Top Up Wallet
                    </Link>
                  </>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout
                    <ArrowRight size={18} />
                  </motion.button>
                )}

                <Link href="/products" className="btn-secondary w-full block text-center">
                  Continue Shopping
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
