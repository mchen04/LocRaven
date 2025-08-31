'use client';

import React, { useState } from 'react';
import { RefreshCw, Trash2, Calendar, Clock } from 'lucide-react';
import Modal from '../organisms/Modal';
import { Button, Icon } from '../atoms';
import { getExpiryDateByPeriod } from '../../../utils/dateFormatters';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data?: unknown) => void;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger' | 'warning';
  showIcon?: boolean;
  loading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  showIcon = true,
  loading = false
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  const getIcon = () => {
    const iconMap = {
      danger: { name: 'error' as const, className: 'text-red-500' },
      warning: { name: 'warning' as const, className: 'text-yellow-500' },
      default: { name: 'info' as const, className: 'text-blue-500' }
    };

    const config = iconMap[variant as keyof typeof iconMap] || iconMap.default;
    
    return (
      <Icon
        name={config.name}
        size={48}
        className={config.className}
        variant="outline"
      />
    );
  };

  const getButtonVariant = () => {
    switch (variant) {
      case 'danger':
        return 'danger';
      case 'warning':
        return 'warning';
      default:
        return 'primary';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      variant="centered"
    >
      <div className="confirmation-modal-content">
        {showIcon && (
          <div className="flex justify-center mb-4">
            {getIcon()}
          </div>
        )}
        
        <div className="text-center mb-6">
          {typeof message === 'string' ? <p>{message}</p> : message}
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={getButtonVariant()}
            onClick={handleConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export interface ReactivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (expiryDate: Date) => void;
  pageTitle: string;
  loading?: boolean;
}

export const ReactivationModal: React.FC<ReactivationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  pageTitle,
  loading = false
}) => {
  const [selectedOption, setSelectedOption] = useState<'24h' | '7d' | '30d' | 'custom'>('24h');
  const [customDate, setCustomDate] = useState<string>('');

  const handleConfirm = () => {
    const expiryDate = getExpiryDateByPeriod(selectedOption, customDate);
    if (expiryDate > new Date()) {
      onConfirm(expiryDate);
    }
  };

  // Set minimum datetime to current time
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // At least 30 minutes from now
    return now.toISOString().slice(0, 16);
  };

  const isCustomDateValid = selectedOption !== 'custom' || 
    (customDate && new Date(customDate) > new Date());

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reactivate Page"
      size="md"
    >
      <div className="reactivation-modal-content">
        <p className="mb-4">Reactivate &quot;{pageTitle}&quot; until:</p>
        
        <div className="space-y-3 mb-6">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="expiry"
              value="24h"
              checked={selectedOption === '24h'}
              onChange={(e) => setSelectedOption(e.target.value as '24h')}
              className="text-blue-600"
            />
            <Clock size={16} className="text-gray-500" />
            <span>24 hours from now</span>
          </label>
          
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="expiry"
              value="7d"
              checked={selectedOption === '7d'}
              onChange={(e) => setSelectedOption(e.target.value as '7d')}
              className="text-blue-600"
            />
            <Calendar size={16} className="text-gray-500" />
            <span>7 days from now</span>
          </label>
          
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="expiry"
              value="30d"
              checked={selectedOption === '30d'}
              onChange={(e) => setSelectedOption(e.target.value as '30d')}
              className="text-blue-600"
            />
            <Calendar size={16} className="text-gray-500" />
            <span>30 days from now</span>
          </label>
          
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="expiry"
              value="custom"
              checked={selectedOption === 'custom'}
              onChange={(e) => setSelectedOption(e.target.value as 'custom')}
              className="text-blue-600"
            />
            <Calendar size={16} className="text-gray-500" />
            <span>Custom date:</span>
          </label>
          
          {selectedOption === 'custom' && (
            <div className="ml-8">
              <input
                type="datetime-local"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                min={getMinDateTime()}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!isCustomDateValid}
            loading={loading}
          >
            <RefreshCw size={16} />
            Reactivate
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  pageTitle: string;
  loading?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  pageTitle,
  loading = false
}) => {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Page Permanently"
      message={
        <div className="space-y-3">
          <p>Are you sure you want to permanently delete this page?</p>
          <p className="font-medium text-gray-900">&quot;{pageTitle}&quot;</p>
          <p className="text-sm text-red-600">This action cannot be undone.</p>
        </div>
      }
      confirmText="Delete Permanently"
      variant="danger"
      loading={loading}
    />
  );
};

export default ConfirmationModal;