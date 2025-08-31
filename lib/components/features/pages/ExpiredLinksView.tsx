'use client';

import React, { useState } from 'react';
import { RefreshCw, Trash2, AlertCircle } from 'lucide-react';
import { reactivatePage } from '../../../services/data/expirationService';
import { GeneratedPage } from '../../../../types';
import LinkCard from './LinkCard';
import { useMultipleLoadingStates } from '../../../hooks/useFormProcessing';
import { ReactivationModal, DeleteConfirmModal } from '../../ui/molecules/ConfirmationModal';
import { DropdownItem } from '../../ui/molecules/Dropdown';

interface ExpiredLinksViewProps {
  pages: GeneratedPage[];
  onRefresh: () => void;
  onPageClick: (page: GeneratedPage) => void;
  onDeletePage: (pageId: string) => Promise<{ success: boolean; error?: string }>;
}


const ExpiredLinksView: React.FC<ExpiredLinksViewProps> = ({ pages, onRefresh, onPageClick, onDeletePage }) => {
  const [showReactivationModal, setShowReactivationModal] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const { setLoading, isLoading } = useMultipleLoadingStates();

  const handleReactivate = async (pageId: string, expiryDate: Date) => {
    setLoading(pageId, true);
    try {
      const result = await reactivatePage(pageId, expiryDate);
      if (result.success) {
        onRefresh();
        setShowReactivationModal(null);
      } else {
        console.error('Failed to reactivate page:', result.message);
        alert('Failed to reactivate page: ' + result.message);
      }
    } catch (error) {
      console.error('Error reactivating page:', error);
      alert('Error reactivating page: ' + error);
    } finally {
      setLoading(pageId, false);
    }
  };

  const handleDelete = async (pageId: string) => {
    setLoading(pageId, true);
    try {
      const result = await onDeletePage(pageId);
      if (result.success) {
        onRefresh();
        setShowDeleteModal(null);
      } else {
        console.error('Failed to delete page:', result.error);
      }
    } catch (error) {
      console.error('Error deleting page:', error);
    } finally {
      setLoading(pageId, false);
    }
  };

  const getDropdownActions = (page: GeneratedPage): DropdownItem[] => [
    {
      id: 'reactivate',
      label: 'Reactivate',
      icon: RefreshCw,
      onClick: () => setShowReactivationModal(page.id),
      disabled: isLoading(page.id)
    },
    {
      id: 'delete',
      label: 'Delete permanently',
      icon: Trash2,
      onClick: () => setShowDeleteModal(page.id),
      disabled: isLoading(page.id),
      variant: 'danger'
    }
  ];

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
        {pages.map((page) => (
          <LinkCard
            key={page.id}
            page={page}
            variant="expired"
            onPageClick={onPageClick}
            dropdownActions={getDropdownActions(page)}
            loading={isLoading(page.id)}
          />
        ))}
      </div>

      {/* Reactivation Modal */}
      {showReactivationModal && (
        <ReactivationModal
          isOpen={true}
          onClose={() => setShowReactivationModal(null)}
          onConfirm={(expiryDate) => handleReactivate(showReactivationModal, expiryDate)}
          pageTitle={pages.find(p => p.id === showReactivationModal)?.title || ''}
          loading={isLoading(showReactivationModal)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmModal
          isOpen={true}
          onClose={() => setShowDeleteModal(null)}
          onConfirm={() => handleDelete(showDeleteModal)}
          pageTitle={pages.find(p => p.id === showDeleteModal)?.title || ''}
          loading={isLoading(showDeleteModal)}
        />
      )}
    </div>
  );
};

export default ExpiredLinksView;