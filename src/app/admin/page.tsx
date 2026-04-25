'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, LogOut, Package, Users, Wallet, Settings } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import toast, { Toaster } from 'react-hot-toast';
import { hashPassword, verifyPassword } from '@/lib/auth';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('transactions');

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For production, store hashed password in env
      // This is a demo - in production use proper auth
      if (password === 'Gonvecs@2008') {
        setIsAuthenticated(true);
        toast.success('Admin access granted');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Authentication failed');
    } finally {
      setIsLoading(false);
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    router.push('/');
  };

  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="top-center" />
        <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-800 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <div className="bg-dark-800 border border-dark-700 rounded-lg p-8">
              <div className="flex items-center justify-center mb-6">
                <Lock size={32} className="text-accent-gold" />
              </div>
              <h1 className="text-2xl font-bold text-center mb-2">Admin Access</h1>
              <p className="text-gray-400 text-center mb-8">Restricted to authorized personnel only</p>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={ADMIN_EMAIL}
                    disabled
                    className="input-field opacity-50 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {isLoading ? 'Verifying...' : 'Login'}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-dark-900">
        {/* Admin Header */}
        <div className="bg-dark-800 border-b border-dark-700 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-accent-gold">Admin Dashboard</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 btn-secondary"
            >
              <LogOut size={18} />
              Logout
            </motion.button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Navigation Tabs */}
          <div className="flex gap-4 mb-8 overflow-x-auto">
            {[
              { id: 'transactions', label: 'Transactions', icon: Wallet },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'orders', label: 'Orders', icon: Package },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-accent-gold text-dark-900'
                      : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={activeTab}
          >
            {activeTab === 'transactions' && (
              <AdminTransactions />
            )}
            {activeTab === 'products' && (
              <AdminProducts />
            )}
            {activeTab === 'orders' && (
              <AdminOrders />
            )}
            {activeTab === 'settings' && (
              <AdminSettings />
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}

// Admin Transactions Component
function AdminTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data } = await supabase
          .from('transactions')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        setTransactions(data || []);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleApprove = async (transactionId: string, userId: string, amount: number) => {
    try {
      // Update transaction status
      await supabase
        .from('transactions')
        .update({ status: 'approved' })
        .eq('id', transactionId);

      // Update user wallet
      const { data: profile } = await supabase
        .from('profiles')
        .select('wallet_balance')
        .eq('id', userId)
        .single();

      if (profile) {
        await supabase
          .from('profiles')
          .update({ wallet_balance: profile.wallet_balance + amount })
          .eq('id', userId);
      }

      toast.success('Transaction approved!');
      setTransactions(transactions.filter((t) => t.id !== transactionId));
    } catch (error) {
      toast.error('Failed to approve transaction');
    }
  };

  const handleReject = async (transactionId: string) => {
    try {
      await supabase
        .from('transactions')
        .update({ status: 'rejected' })
        .eq('id', transactionId);

      toast.success('Transaction rejected!');
      setTransactions(transactions.filter((t) => t.id !== transactionId));
    } catch (error) {
      toast.error('Failed to reject transaction');
    }
  };

  if (isLoading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {transactions.length === 0 ? (
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-12 text-center">
          <p className="text-gray-400">No pending transactions</p>
        </div>
      ) : (
        transactions.map((txn) => (
          <div
            key={txn.id}
            className="bg-dark-800 border border-dark-700 rounded-lg p-6 flex items-center justify-between"
          >
            <div>
              <p className="font-semibold text-gray-100">UTR: {txn.utr_number}</p>
              <p className="text-sm text-gray-400">Amount: ₹{txn.amount}</p>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => handleApprove(txn.id, txn.user_id, txn.amount)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                Approve
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => handleReject(txn.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Reject
              </motion.button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// Placeholder Components
function AdminProducts() {
  return (
    <div className="bg-dark-800 border border-dark-700 rounded-lg p-12 text-center">
      <p className="text-gray-400">Product management coming soon...</p>
    </div>
  );
}

function AdminOrders() {
  return (
    <div className="bg-dark-800 border border-dark-700 rounded-lg p-12 text-center">
      <p className="text-gray-400">Order management coming soon...</p>
    </div>
  );
}

function AdminSettings() {
  return (
    <div className="bg-dark-800 border border-dark-700 rounded-lg p-12 text-center">
      <p className="text-gray-400">Settings management coming soon...</p>
    </div>
  );
}
