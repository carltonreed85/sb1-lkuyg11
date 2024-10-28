import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${
      type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
    }`}>
      <div className="flex items-center">
        {type === 'success' ? (
          <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
        ) : (
          <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
        )}
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="ml-4 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}