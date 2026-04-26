'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';

export const ToastProvider: React.FC = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#111836',
          color: '#e8e8e8',
          border: '1px solid #252d47',
          borderRadius: '0.5rem',
          padding: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
        },
        success: {
          style: {
            background: '#10b981',
            color: '#fff',
          },
          icon: '✅',
        },
        error: {
          style: {
            background: '#ef4444',
            color: '#fff',
          },
          icon: '❌',
        },
      }}
    />
  );
};
