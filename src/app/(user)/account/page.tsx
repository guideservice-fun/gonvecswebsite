'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, Wallet, Package } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { Order } from '@/types';
import toast, { Toaster } from 'react-hot-toast';

export default function AccountPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data } = await supabase
          .from('orders')
          .select(`
            *,
            order_items(*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  if (!user) return null;

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-dark-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-800 border border-dark-700 rounded-lg p-8 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-100">
                  Welcome, {user.firstName}!
                </h1>
                <p className="text-gray-400 mt-1">{user.email}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="btn-secondary flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Wallet Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-dark-700 border border-dark-600 rounded-lg p-6 hover:border-accent-gold transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent-gold/20 rounded-lg flex items-center justify-center">
                    <Wallet className="text-accent-gold" size={24} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Wallet Balance</p>
                    <p className="text-3xl font-bold text-accent-gold">
                      ₹{user.walletBalance.toFixed(2)}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Total Orders */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-dark-700 border border-dark-600 rounded-lg p-6 hover:border-accent-gold transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent-primary/20 rounded-lg flex items-center justify-center">
                    <Package className="text-accent-primary" size={24} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Orders</p>
                    <p className="text-3xl font-bold text-accent-primary">{orders.length}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/wallet')}
              className="btn-primary"
            >
              Top Up Wallet
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/products')}
              className="btn-primary"
            >
              Continue Shopping
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/wishlist')}
              className="btn-secondary"
            >
              View Wishlist
            </motion.button>
          </motion.div>

          {/* Orders Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-100 mb-6">Recent Orders</h2>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton h-24 rounded-lg"></div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-dark-800 border border-dark-700 rounded-lg p-12 text-center">
                <Package size={48} className="mx-auto text-gray-500 mb-4" />
                <p className="text-gray-400 mb-6">No orders yet</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => router.push('/products')}
                  className="btn-primary inline-block"
                >
                  Start Shopping
                </motion.button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order, idx) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-dark-800 border border-dark-700 rounded-lg p-6 hover:border-accent-gold transition-colors"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-gray-400 text-sm">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-accent-gold">₹{order.total_amount}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-accent-primary/20 text-accent-primary text-xs font-semibold rounded-full capitalize">
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}
