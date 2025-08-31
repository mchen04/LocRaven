import React from 'react';
import Modal from './Modal';
import { Button } from '../atoms';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  isLoading?: boolean;
  requireTextConfirmation?: boolean;
  confirmationText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
  requireTextConfirmation = false,
  confirmationText = 'CONFIRM'
}) => {
  const [textInput, setTextInput] = React.useState('');
  
  const isConfirmDisabled = requireTextConfirmation 
    ? textInput !== confirmationText || isLoading
    : isLoading;

  const variantConfig = {
    danger: {
      icon: XCircle,
      iconColor: 'text-red-500',
      buttonVariant: 'danger' as const,
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-yellow-500', 
      buttonVariant: 'warning' as const,
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-500',
      buttonVariant: 'primary' as const,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    success: {
      icon: CheckCircle,
      iconColor: 'text-green-500',
      buttonVariant: 'success' as const,
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    }
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = () => {
    if (!isConfirmDisabled) {
      onConfirm();
    }
  };

  // Reset text input when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setTextInput('');
    }
  }, [isOpen]);

  const footer = (
    <div className="flex justify-end space-x-3">
      <Button
        variant="outline"
        onClick={onClose}
        disabled={isLoading}
      >
        {cancelText}
      </Button>
      <Button
        variant={config.buttonVariant}
        onClick={handleConfirm}
        disabled={isConfirmDisabled}
        loading={isLoading}
      >
        {confirmText}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={footer}
      closeOnOverlay={!isLoading}
      closeOnEscape={!isLoading}
    >
      <div className={`rounded-lg p-4 mb-4 ${config.bgColor}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${config.iconColor}`} />
          </div>
          <div className="ml-3">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {message}
            </p>
          </div>
        </div>
      </div>

      {requireTextConfirmation && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type <span className="font-mono font-bold">{confirmationText}</span> to confirm:
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={confirmationText}
            disabled={isLoading}
          />
        </div>
      )}
    </Modal>
  );
};

export default ConfirmationModal;