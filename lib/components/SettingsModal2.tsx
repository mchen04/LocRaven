'use client';

import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBusiness } from '../contexts/BusinessContext';
import { Modal, ConfirmationModal } from './ui/organisms';
import { Button } from './ui/atoms';
import SubscriptionManager from './SubscriptionManager';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { business, deleteBusinessProfile } = useBusiness();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<'account' | 'subscription'>('account');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setShowDeleteConfirmation(false);
      setActiveTab('account');
    }
  }, [isOpen]);

  const handleDeleteProfile = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteBusinessProfile();
      if (result.success) {
        setShowDeleteConfirmation(false);
        onClose();
        
        alert('Profile deleted successfully! All business data, generated pages, and category listings have been removed.');
      } else {
        const errorMessage = result.error || 'Failed to delete profile';
        alert(`Delete failed: ${errorMessage}. Please try again or contact support.`);
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      alert('An unexpected error occurred while deleting the profile. Please try again or contact support.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen && !showDeleteConfirmation}
        onClose={onClose}
        title="Settings"
        size="lg"
      >
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'account' 
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
            onClick={() => setActiveTab('account')}
          >
            Account
          </button>
          <button
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'subscription' 
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
            onClick={() => setActiveTab('subscription')}
          >
            Subscription
          </button>
        </div>

        {activeTab === 'account' ? (
          /* Account Tab */
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Account Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Email</span>
                  <span className="text-gray-900 dark:text-gray-100">{user?.email || 'No email available'}</span>
                </div>
                {business && (
                  <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Business</span>
                    <span className="text-gray-900 dark:text-gray-100">{business.name || 'Unnamed Business'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Danger Zone</h3>
              <div className="flex items-start justify-between">
                <div className="flex-1 mr-4">
                  <h4 className="font-medium text-red-700 dark:text-red-300">Delete Business Profile</h4>
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    This will permanently delete your business profile and all associated data. You can create a new profile anytime.
                  </p>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setShowDeleteConfirmation(true)}
                  disabled={!business}
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <Trash2 size={16} />
                  Delete Profile
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Subscription Tab */
          <SubscriptionManager />
        )}
      </Modal>

      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDeleteProfile}
        title="Delete Business Profile"
        message="This action cannot be undone. This will permanently delete your business profile including all business information, generated pages, contact details, social media links, and all settings."
        confirmText="Delete Profile"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
        requireTextConfirmation={true}
        confirmationText="DELETE"
      />
    </>
  );
};

export default SettingsModal;