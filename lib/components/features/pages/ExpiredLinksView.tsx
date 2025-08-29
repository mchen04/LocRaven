'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink, RefreshCw, Trash2, AlertCircle, MoreHorizontal } from 'lucide-react';
import { reactivatePage } from '../../../services/data/expirationService';
import { GeneratedPage } from '../../../../types';
import { config } from '../../../utils/config';

interface ExpiredLinksViewProps {
  pages: GeneratedPage[];
  onRefresh: () => void;
  onPageClick: (page: GeneratedPage) => void;
  onDeletePage: (pageId: string) => Promise<{ success: boolean; error?: string }>;
}

interface ReactivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (expiryDate: Date) => void;
  pageTitle: string;
}

const ReactivationModal: React.FC<ReactivationModalProps> = ({ isOpen, onClose, onConfirm, pageTitle }) => {
  const [selectedOption, setSelectedOption] = useState<string>('24h');
  const [customDate, setCustomDate] = useState<string>('');

  const getExpiryDate = () => {
    const now = new Date();
    switch (selectedOption) {
      case '24h':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case '7d':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case '30d':
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      case 'custom':
        return customDate ? new Date(customDate) : new Date(now.getTime() + 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
  };

  const handleConfirm = () => {
    const expiryDate = getExpiryDate();
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Reactivate Page</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <p>Reactivate &quot;{pageTitle}&quot; until:</p>
          
          <div className="reactivation-options">
            <label className="option-radio">
              <input
                type="radio"
                name="expiry"
                value="24h"
                checked={selectedOption === '24h'}
                onChange={(e) => setSelectedOption(e.target.value)}
              />
              <span>24 hours from now</span>
            </label>
            
            <label className="option-radio">
              <input
                type="radio"
                name="expiry"
                value="7d"
                checked={selectedOption === '7d'}
                onChange={(e) => setSelectedOption(e.target.value)}
              />
              <span>7 days from now</span>
            </label>
            
            <label className="option-radio">
              <input
                type="radio"
                name="expiry"
                value="30d"
                checked={selectedOption === '30d'}
                onChange={(e) => setSelectedOption(e.target.value)}
              />
              <span>30 days from now</span>
            </label>
            
            <label className="option-radio">
              <input
                type="radio"
                name="expiry"
                value="custom"
                checked={selectedOption === 'custom'}
                onChange={(e) => setSelectedOption(e.target.value)}
              />
              <span>Custom date:</span>
            </label>
            
            {selectedOption === 'custom' && (
              <input
                type="datetime-local"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                min={getMinDateTime()}
                className="custom-date-input"
              />
            )}
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="btn-primary" 
            onClick={handleConfirm}
            disabled={selectedOption === 'custom' && (!customDate || new Date(customDate) <= new Date())}
          >
            Reactivate
          </button>
        </div>
      </div>
    </div>
  );
};

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  pageTitle: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ isOpen, onClose, onConfirm, pageTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Delete Page Permanently</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="warning-content">
            <AlertCircle size={48} className="warning-icon" />
            <p>Are you sure you want to permanently delete this page?</p>
            <p className="page-title">&quot;{pageTitle}&quot;</p>
            <p className="warning-text">This action cannot be undone.</p>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-danger" onClick={onConfirm}>
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
};

const ExpiredLinksView: React.FC<ExpiredLinksViewProps> = ({ pages, onRefresh, onPageClick, onDeletePage }) => {
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [showReactivationModal, setShowReactivationModal] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const handleReactivate = async (pageId: string, expiryDate: Date) => {
    setLoading(pageId);
    try {
      const result = await reactivatePage(pageId, expiryDate);
      if (result.success) {
        onRefresh();
        setShowReactivationModal(null);
        setShowDropdown(null);
      } else {
        console.error('Failed to reactivate page:', result.message);
        alert('Failed to reactivate page: ' + result.message);
      }
    } catch (error) {
      console.error('Error reactivating page:', error);
      alert('Error reactivating page: ' + error);
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (pageId: string) => {
    setLoading(pageId);
    try {
      const result = await onDeletePage(pageId);
      if (result.success) {
        onRefresh();
        setShowDeleteModal(null);
        setShowDropdown(null);
      } else {
        console.error('Failed to delete page:', result.error);
      }
    } catch (error) {
      console.error('Error deleting page:', error);
    } finally {
      setLoading(null);
    }
  };

  const formatExpiredDate = (expiredAt: string | null | undefined, expiresAt?: string) => {
    // Fallback logic for missing expired_at fields
    let dateToFormat: string;
    
    if (expiredAt) {
      dateToFormat = expiredAt;
    } else if (expiresAt) {
      // Use expires_at as fallback if expired_at is missing
      dateToFormat = expiresAt;
    } else {
      // Last resort: use current time
      dateToFormat = new Date().toISOString();
    }
    
    return new Date(dateToFormat).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const formatCreatedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.dropdown-container')) {
        setShowDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (pages.length === 0) {
    return (
      <div className="expired-links-view">
        <div className="empty-state">
          <AlertCircle size={48} className="empty-icon" />
          <h3>No expired links</h3>
          <p>Expired pages will appear here. You can reactivate them or delete them permanently.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="expired-links-view">

      <div className="links-grid">
        {pages.map((page) => {
          const expiredAt = page.expired_at;
          
          return (
            <div key={page.id} className="link-card expired">
              
              <div className="link-card-header">
                <div className="link-info">
                  <h3 className="link-title">{page.title}</h3>
                  <span className="link-type">{page.page_type}</span>
                </div>
                
                <div className="dropdown-container">
                  <button 
                    className="link-menu-btn"
                    onClick={() => setShowDropdown(showDropdown === page.id ? null : page.id)}
                    disabled={loading === page.id}
                  >
                    <MoreHorizontal size={16} />
                  </button>
                  
                  {showDropdown === page.id && (
                    <div className="dropdown-menu">
                      <button 
                        className="dropdown-item"
                        onClick={() => setShowReactivationModal(page.id)}
                        disabled={loading === page.id}
                      >
                        <RefreshCw size={14} />
                        Reactivate
                      </button>
                      <div className="dropdown-divider" />
                      <button 
                        className="dropdown-item danger"
                        onClick={() => setShowDeleteModal(page.id)}
                        disabled={loading === page.id}
                      >
                        <Trash2 size={14} />
                        Delete permanently
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="link-url" onClick={() => onPageClick(page)}>
                <ExternalLink size={14} />
                <span>{page.file_path}</span>
              </div>

              <div className="link-metadata">
                <div className="metadata-item">
                  <span className="metadata-label">Created:</span>
                  <span className="metadata-value">{page.created_at ? formatCreatedDate(page.created_at) : 'Unknown'}</span>
                </div>
                
                <div className="metadata-item">
                  <span className="metadata-label">Expired:</span>
                  <span className="metadata-value expired">
                    {formatExpiredDate(expiredAt, page.expires_at)}
                    {!expiredAt && page.expires_at && <span className="fallback-indicator"> (estimated)</span>}
                  </span>
                </div>
              </div>

              <div className="link-actions">
                <a 
                  href={page.url || `${config.env.appUrl}${page.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-link-btn disabled"
                  title="Page is expired"
                >
                  <ExternalLink size={14} />
                  View (Expired)
                </a>
                <button 
                  className="analytics-btn"
                  onClick={() => onPageClick(page)}
                >
                  Analytics
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reactivation Modal */}
      {showReactivationModal && (
        <ReactivationModal
          isOpen={true}
          onClose={() => setShowReactivationModal(null)}
          onConfirm={(expiryDate) => handleReactivate(showReactivationModal, expiryDate)}
          pageTitle={pages.find(p => p.id === showReactivationModal)?.title || ''}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmModal
          isOpen={true}
          onClose={() => setShowDeleteModal(null)}
          onConfirm={() => handleDelete(showDeleteModal)}
          pageTitle={pages.find(p => p.id === showDeleteModal)?.title || ''}
        />
      )}
    </div>
  );
};

export default ExpiredLinksView;