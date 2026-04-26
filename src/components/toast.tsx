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
        },
      }}
    />
  );
};
