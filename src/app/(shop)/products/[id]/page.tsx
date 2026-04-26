'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { Product } from '@/types';
import toast, { Toaster } from 'react-hot-toast';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const isFavorited = isInWishlist(id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await supabase
          .from('products')
          .select(`
            *,
            product_images(*)
          `)
          .eq('id', id)
          .single();

        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Product not found');
        router.push('/products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, router]);

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      productId: product.id,
      quantity,
      product,
    });
    toast.success(`Added ${quantity} to cart`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: `Check out ${product?.name} on Gonvecs!`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 py-12 flex items-center justify-center">
        <div className="skeleton w-full h-96 max-w-2xl rounded-lg"></div>
      </div>
    );
  }

  if (!product) return null;

  const images = product.images || [];
  const currentImage = images.length > 0 ? images[currentImageIndex] : null;

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-dark-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-accent-gold transition-colors mb-8"
          >
            <ChevronLeft size={20} />
            Back
          </motion.button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="bg-dark-800 rounded-lg overflow-hidden h-96 md:h-[500px] flex items-center justify-center relative group">
                {currentImage ? (
                  <img
                    src={currentImage.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-dark-700 to-dark-600 flex items-center justify-center">
                    <span className="text-accent-gold font-semibold text-center px-4">
                      {product.name}
                    </span>
                  </div>
                )}

                {/* Image Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-dark-900/50 hover:bg-dark-900 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-dark-900/50 hover:bg-dark-900 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Grid */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {images.map((img, idx) => (
                    <motion.button
                      key={img.id}
                      onClick={() => setCurrentImageIndex(idx)}
                      whileHover={{ scale: 1.05 }}
                      className={`rounded-lg overflow-hidden h-20 border-2 transition-colors ${
                        idx === currentImageIndex
                          ? 'border-accent-gold'
                          : 'border-dark-700 hover:border-accent-gold'
                      }`}
                    >
                      <img
                        src={img.image_url}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Header */}
              <div>
                <h1 className="text-4xl font-bold text-gray-100 mb-2">{product.name}</h1>
                {product.stock_tag && (
                  <span className="inline-block bg-accent-gold/20 text-accent-gold px-3 py-1 rounded-full text-sm font-semibold">
                    {product.stock_tag}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-accent-gold">
                    ₹{product.real_price}
                  </span>
                  {product.old_price && (
                    <span className="text-2xl text-gray-500 line-through">
                      ₹{product.old_price}
                    </span>
                  )}
                </div>
                {product.old_price && (
                  <p className="text-accent-gold font-semibold">
                    Save ₹{(product.old_price - product.real_price).toFixed(2)} (
                    {Math.round(((product.old_price - product.real_price) / product.old_price) * 100)}%)
                  </p>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="bg-dark-800 border border-dark-700 rounded-lg p-4">
                  <p className="text-gray-300">{product.description}</p>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-dark-800 hover:bg-dark-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    −
                  </button>
                  <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-dark-800 hover:bg-dark-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </motion.button>

                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleItem(id)}
                    className={`py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
                      isFavorited
                        ? 'bg-accent-gold/20 border-2 border-accent-gold text-accent-gold'
                        : 'btn-secondary'
                    }`}
                  >
                    <Heart size={18} fill={isFavorited ? 'currentColor' : 'none'} />
                    {isFavorited ? 'Favorited' : 'Add to Wishlist'}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleShare}
                    className="btn-secondary flex items-center justify-center gap-2"
                  >
                    <Share2 size={18} />
                    Share
                  </motion.button>
                </div>
              </div>

              {/* Info Cards */}
              <div className="space-y-3 pt-6 border-t border-dark-700">
                {[
                  { title: '🚚 Fast Shipping', desc: 'Delivered to your doorstep' },
                  { title: '🔒 Secure Payment', desc: 'Safe wallet-based transactions' },
                  { title: '↩️ Easy Returns', desc: '7-day return policy' },
                ].map((info, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="text-xl">{info.title.split(' ')[0]}</div>
                    <div>
                      <p className="font-semibold text-gray-200">{info.title.split(' ').slice(1).join(' ')}</p>
                      <p className="text-sm text-gray-400">{info.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
