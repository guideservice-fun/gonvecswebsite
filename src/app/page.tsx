'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            product_images(*)
          `)
          .eq('is_new', true)
          .limit(3);

        if (error) throw error;
        setNewArrivals(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    toast.success('Thanks for subscribing!');
    setEmail('');
  };

  return (
    <>
      <Toaster position="top-center" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-dark-800 to-dark-900 pt-20 pb-32 md:pt-32 md:pb-48">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-gold/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-primary/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-accent-gold via-accent-silver to-accent-gold bg-clip-text text-transparent">
                Forged With Precision
              </span>
              <br />
              <span className="text-gray-300">Loaded With Style</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Discover our curated collection of premium tech and streetwear designed for those who demand excellence.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/products" className="btn-primary inline-flex items-center gap-2">
                Shop Now
                <ArrowRight size={20} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">New Arrivals</h2>
            <p className="text-gray-400">Fresh additions to our collection</p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-96 rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {newArrivals.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group cursor-pointer"
                >
                  <Link href={`/products/${product.id}`}>
                    <div className="bg-dark-800 rounded-lg overflow-hidden mb-4 card-hover h-64 relative">
                      {/* Placeholder or actual image */}
                      <div className="w-full h-full bg-gradient-to-br from-dark-700 to-dark-600 flex items-center justify-center group-hover:from-dark-600 group-hover:to-dark-500 transition-all duration-300">
                        <span className="text-accent-gold font-semibold">{product.name}</span>
                      </div>
                      {product.stock_tag && (
                        <div className="absolute top-4 right-4 bg-accent-gold text-dark-900 px-3 py-1 rounded-full text-sm font-semibold">
                          {product.stock_tag}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-100 group-hover:text-accent-gold transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-2xl font-bold text-accent-gold">
                          ₹{product.real_price}
                        </span>
                        {product.old_price && (
                          <span className="text-lg text-gray-500 line-through">
                            ₹{product.old_price}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link href="/products" className="btn-secondary inline-flex items-center gap-2">
              View All Products
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-dark-800 border-t border-dark-700">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
            <p className="text-gray-400 mb-8">Subscribe to our newsletter for exclusive offers and new arrivals.</p>

            <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field flex-1"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap"
              >
                Subscribe
                <Mail size={20} />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>
    </>
  );
}
