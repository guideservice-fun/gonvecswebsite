'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function RefundPage() {
  const policy = [
    {
      title: '7-Day Return Policy',
      content: 'Products can be returned within 7 days of delivery. Items must be in original condition with all tags intact.',
    },
    {
      title: 'Return Process',
      content: 'Contact our support team at contact@gonvecs.in with your order number. We will provide you with return shipping instructions.',
    },
    {
      title: 'Refund Processing',
      content: 'Once your return is received and inspected, refunds will be credited to your wallet within 5-7 business days.',
    },
    {
      title: 'Non-Returnable Items',
      content: 'Customized items, clearance items, and items without original tags cannot be returned.',
    },
    {
      title: 'Damaged or Defective Items',
      content: 'If you receive a damaged or defective item, please report it within 24 hours. We will replace or refund the item at no cost.',
    },
    {
      title: 'Shipping Costs',
      content: 'Original shipping is free. Return shipping costs must be borne by the customer unless the item is defective.',
    },
  ];

  return (
    <div className="min-h-screen bg-dark-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">Refund & Return Policy</h1>
          <p className="text-gray-400">
            We want you to be completely satisfied with your purchase. Here's how our return and refund policy works.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {policy.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-dark-800 border border-dark-700 rounded-lg p-8 hover:border-accent-gold transition-colors"
            >
              <h3 className="text-xl font-bold text-accent-gold mb-3">
                {item.title}
              </h3>
              <p className="text-gray-300">{item.content}</p>
            </motion.div>
          ))}
        </div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-12 bg-dark-800 border border-dark-700 rounded-lg p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Questions?</h2>
          <p className="text-gray-400 mb-6">
            Our support team is here to help. Contact us at contact@gonvecs.in
          </p>
        </motion.div>
      </div>
    </div>
  );
}
