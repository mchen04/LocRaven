'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBusiness } from '../contexts/BusinessContext';
import { Modal } from './ui/organisms';
import SubscriptionManager from './SubscriptionManager';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { business, deleteBusinessProfile } = useBusiness();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<'account' | 'subscription'>('account');

  // Reset to normal settings view when modal opens
  useEffect(() => {
    if (isOpen) {
      setShowDeleteConfirmation(false);
      setDeleteConfirmText('');
      setActiveTab('account');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDeleteProfile = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    
    setIsDeleting(true);
    try {
      const result = await deleteBusinessProfile();
      if (result.success) {
        // Close modal and reset state
        setShowDeleteConfirmation(false);
        setDeleteConfirmText('');
        onClose();
        
        // Show success message
        const successMessage = 'Profile deleted successfully! All business data, generated pages, and category listings have been removed.';
        alert(successMessage);
        
        // The profile will be gone and the user will see the onboarding flow again
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
        isOpen={isOpen}
        onClose={onClose}
        title="Settings"
        size="lg"
      >
        <div className="settings-modal-content">
          {!showDeleteConfirmation ? (
            <>
              {/* Tab Navigation */}
              <div className="settings-tabs">
                <button
                  className={`settings-tab ${activeTab === 'account' ? 'active' : ''}`}
                  onClick={() => setActiveTab('account')}
                >
                  Account
                </button>
                <button
                  className={`settings-tab ${activeTab === 'subscription' ? 'active' : ''}`}
                  onClick={() => setActiveTab('subscription')}
                >
                  Subscription
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'account' ? (
                <>
                  {/* Account Section */}
                  <div className="settings-section">
                    <h3>Account Information</h3>
                    <div className="settings-info">
                      <label>Email</label>
                      <span>{user?.email || 'Not logged in'}</span>
                    </div>
                    {business && (
                      <div className="settings-info">
                        <label>Business</label>
                        <span>{business.name || 'Unnamed Business'}</span>
                      </div>
                    )}
                  </div>

                  {/* Danger Zone */}
                  <div className="settings-section danger-zone">
                    <h3>Danger Zone</h3>
                    <div className="settings-danger-box">
                      <div className="settings-danger-content">
                        <h4>Delete Business Profile</h4>
                        <p>This will permanently delete your business profile and all associated data. You can create a new profile anytime.</p>
                      </div>
                      <button 
                        className="settings-danger-btn"
                        onClick={() => setShowDeleteConfirmation(true)}
                        disabled={!business}
                      >
                        <Trash2 size={16} />
                        Delete Profile
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Subscription Tab */
                <SubscriptionManager />
              )}
            </>
          ) : (
            /* Delete Confirmation View */
            <div className="delete-confirmation-view">
              <div className="confirmation-header">
                <AlertTriangle size={24} className="confirmation-icon" />
                <h3>Are you absolutely sure?</h3>
              </div>
              <div className="confirmation-content">
                <p>This action <strong>cannot be undone</strong>. This will permanently delete your business profile including:</p>
                <ul>
                  <li>Business information and details</li>
                  <li>All generated pages and content</li>
                  <li>Location and contact information</li>
                  <li>Social media links</li>
                  <li>Business descriptions and hours</li>
                  <li>All settings and preferences</li>
                </ul>
                <p className="confirmation-warning">
                  Please type <strong>DELETE</strong> to confirm.
                </p>
                <input
                  type="text"
                  className="confirmation-input"
                  placeholder="Type DELETE to confirm"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                />
              </div>
              <div className="confirmation-actions">
                <button 
                  className="confirmation-cancel"
                  onClick={() => {
                    setShowDeleteConfirmation(false);
                    setDeleteConfirmText('');
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="confirmation-delete"
                  onClick={handleDeleteProfile}
                  disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete Profile'}
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default SettingsModal;