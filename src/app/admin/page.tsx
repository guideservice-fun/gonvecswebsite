'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, LogOut, Package, Users, Wallet, Settings, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { generateUPIQRCode } from '@/lib/qrcode-utils';
import toast, { Toaster } from 'react-hot-toast';

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
            {activeTab === 'transactions' && <AdminTransactions />}
            {activeTab === 'products' && <AdminProducts />}
            {activeTab === 'orders' && <AdminOrders />}
            {activeTab === 'settings' && <AdminSettings />}
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
          <motion.div
            key={txn.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-800 border border-dark-700 rounded-lg p-6 flex items-center justify-between hover:border-accent-gold transition-colors"
          >
            <div>
              <p className="font-semibold text-gray-100">UTR: {txn.utr_number}</p>
              <p className="text-sm text-gray-400">Amount: ₹{txn.amount.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">
                User ID: {txn.user_id}
              </p>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => handleApprove(txn.id, txn.user_id, txn.amount)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors font-semibold text-white"
              >
                Approve
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => handleReject(txn.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-semibold text-white"
              >
                Reject
              </motion.button>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}

// Admin Products Component
function AdminProducts() {
  return (
    <div className="bg-dark-800 border border-dark-700 rounded-lg p-12 text-center">
      <Package size={48} className="mx-auto text-gray-500 mb-4" />
      <p className="text-gray-400 text-lg">Product management coming soon...</p>
    </div>
  );
}

// Admin Orders Component
function AdminOrders() {
  return (
    <div className="bg-dark-800 border border-dark-700 rounded-lg p-12 text-center">
      <Package size={48} className="mx-auto text-gray-500 mb-4" />
      <p className="text-gray-400 text-lg">Order management coming soon...</p>
    </div>
  );
}

// Admin Settings Component
function AdminSettings() {
  const [upiId, setUpiId] = useState('');
  const [merchantName, setMerchantName] = useState('Gonvecs');
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerateQR = async () => {
    setIsGenerating(true);
    try {
      if (!upiId) {
        toast.error('Please enter UPI ID');
        return;
      }

      const qrCode = await generateUPIQRCode(upiId, merchantName);
      setQrImage(qrCode);
      toast.success('QR code generated!');
    } catch (error) {
      toast.error('Failed to generate QR code');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveQR = async () => {
    setIsSaving(true);
    try {
      if (!qrImage) {
        toast.error('Please generate QR code first');
        return;
      }

      // Get existing settings or create new
      const { data: existing } = await supabase
        .from('admin_settings')
        .select('id')
        .limit(1)
        .single();

      if (existing) {
        await supabase
          .from('admin_settings')
          .update({ qr_code_url: qrImage })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('admin_settings')
          .insert({ qr_code_url: qrImage });
      }

      toast.success('QR code saved successfully!');
    } catch (error) {
      toast.error('Failed to save QR code');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-800 border border-dark-700 rounded-lg p-8"
      >
        <h2 className="text-2xl font-bold text-gray-100 mb-6">QR Code Settings</h2>

        <div className="space-y-6">
          {/* UPI ID Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              UPI ID
            </label>
            <input
              type="text"
              placeholder="merchant@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="input-field"
            />
            <p className="text-xs text-gray-500 mt-1">
              E.g., yourname@paytm, yourname@phonepe, etc.
            </p>
          </div>

          {/* Merchant Name Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Merchant Name
            </label>
            <input
              type="text"
              placeholder="Gonvecs"
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Generate QR Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerateQR}
            disabled={isGenerating}
            className="btn-primary w-full disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Generate QR Code'}
          </motion.button>

          {/* QR Preview */}
          {qrImage && (
            <div className="bg-dark-700 rounded-lg p-6 text-center">
              <p className="text-gray-300 mb-4">QR Code Preview:</p>
              <img
                src={qrImage}
                alt="UPI QR Code"
                className="w-48 h-48 mx-auto rounded-lg border-2 border-accent-gold"
              />
              <p className="text-xs text-gray-500 mt-4">
                This QR code will be displayed to users for wallet top-up
              </p>
            </div>
          )}

          {/* Save QR Button */}
          {qrImage && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveQR}
              disabled={isSaving}
              className="btn-secondary w-full disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Upload size={18} />
              {isSaving ? 'Saving...' : 'Save QR Code'}
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* System Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-dark-800 border border-dark-700 rounded-lg p-8"
      >
        <h2 className="text-2xl font-bold text-gray-100 mb-6">System Information</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Admin Email:</span>
            <span className="text-accent-gold font-semibold">
              {process.env.NEXT_PUBLIC_ADMIN_EMAIL}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Environment:</span>
            <span className="text-accent-gold font-semibold">
              {process.env.NODE_ENV || 'development'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">App URL:</span>
            <span className="text-accent-gold font-semibold">
              {process.env.NEXT_PUBLIC_APP_URL}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
