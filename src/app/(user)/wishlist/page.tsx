'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import toast, { Toaster } from 'react-hot-toast';

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();

  const handleAddToCart = (productId: string, name: string) => {
    // In a real app, fetch the product details
    toast.success(`${name} added to cart!`);
  };

  if (items.length === 0) {
    return (
      <>
        <Toaster position="top-center" />
        <div className="min-h-screen bg-dark-900 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-100 mb-12">My Wishlist</h1>

            <div className="bg-dark-800 border border-dark-700 rounded-lg p-12 text-center">
              <Heart size={48} className="mx-auto text-gray-500 mb-4" />
              <p className="text-gray-400 text-lg mb-6">Your wishlist is empty</p>
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
          <h1 className="text-4xl font-bold text-gray-100 mb-12">My Wishlist</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((productId, idx) => (
              <motion.div
                key={productId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-dark-800 border border-dark-700 rounded-lg overflow-hidden hover:border-accent-gold transition-colors group"
              >
                {/* Product Image */}
                <div className="w-full h-48 bg-gradient-to-br from-dark-700 to-dark-600 flex items-center justify-center relative overflow-hidden">
                  <span className="text-accent-gold font-semibold text-center px-4">
                    Product
                  </span>

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => handleAddToCart(productId, 'Product')}
                      className="bg-accent-gold text-dark-900 p-3 rounded-lg hover:bg-accent-silver transition-colors"
                    >
                      <ShoppingCart size={20} />
                    </motion.button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-100 mb-2 line-clamp-2">
                    Product Name
                  </h3>
                  <p className="text-accent-gold font-bold mb-4">₹0.00</p>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => removeItem(productId)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-900/20 hover:bg-red-900/40 text-red-300 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                    Remove
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
