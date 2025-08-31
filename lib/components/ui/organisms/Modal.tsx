'use client';

import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { Button } from '../atoms';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'overlay' | 'drawer' | 'centered';
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
  overlayClassName?: string;
  footer?: React.ReactNode;
  preventBodyScroll?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  variant = 'default',
  closeOnOverlay = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = '',
  overlayClassName = '',
  footer,
  preventBodyScroll = true
}) => {
  // Handle escape key
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && closeOnEscape) {
      onClose();
    }
  }, [onClose, closeOnEscape]);

  // Handle body scroll prevention
  useEffect(() => {
    if (isOpen && preventBodyScroll) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, preventBodyScroll]);

  // Add escape key listener
  useEffect(() => {
    if (isOpen && closeOnEscape) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, handleEscape, closeOnEscape]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  const variantStyles = {
    default: {
      overlay: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50',
      modal: 'bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full transform transition-all duration-200 ease-out'
    },
    overlay: {
      overlay: 'fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center p-4 z-50',
      modal: 'bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full transform transition-all duration-200 ease-out'
    },
    drawer: {
      overlay: 'fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50',
      modal: 'bg-white dark:bg-gray-800 rounded-t-lg shadow-xl w-full transform transition-all duration-300 ease-out translate-y-0'
    },
    centered: {
      overlay: 'fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-8 z-50',
      modal: 'bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full transform transition-all duration-200 ease-out max-h-[90vh] overflow-hidden'
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlay) {
      onClose();
    }
  };

  return (
    <div 
      className={`${variantStyles[variant].overlay} ${overlayClassName}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div 
        className={`${variantStyles[variant].modal} ${sizeClasses[size]} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            {title && (
              <h2 
                id="modal-title" 
                className="text-xl font-semibold text-gray-900 dark:text-gray-100"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="ml-auto"
                aria-label="Close modal"
              >
                <X size={20} />
              </Button>
            )}
          </div>
        )}

        {/* Content */}
        <div className={`${variant === 'centered' ? 'overflow-y-auto' : ''} ${title || showCloseButton ? 'p-6' : 'p-6'}`}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900 rounded-b-lg">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;