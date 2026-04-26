'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
  const sections = [
    {
      title: 'Introduction',
      content: `At Gonvecs, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.`,
    },
    {
      title: 'Information We Collect',
      content: `We may collect information about you in a variety of ways. The information we may collect on the site includes:
      
• Personal Data: Firstname, lastname, email address, phone number, and any other details you voluntarily provide.
• Wallet Information: Details related to your wallet transactions and UPI payments.
• Usage Data: Information about how you interact with our website and products.`,
    },
    {
      title: 'How We Use Your Information',
      content: `Gonvecs uses the information we collect in various ways, including to:
      
• Provide and maintain our services
• Process your wallet transactions
• Send promotional communications
• Improve our website and services
• Comply with legal obligations`,
    },
    {
      title: 'Security of Your Information',
      content: `We implement appropriate technical and organizational measures designed to protect the security of your personal information. However, please be aware that no security measures are perfect or impenetrable.`,
    },
    {
      title: 'Contact Us',
      content: `If you have questions or concerns about this Privacy Policy, please contact us at contact@gonvecs.in`,
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
          <h1 className="text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
        </motion.div>

        <div className="space-y-8">
          {sections.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-dark-800 border border-dark-700 rounded-lg p-8"
            >
              <h2 className="text-2xl font-bold text-accent-gold mb-4">
                {section.title}
              </h2>
              <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
