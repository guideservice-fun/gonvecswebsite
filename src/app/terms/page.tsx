'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function TermsPage() {
  const sections = [
    {
      title: 'Agreement to Terms',
      content: `These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity (you or User) and Gonvecs (Company, we, us, or our), concerning your access to and use of the gonvecs.vercel.app website and all related applications, software, tools, and services available through the Website.`,
    },
    {
      title: 'Intellectual Property Rights',
      content: `Unless otherwise indicated, the Website is our proprietary property, and all source code, databases, functionality, software, website designs, audio, video, text, and graphics on the Website (collectively, the Content) and the trademarks, service marks, and logos contained therein (the Marks) are owned or controlled by us or licensed to us.`,
    },
    {
      title: 'User Responsibilities',
      content: `As a user of Gonvecs, you agree to:
      
• Provide accurate and complete information
• Maintain the confidentiality of your account
• Notify us immediately of any unauthorized use
• Comply with all applicable laws and regulations
• Not engage in any prohibited conduct`,
    },
    {
      title: 'Wallet and Payment Terms',
      content: `The wallet system is designed for purchasing products on our platform. UPI transactions are verified through UTR numbers. We reserve the right to reject transactions that do not meet our verification criteria. All transactions are final once approved.`,
    },
    {
      title: 'Limitation of Liability',
      content: `To the fullest extent permitted by applicable law, in no event will Company be liable to you in contract, tort, or otherwise for any indirect, incidental, special, consequential, or punitive damages.`,
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
          <h1 className="text-5xl font-bold mb-4">Terms & Conditions</h1>
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
