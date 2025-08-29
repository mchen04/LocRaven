'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Edit2, CheckCircle, AlertCircle } from 'lucide-react';
// Simplified WebsiteInfo type for update form
interface WebsiteInfo {
  businessName?: string;
  businessType?: string;
  location?: string;
  updateContent?: string;
  temporalInfo?: {
    startsAt?: string;
    expiresAt?: string;
  };
  previewData?: {
    title?: string;
    description?: string;
    eventDescription?: string;
  };
  suggestedUrls?: {
    primary?: string;
    alternatives?: string[];
    reasoning?: string;
  };
}
// Removed Zustand store imports - using React props instead

interface PagePreviewProps {
  websiteInfo?: WebsiteInfo;
  onConfirm?: (adjustedInfo: WebsiteInfo) => void;
  onEdit?: (field: string, value: string) => void;
  showActions?: boolean;
  agentStatus?: {
    hasCoordinator: boolean;
    shouldShowPreview: boolean;
    completionPercentage: number;
    conversationStage: string;
  };
  completionStatus?: {
    percentage: number;
    isReady: boolean;
    missingFields: string[];
  };
  isAnalyzing?: boolean;
  onForceShowPreview?: () => void;
  onBackToForm?: () => void;
}

const PagePreview: React.FC<PagePreviewProps> = ({ 
  websiteInfo, 
  onConfirm, 
  onEdit,
  showActions = false,
  agentStatus = {
    hasCoordinator: false,
    shouldShowPreview: false,
    completionPercentage: 0,
    conversationStage: 'initial'
  },
  completionStatus = {
    percentage: 0,
    isReady: false,
    missingFields: []
  },
  onForceShowPreview,
  onBackToForm
}) => {
  // Simple React state (no complex store needed)
  const activeWebsiteInfo = websiteInfo || {} as WebsiteInfo;
  
  const [currentUrl, setCurrentUrl] = useState<string>(activeWebsiteInfo?.suggestedUrls?.primary || '');
  const [editedInfo, setEditedInfo] = useState<WebsiteInfo>(activeWebsiteInfo || {} as WebsiteInfo);
  // Removed business profile expansion state - no longer needed
  // Removed unused state variables
  
  // Simple useEffect to sync with props (no store complexity)
  useEffect(() => {
    if (activeWebsiteInfo && Object.keys(activeWebsiteInfo).length > 0) {
      setEditedInfo(activeWebsiteInfo);
      if (activeWebsiteInfo.suggestedUrls?.primary) {
        setCurrentUrl(activeWebsiteInfo.suggestedUrls.primary);
      }
    }
  }, [activeWebsiteInfo, websiteInfo]); // Simple dependency on props, no infinite loops

  const handleEdit = (field: string, value: string) => {
    // Update local state
    const updatedInfo = { ...editedInfo };
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      const parentObj = (updatedInfo as Record<string, any>)[parent] || {};
      (updatedInfo as Record<string, any>)[parent] = { ...parentObj, [child]: value };
    } else {
      (updatedInfo as Record<string, any>)[field] = value;
    }
    setEditedInfo(updatedInfo);
    
    // Call parent callback for state updates (no store needed)
    onEdit?.(field, value);
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm({ 
        ...editedInfo, 
        suggestedUrls: { 
          primary: currentUrl,
          alternatives: editedInfo.suggestedUrls?.alternatives || [],
          reasoning: editedInfo.suggestedUrls?.reasoning
        } 
      });
    }
  };

  // Show data collection state if agent system is active but completion threshold not met
  if (agentStatus.hasCoordinator && !agentStatus.shouldShowPreview && agentStatus.completionPercentage > 0) {
    return (
      <div className="preview-panel" tabIndex={-1}>
        <div className="preview-panel-header">
          <h3>Preview</h3>
        </div>
        
        <div className="data-collection-progress">
          <div style={{
            padding: '1.25rem',
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '0.5rem',
            margin: '1rem'
          }}>
            <div style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              color: '#e5e7eb',
              marginBottom: '1rem'
            }}>
              Almost ready
            </div>
            
            <div style={{
              width: '100%',
              height: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '0.25rem',
              overflow: 'hidden',
              marginBottom: '1rem'
            }}>
              <div style={{
                width: `${agentStatus.completionPercentage}%`,
                height: '100%',
                backgroundColor: '#6b7280',
                borderRadius: '0.25rem',
                transition: 'width 0.5s ease'
              }} />
            </div>
            
            <div style={{
              fontSize: 'var(--text-xs)',
              color: '#9ca3af',
              marginBottom: '1rem'
            }}>
              Just need a few more details
            </div>

            <button
              onClick={() => {
                console.log('User requested preview');
                if (onForceShowPreview) {
                  onForceShowPreview();
                }
              }}
              style={{
                marginTop: '1rem',
                padding: '8px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ececec',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '0.375rem',
                fontSize: 'var(--text-xs)',
                cursor: 'pointer',
                fontWeight: 'var(--font-weight-medium)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              Show Preview Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state if no website info
  if (!activeWebsiteInfo || Object.keys(activeWebsiteInfo).length === 0) {
    return (
      <div className="preview-panel" tabIndex={-1}>
        <div className="preview-panel-header">
          <h3>Preview Your Page</h3>
        </div>
        <div className="preview-empty">
          <Edit2 size={48} className="preview-empty-icon" />
          <p>Start chatting to create your page</p>
          <small>Tell us about your business update and we&apos;ll create an optimized page</small>
        </div>
      </div>
    );
  }

  return (
    <div className="preview-panel" tabIndex={-1}>
      <div className="preview-panel-header">
        <h3>Preview Your Page</h3>
        <div className="preview-status-container">
          {/* Completion Status */}
          <div className="completion-indicator" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            marginRight: '0.75rem'
          }}>
            {completionStatus.isReady ? (
              <CheckCircle size={14} style={{ color: '#22c55e' }} />
            ) : (
              <AlertCircle size={14} style={{ color: '#f59e0b' }} />
            )}
            <span style={{
              fontSize: '0.75rem',
              color: completionStatus.isReady ? '#22c55e' : '#f59e0b',
              fontWeight: '500'
            }}>
              {completionStatus.percentage}% Complete
            </span>
          </div>
          
          {/* Temporal Info */}
          <div className="preview-status">
            <Clock size={14} />
            <span>
              {activeWebsiteInfo.temporalInfo?.expiresAt 
                ? `Expires: ${new Date(activeWebsiteInfo.temporalInfo.expiresAt).toLocaleDateString()}`
                : 'No expiration set'
              }
            </span>
          </div>
        </div>
      </div>

        {/* Back to Form Button - Top Left */}
        {onBackToForm && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '16px 24px 0 24px' }}>
            <button 
              onClick={onBackToForm}
              className="back-button"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '6px 12px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '0.375rem',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              ← Back to Form
            </button>
          </div>
        )}
        
        <div className="update-form-layout">
          {/* Main Update Form */}
          <div className="update-form-container">
            <div className="form-header">
              <div className="title-section">
                <h1>Preview Your Page</h1>
                <p>Review and customize your page before generation</p>
              </div>
            </div>
            
            <div className="update-form">
              {/* Page Title */}
              <div className="form-group">
                <label htmlFor="page-title">Page Title (AI Generated)</label>
                <input
                  id="page-title"
                  type="text"
                  value={editedInfo.previewData?.title || ''}
                  onChange={(e) => handleEdit('previewData.title', e.target.value)}
                  placeholder="AI will generate a title based on your content"
                  className="form-input"
                />
              </div>
              
              {/* Content */}
              <div className="form-group">
                <label htmlFor="page-content">Update Details</label>
                <textarea
                  id="page-content"
                  value={editedInfo.updateContent || ''}
                  onChange={(e) => handleEdit('updateContent', e.target.value)}
                  placeholder="Tell your customers about new products, services, special offers, events, or any business updates..."
                  rows={4}
                  className="update-textarea"
                />
              </div>
              
              {/* Date Selection - More Compact */}
              <div className="date-group">
                <div className="form-group">
                  <label htmlFor="start-date">Start Date (Defaults to Today)</label>
                  <input
                    id="start-date"
                    type="date"
                    value={editedInfo.temporalInfo?.startsAt ? new Date(editedInfo.temporalInfo.startsAt).toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value + 'T00:00:00Z').toISOString() : '';
                      handleEdit('temporalInfo.startsAt', date);
                    }}
                    className="date-input"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="end-date">End Date (Optional)</label>
                  <input
                    id="end-date"
                    type="date"
                    value={editedInfo.temporalInfo?.expiresAt ? new Date(editedInfo.temporalInfo.expiresAt).toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value + 'T23:59:59Z').toISOString() : '';
                      handleEdit('temporalInfo.expiresAt', date);
                    }}
                    className="date-input"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              
              
              {/* Generate Button - Compact */}
              {showActions && (
                <button
                  onClick={handleConfirm}
                  disabled={!editedInfo.updateContent?.trim()}
                  className="process-btn"
                  style={{ marginTop: '0.75rem' }}
                >
                  Generate Page
                </button>
              )}
            </div>
          </div>
        </div>

    </div>
  );
};

export default PagePreview;