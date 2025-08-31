'use client';

import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { extendPageExpiration, expirePage } from "../../../services/data/expirationService";
import { GeneratedPage } from '../../../../types';
import ExpiredLinksView from './ExpiredLinksView';
import LinkCard from './LinkCard';
import { useMultipleLoadingStates } from '../../../hooks/useFormProcessing';
import { DropdownItem } from '../../ui/molecules/Dropdown';

interface ActiveLinksViewProps {
  pages: GeneratedPage[];
  activePages: GeneratedPage[];
  expiredPages: GeneratedPage[];
  onRefresh: () => void;
  onPageClick: (page: GeneratedPage) => void;
  onDeletePage: (pageId: string) => Promise<{ success: boolean; error?: string }>;
}

const ActiveLinksView: React.FC<ActiveLinksViewProps> = ({ activePages, expiredPages, onRefresh, onPageClick, onDeletePage }) => {
  const [currentTab, setCurrentTab] = useState<'active' | 'expired'>('active');
  const { setLoading, isLoading } = useMultipleLoadingStates();

  const handleExtendExpiration = async (pageId: string, hours: number = 24) => {
    setLoading(pageId, true);
    try {
      const result = await extendPageExpiration(pageId, hours);
      if (result.success) {
        onRefresh();
      } else {
        console.error('Failed to extend expiration:', result.message);
      }
    } catch (error) {
      console.error('Error extending expiration:', error);
    } finally {
      setLoading(pageId, false);
    }
  };

  const handleExpireNow = async (pageId: string) => {
    setLoading(pageId, true);
    try {
      const result = await expirePage(pageId);
      if (result.success) {
        onRefresh();
      } else {
        console.error('Failed to expire page:', result.message);
      }
    } catch (error) {
      console.error('Error expiring page:', error);
    } finally {
      setLoading(pageId, false);
    }
  };

  const getDropdownActions = (page: GeneratedPage): DropdownItem[] => {
    const extensionActions: DropdownItem[] = [
      {
        id: 'extend-24h',
        label: '24 hours',
        icon: Clock,
        onClick: () => handleExtendExpiration(page.id, 24),
        disabled: isLoading(page.id)
      },
      {
        id: 'extend-72h',
        label: '3 days',
        icon: Clock,
        onClick: () => handleExtendExpiration(page.id, 72),
        disabled: isLoading(page.id)
      },
      {
        id: 'extend-week',
        label: '1 week',
        icon: Clock,
        onClick: () => handleExtendExpiration(page.id, 168),
        disabled: isLoading(page.id)
      },
      {
        id: 'extend-2weeks',
        label: '2 weeks',
        icon: Clock,
        onClick: () => handleExtendExpiration(page.id, 336),
        disabled: isLoading(page.id)
      },
      {
        id: 'extend-month',
        label: '1 month',
        icon: Clock,
        onClick: () => handleExtendExpiration(page.id, 720),
        disabled: isLoading(page.id)
      }
    ];

    const expireAction: DropdownItem = {
      id: 'expire-now',
      label: 'Expire now',
      icon: Clock,
      onClick: () => handleExpireNow(page.id),
      disabled: isLoading(page.id),
      variant: 'danger'
    };

    return [...extensionActions, expireAction];
  };

  return (
    <div className="active-links-view">
      <div className="active-links-header">
        <div className="tabs-container">
          <button 
            className={`tab-button ${currentTab === 'active' ? 'active' : ''}`}
            onClick={() => setCurrentTab('active')}
          >
            Active Links ({activePages.length})
          </button>
          <button 
            className={`tab-button ${currentTab === 'expired' ? 'active' : ''}`}
            onClick={() => setCurrentTab('expired')}
          >
            Expired Links ({expiredPages.length})
          </button>
        </div>
        <p className="header-subtitle">
          {currentTab === 'active' 
            ? 'Manage your live pages and their expiration times'
            : 'Reactivate pages or delete them permanently'
          }
        </p>
      </div>

      {currentTab === 'expired' ? (
        <ExpiredLinksView 
          pages={expiredPages}
          onRefresh={onRefresh}
          onPageClick={onPageClick}
          onDeletePage={onDeletePage}
        />
      ) : (
        <>
          {activePages.length === 0 ? (
            <div className="empty-state">
              <Clock size={48} className="empty-icon" />
              <h3>No active links</h3>
              <p>Create some pages to see them here with their expiration times.</p>
            </div>
          ) : (

            <div className="links-grid">
              {activePages.map((page) => (
                <LinkCard
                  key={page.id}
                  page={page}
                  variant="active"
                  onPageClick={onPageClick}
                  dropdownActions={getDropdownActions(page)}
                  loading={isLoading(page.id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ActiveLinksView;