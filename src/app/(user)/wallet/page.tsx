'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowDown, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import * as QRCode from 'qrcode';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { Transaction } from '@/types';
import toast, { Toaster } from 'react-hot-toast';

export default function WalletPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [utrNumber, setUtrNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch QR code URL from admin settings
        const { data: settings } = await supabase
          .from('admin_settings')
          .select('qr_code_url')
          .limit(1)
          .single();

        if (settings?.qr_code_url) {
          setQrImage(settings.qr_code_url);
        } else {
          // Generate a placeholder QR code
          const upiUrl = 'upi://pay?pa=merchant@upi&pn=Gonvecs&am=0&tn=Wallet%20TopUp';
          const qrCodeDataUrl = await QRCode.toDataURL(upiUrl);
          setQrImage(qrCodeDataUrl);
        }

        // Fetch transactions
        const { data: txns } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        setTransactions(txns || []);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  const handleSubmitTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!utrNumber || !amount) {
        toast.error('Please enter UTR and amount');
        return;
      }

      const parsedAmount = parseFloat(amount);
      if (parsedAmount <= 0) {
        toast.error('Amount must be greater than 0');
        return;
      }

      // Insert transaction
      const { error } = await supabase.from('transactions').insert({
        user_id: user!.id,
        utr_number: utrNumber.toUpperCase(),
        amount: parsedAmount,
        status: 'pending',
      });

      if (error) throw error;

      toast.success('Transaction submitted! Waiting for admin approval.');
      setUtrNumber('');
      setAmount('');

      // Refresh transactions
      const { data: txns } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      setTransactions(txns || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="text-green-400" size={18} />;
      case 'rejected':
        return <AlertCircle className="text-red-400" size={18} />;
      case 'pending':
        return <Clock className="text-yellow-400" size={18} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-dark-900 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Wallet Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-100 mb-2">Wallet</h1>
            <p className="text-gray-400">Manage your account balance</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: QR Code & Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-dark-800 border border-dark-700 rounded-lg p-8 mb-8"
              >
                <div className="flex items-center gap-2 mb-6">
                  <ArrowDown size={24} className="text-accent-gold" />
                  <h2 className="text-2xl font-bold">Top Up Your Wallet</h2>
                </div>

                <div className="mb-8">
                  <p className="text-gray-400 mb-4">Scan this QR code with any UPI app to send money:</p>
                  {qrImage ? (
                    <div className="flex justify-center p-6 bg-dark-700 rounded-lg">
                      <img
                        src={qrImage}
                        alt="UPI QR Code"
                        className="w-64 h-64 object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="flex justify-center p-6 bg-dark-700 rounded-lg">
                      <div className="text-center">
                        <p className="text-gray-500">Loading QR code...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Transaction Form */}
                <form onSubmit={handleSubmitTransaction} className="space-y-4">
                  <p className="text-sm text-gray-400">
                    After making the payment, enter your UTR and amount below for verification:
                  </p>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">UTR Number</label>
                    <input
                      type="text"
                      placeholder="Enter UTR Number"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value.toUpperCase())}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Amount (₹)</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="input-field"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
                  </motion.button>
                </form>
              </motion.div>
            </div>

            {/* Right: Balance & Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="sticky top-24"
            >
              <div className="bg-dark-800 border border-dark-700 rounded-lg p-8 mb-8">
                <p className="text-gray-400 text-sm mb-2">Current Balance</p>
                <p className="text-4xl font-bold text-accent-gold mb-4">
                  ₹{user.walletBalance.toFixed(2)}
                </p>
                <div className="bg-dark-700 rounded-lg p-4">
                  <p className="text-xs text-gray-500">
                    🔒 Your wallet is secure and managed by Gonvecs.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Transaction History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold text-gray-100 mb-6">Transaction History</h2>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton h-16 rounded-lg"></div>
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <div className="bg-dark-800 border border-dark-700 rounded-lg p-12 text-center">
                <p className="text-gray-400">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((txn, idx) => (
                  <motion.div
                    key={txn.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-dark-800 border border-dark-700 rounded-lg p-6 flex items-center justify-between hover:border-accent-gold transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center">
                        {getStatusIcon(txn.status)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-100">UTR: {txn.utr_number}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(txn.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-accent-gold">₹{txn.amount}</p>
                      <span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                        txn.status === 'approved'
                          ? 'bg-green-400/20 text-green-400'
                          : txn.status === 'rejected'
                          ? 'bg-red-400/20 text-red-400'
                          : 'bg-yellow-400/20 text-yellow-400'
                      }`}>
                        {txn.status}
                      </span>
                    </div>
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
