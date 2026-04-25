'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Product, Category } from '@/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const { data: cats } = await supabase.from('categories').select('*');
        setCategories(cats || []);

        // Fetch products
        let query = supabase.from('products').select(`
          *,
          product_images(*)
        `);

        if (selectedCategory) {
          query = query.eq('category_id', selectedCategory);
        }

        const { data: prods } = await query;
        setProducts(prods || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-dark-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-100 mb-2">Shop Our Collection</h1>
          <p className="text-gray-400">Discover premium tech and streetwear</p>
        </motion.div>

        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 btn-secondary md:hidden"
          >
            <Filter size={18} />
            Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`md:block ${showFilters ? 'block' : 'hidden'}`}
          >
            <div className="bg-dark-800 border border-dark-700 rounded-lg p-6 sticky top-24">
              <h3 className="font-bold text-gray-100 mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === null
                      ? 'bg-accent-gold text-dark-900'
                      : 'hover:bg-dark-700 text-gray-300'
                  }`}
                >
                  All Products
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-accent-gold text-dark-900'
                        : 'hover:bg-dark-700 text-gray-300'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="skeleton h-96 rounded-lg"></div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {products.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group cursor-pointer"
                  >
                    <Link href={`/products/${product.id}`}>
                      <div className="bg-dark-800 rounded-lg overflow-hidden mb-4 card-hover h-64 relative">
                        <div className="w-full h-full bg-gradient-to-br from-dark-700 to-dark-600 flex items-center justify-center group-hover:from-dark-600 group-hover:to-dark-500 transition-all duration-300">
                          <span className="text-accent-gold font-semibold text-center px-4">
                            {product.name}
                          </span>
                        </div>
                        {product.stock_tag && (
                          <div className="absolute top-4 right-4 bg-accent-gold text-dark-900 px-3 py-1 rounded-full text-sm font-semibold">
                            {product.stock_tag}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-100 group-hover:text-accent-gold transition-colors line-clamp-2">
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
          </div>
        </div>
      </div>
    </div>
  );
}
