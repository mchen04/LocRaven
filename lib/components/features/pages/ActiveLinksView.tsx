'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink, Clock, MoreHorizontal, Trash2, Calendar } from 'lucide-react';
import { formatExpirationTime, isExpiringSoon, extendPageExpiration, expirePage } from "../../../services/data/expirationService";
import { GeneratedPage } from '../../../../types';
import ExpiredLinksView from './ExpiredLinksView';
import { config } from '../../../utils/config';

interface ActiveLinksViewProps {
  pages: GeneratedPage[];
  activePages: GeneratedPage[];
  expiredPages: GeneratedPage[];
  onRefresh: () => void;
  onPageClick: (page: GeneratedPage) => void;
  onDeletePage: (pageId: string) => Promise<{ success: boolean; error?: string }>;
}

const ActiveLinksView: React.FC<ActiveLinksViewProps> = ({ activePages, expiredPages, onRefresh, onPageClick, onDeletePage }) => {
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<'active' | 'expired'>('active');

  const handleExtendExpiration = async (pageId: string, hours: number = 24) => {
    setLoading(pageId);
    try {
      const result = await extendPageExpiration(pageId, hours);
      if (result.success) {
        onRefresh();
        setShowDropdown(null);
      } else {
        console.error('Failed to extend expiration:', result.message);
      }
    } catch (error) {
      console.error('Error extending expiration:', error);
    } finally {
      setLoading(null);
    }
  };

  const handleExpireNow = async (pageId: string) => {
    setLoading(pageId);
    try {
      const result = await expirePage(pageId);
      if (result.success) {
        onRefresh();
        setShowDropdown(null);
      } else {
        console.error('Failed to expire page:', result.message);
      }
    } catch (error) {
      console.error('Error expiring page:', error);
    } finally {
      setLoading(null);
    }
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
        {activePages.map((page) => {
          const expiresAt = page.expires_at;
          const expiringSoon = expiresAt ? isExpiringSoon(expiresAt) : false;
          
          return (
            <div key={page.id} className={`link-card ${expiringSoon ? 'expiring-soon' : ''}`}>
              
              <div className="link-card-header">
                <div className="link-info">
                  <h3 className="link-title">{page.title}</h3>
                  <span className="link-type">{page.page_type}</span>
                </div>
                
                {page.page_type !== 'business' && (
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
                      <div className="dropdown-section">
                        <div className="dropdown-section-title">Quick Extensions</div>
                        <button 
                          className="dropdown-item"
                          onClick={() => handleExtendExpiration(page.id, 24)}
                          disabled={loading === page.id}
                        >
                          <Clock size={14} />
                          24 hours
                        </button>
                        <button 
                          className="dropdown-item"
                          onClick={() => handleExtendExpiration(page.id, 72)}
                          disabled={loading === page.id}
                        >
                          <Clock size={14} />
                          3 days
                        </button>
                        <button 
                          className="dropdown-item"
                          onClick={() => handleExtendExpiration(page.id, 168)}
                          disabled={loading === page.id}
                        >
                          <Calendar size={14} />
                          1 week
                        </button>
                        <button 
                          className="dropdown-item"
                          onClick={() => handleExtendExpiration(page.id, 336)}
                          disabled={loading === page.id}
                        >
                          <Calendar size={14} />
                          2 weeks
                        </button>
                        <button 
                          className="dropdown-item"
                          onClick={() => handleExtendExpiration(page.id, 720)}
                          disabled={loading === page.id}
                        >
                          <Calendar size={14} />
                          1 month
                        </button>
                      </div>
                      <div className="dropdown-divider" />
                      <button 
                        className="dropdown-item danger"
                        onClick={() => handleExpireNow(page.id)}
                        disabled={loading === page.id}
                      >
                        <Trash2 size={14} />
                        Expire now
                      </button>
                    </div>
                    )}
                  </div>
                )}
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
                  <span className="metadata-label">Expires:</span>
                  <span className={`metadata-value ${expiringSoon ? 'expiring' : ''} ${!expiresAt ? 'permanent' : ''}`}>
                    {expiresAt ? formatExpirationTime(expiresAt) : 'Never'}
                  </span>
                </div>
              </div>

              <div className="link-actions">
                <a 
                  href={page.url || `${config.env.appUrl}${page.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-link-btn"
                >
                  <ExternalLink size={14} />
                  View
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
          )}
        </>
      )}
    </div>
  );
};

export default ActiveLinksView;