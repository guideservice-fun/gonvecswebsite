'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Category } from '@/types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-dark-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-100 mb-4">Shop by Category</h1>
          <p className="text-xl text-gray-400">
            Explore our curated collection of premium items
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton h-64 rounded-lg"></div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No categories available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, idx) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => router.push(`/products?category=${category.id}`)}
                className="bg-dark-800 border-2 border-dark-700 hover:border-accent-gold rounded-lg overflow-hidden transition-colors group cursor-pointer text-left"
              >
                <div className="h-48 bg-gradient-to-br from-dark-700 to-dark-600 flex items-center justify-center group-hover:from-dark-600 group-hover:to-dark-500 transition-all">
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">🛍️</span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-100 group-hover:text-accent-gold transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
