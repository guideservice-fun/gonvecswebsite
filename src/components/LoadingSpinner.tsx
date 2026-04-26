'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({
  size = 'md',
}) => {
  const sizeMap = {
    sm: 20,
    md: 40,
    lg: 60,
  };

  return (
    <motion.div
      className="flex items-center justify-center"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <div
        className="border-4 border-dark-700 border-t-accent-gold rounded-full"
        style={{ width: sizeMap[size], height: sizeMap[size] }}
      />
    </motion.div>
  );
};
