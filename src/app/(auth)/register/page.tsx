'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { isValidPassword, isValidEmail } from '@/lib/auth';
import toast, { Toaster } from 'react-hot-toast';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuthStore();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation
      if (!firstName || !lastName) {
        toast.error('Please enter your full name');
        return;
      }

      if (!isValidEmail(email)) {
        toast.error('Please enter a valid email');
        return;
      }

      if (!isValidPassword(password)) {
        toast.error('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
        return;
      }

      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // Create profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user?.id,
        first_name: firstName,
        last_name: lastName,
        email,
        wallet_balance: 0,
      });

      if (profileError) throw profileError;

      setUser({
        id: authData.user!.id,
        email,
        firstName,
        lastName,
        walletBalance: 0,
        createdAt: new Date().toISOString(),
      });

      toast.success('Account created! Please verify your email.');
      router.push('/');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-800 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-dark-800 border border-dark-700 rounded-lg p-8">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-accent-gold to-accent-silver bg-clip-text text-transparent">
              Join Gonvecs
            </h1>
            <p className="text-gray-400 mb-8">Create your account to get started</p>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">First Name</label>
                  <input
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Min. 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
                {!isLoading && <ArrowRight size={18} />}
              </motion.button>
            </form>

            <p className="text-center text-gray-400 mt-6">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-accent-gold hover:text-accent-silver transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
