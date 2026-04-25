'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { Heart, ShoppingCart, User, Wallet, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  const navItems = [
    { label: 'About', href: '/about' },
    { label: 'Products', href: '/products' },
    { label: 'Categories', href: '/categories' },
    { label: 'Contact Us', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-dark-900 border-b border-dark-700">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-accent-gold to-accent-silver bg-clip-text text-transparent"
            >
              Gonvecs
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, idx) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="text-gray-300 hover:text-accent-gold transition-colors duration-300"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Wallet */}
            {user && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-dark-800 rounded-lg border border-dark-600 hover:border-accent-gold transition-colors cursor-pointer"
              >
                <Wallet size={18} className="text-accent-gold" />
                <span className="text-sm font-semibold text-accent-gold">
                  ₹{user.walletBalance.toFixed(2)}
                </span>
              </motion.div>
            )}

            {/* Icons */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <Link href="/wishlist" className="btn-icon relative">
                <Heart size={20} />
              </Link>

              <Link href="/cart" className="btn-icon relative">
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-accent-gold text-dark-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              <Link href={user ? '/account' : '/auth/login'} className="btn-icon">
                <User size={20} />
              </Link>
            </motion.div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden btn-icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 pt-4 border-t border-dark-700 space-y-2"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-gray-300 hover:text-accent-gold hover:bg-dark-800 rounded-lg transition-colors"
              >
                {item.label}
              </Link>
            ))}
            {user && (
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-red-400 hover:bg-dark-800 rounded-lg transition-colors"
              >
                Logout
              </button>
            )}
          </motion.div>
        )}
      </nav>
    </header>
  );
};
