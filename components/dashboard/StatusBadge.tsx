// components/dashboard/StatusBadge.tsx
import React from 'react';

interface StatusBadgeProps {
  status: 'approved' | 'disapproved' | 'pending' | 'rejected';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'disapproved':
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDisplayText = () => {
    if (status === 'disapproved') return 'Disapproved';
    if (status === 'rejected') return 'Rejected';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusStyles()}`}
    >
      {getDisplayText()}
    </span>
  );
};