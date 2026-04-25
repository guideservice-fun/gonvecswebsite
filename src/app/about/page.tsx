'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const founders = [
    {
      name: 'Nihar Patil',
      title: 'Founder',
      description: 'He is well experienced in management and backend system handling. He is founder at Gonvecs as well as COO at another company named Grovefan.',
      icon: '👨‍💼',
    },
    {
      name: 'Amit Sharma',
      title: 'Co-Founder',
      description: 'He is well versed in fashion and has a good knowledge and idea about it, working as lead designer and Co-Founder at Gonvecs.',
      icon: '🎨',
    },
  ];

  return (
    <div className="min-h-screen bg-dark-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-accent-gold to-accent-silver bg-clip-text text-transparent">
              About Gonvecs
            </span>
          </h1>
          <p className="text-xl text-gray-400">
            Forged With Precision, Loaded With Style
          </p>
        </motion.div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-dark-800 border border-dark-700 rounded-lg p-12 mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-100 mb-6">Our Story</h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-4">
            Gonvecs is a premium high-end tech and streetwear store designed for individuals
            who appreciate quality, precision, and style. We believe that fashion and technology
            should work together to create unique, unforgettable experiences.
          </p>
          <p className="text-gray-400 text-lg leading-relaxed">
            Our curated collection brings together the finest tech accessories and streetwear pieces,
            each selected for its quality, design, and cultural relevance. We're not just a store—
            we're a lifestyle.
          </p>
        </motion.div>

        {/* Founders Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-100 mb-12 text-center">Our Founders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {founders.map((founder, idx) => (
              <motion.div
                key={founder.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-dark-800 border border-dark-700 rounded-lg p-8 hover:border-accent-gold transition-colors"
              >
                <div className="text-6xl mb-4">{founder.icon}</div>
                <h3 className="text-2xl font-bold text-gray-100 mb-1">{founder.name}</h3>
                <p className="text-accent-gold font-semibold mb-4">{founder.title}</p>
                <p className="text-gray-400 leading-relaxed">{founder.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-dark-800 border border-dark-700 rounded-lg p-12"
        >
          <h2 className="text-3xl font-bold text-gray-100 mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Quality',
                description: 'We meticulously curate every product to ensure the highest standards.',
              },
              {
                title: 'Style',
                description: 'Fashion-forward selections that make a statement.',
              },
              {
                title: 'Innovation',
                description: 'Blending technology with contemporary design for the modern lifestyle.',
              },
            ].map((value, idx) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <h3 className="text-xl font-bold text-accent-gold mb-2">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
