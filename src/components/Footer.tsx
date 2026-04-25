'use client';

import React from 'react';
import Link from 'next/link';
import { Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms & Conditions', href: '/terms' },
        { label: 'Refund/Return', href: '/refund' },
      ],
    },
    {
      title: 'Shop',
      links: [
        { label: 'Shop All', href: '/products' },
        { label: 'Categories', href: '/categories' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Contact Us', href: '/contact' },
      ],
    },
  ];

  return (
    <footer className="bg-dark-800 border-t border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Slogan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h3 className="text-xl font-bold bg-gradient-to-r from-accent-gold to-accent-silver bg-clip-text text-transparent">
            Forged With Precision, Loaded With Style!
          </h3>
        </motion.div>

        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {sections.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <h4 className="font-semibold text-accent-gold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-accent-gold transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-semibold text-accent-gold mb-4">Follow Us</h4>
            <a
              href="https://instagram.com/gonvecs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-accent-gold transition-colors"
            >
              <Instagram size={20} />
              <span>Instagram</span>
            </a>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-dark-700 pt-8">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center text-gray-500 text-sm"
          >
            © {currentYear} Gonvecs. All rights reserved. | Crafted with precision and style.
          </motion.p>
        </div>
      </div>
    </footer>
  );
};
