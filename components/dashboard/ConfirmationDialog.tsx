// components/dashboard/ConfirmationDialog.tsx
import React from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'success' | 'danger';
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning'
}) => {
  if (!isOpen) return null;

  const icons = {
    warning: <AlertTriangle className="h-6 w-6 text-amber-600" />,
    success: <CheckCircle className="h-6 w-6 text-green-600" />,
    danger: <XCircle className="h-6 w-6 text-red-600" />
  };

  const colors = {
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      iconBg: 'bg-amber-100',
      button: 'bg-amber-600 hover:bg-amber-700'
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      iconBg: 'bg-green-100',
      button: 'bg-green-600 hover:bg-green-700'
    },
    danger: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      iconBg: 'bg-red-100',
      button: 'bg-red-600 hover:bg-red-700'
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header with Icon */}
        <div className={`${colors[type].bg} ${colors[type].border} border-b px-6 py-5 rounded-t-xl`}>
          <div className="flex items-center gap-4">
            <div className={`${colors[type].iconBg} rounded-full p-3`}>
              {icons[type]}
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              {title}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <p className="text-gray-700 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-5 py-2.5 ${colors[type].button} text-white rounded-lg font-medium transition-colors shadow-sm`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};