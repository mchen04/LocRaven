'use client';

import React, { useState, useEffect } from 'react';

import '../../../styles/ChatDashboard.css';
import { Calendar, Settings, LogOut, Building2, Link2, Menu, X, MoreHorizontal } from 'lucide-react';
import { BusinessProfileView } from '../business';
import LinkAnalytics from './LinkAnalytics';
import { ActiveLinksView, PagePreview } from '../pages';
import { SettingsModal } from '../../../components';
import { usePages } from '../../../hooks';
import { GeneratedPage } from '../../../../types';
import { useAuth } from '../../../contexts/AuthContext';
import { useBusiness } from '../../../contexts/BusinessContext';
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
import { config } from '../../../utils/config';
import { generateWebsite } from "../../../services/data/websiteGenerator";
import { formatExpirationTime } from "../../../services/data/expirationService";
import { supabase } from '../../../utils';

const ChatDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const { business } = useBusiness();
  const { pages, activePages, expiredPages, refreshPages: refetchPages, deletePage } = usePages();
  const [updateText, setUpdateText] = useState('');
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState('');
  
  // Get today's date for min date restriction
  const todaysDate = new Date().toISOString().split('T')[0];
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedPage, setSelectedPage] = useState<GeneratedPage | null>(null);
  const [viewMode, setViewMode] = useState<'update' | 'preview' | 'analytics' | 'profile' | 'links'>('update');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [hasAutoSelectedProfile, setHasAutoSelectedProfile] = useState(false);
  const [showProfileTip, setShowProfileTip] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [websiteInfo, setWebsiteInfo] = useState<WebsiteInfo>({} as WebsiteInfo);
  
  const updateFromPreview = (field: string, value: any) => {
    setWebsiteInfo(prev => ({ ...prev, [field]: value }));
  };
  
  const completionStatus = {
    percentage: 100,
    isReady: viewMode === 'preview',
    missingFields: []
  };
  
  const handleProcessUpdate = async () => {
    if (!updateText.trim()) return;
    
    console.log('🚀 Processing update:', { updateText, startDate, endDate, business: business?.name });
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('process-simple-update', {
        body: {
          updateText,
          startDate,
          endDate,
          businessProfile: business
        }
      });
      
      console.log('📥 Edge Function Response:', { data, error });
      
      if (error) {
        console.error('❌ Error processing update:', error);
        alert(`Error processing update: ${error.message}`);
        return;
      }
      
      if (!data || !data.websiteInfo) {
        console.error('❌ No data returned from Edge Function');
        alert('No data returned from processing. Please try again.');
        return;
      }
      
      console.log('✅ Setting website info and switching to preview:', data.websiteInfo);
      setWebsiteInfo(data.websiteInfo);
      setViewMode('preview');
    } catch (error: any) {
      console.error('💥 Unexpected error:', error);
      alert(`Unexpected error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle onboarding and UI state
  useEffect(() => {
    const tipDismissed = localStorage.getItem('profileTipDismissed');
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    
    // Handle profile tip
    setShowProfileTip(!business && !tipDismissed && viewMode === 'update');
    
    // Auto-select profile tab for new users
    if (!business && !hasSeenOnboarding && !hasAutoSelectedProfile) {
      setViewMode('profile');
      setHasAutoSelectedProfile(true);
      localStorage.setItem('hasSeenOnboarding', 'true');
    }
  }, [business, viewMode, hasAutoSelectedProfile]);

  // Handle click outside for profile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-menu-container')) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showProfileMenu]);


  const handleGenerateWebsite = async (websiteInfo: WebsiteInfo) => {
    try {
      const generatedPages = await generateWebsite(websiteInfo as any);
      await refetchPages();
      console.log(`Perfect! Created ${generatedPages.length} pages. Live at: ${generatedPages[0]?.url}`);
    } catch (error) {
      console.error('Error generating website:', error);
    }
  };


  const handleLinkClick = (page: GeneratedPage) => {
    setSelectedPage(page);
    setViewMode('analytics');
  };

  const handleBackToChat = () => {
    setViewMode('update');
    setSelectedPage(null);
  };

  const handleBusinessDetailsClick = () => {
    setViewMode('profile');
    setSelectedPage(null);
  };

  const handleBackToForm = () => {
    setViewMode('update');
  };

  const handlePreviewConfirm = async (adjustedInfo: WebsiteInfo) => {
    await handleGenerateWebsite(adjustedInfo);
    setViewMode('update');
    setUpdateText('');
    setStartDate(() => {
      const today = new Date();
      return today.toISOString().split('T')[0];
    });
    setEndDate('');
    setWebsiteInfo({} as WebsiteInfo);
  };

  const handlePreviewEdit = (field: string, value: string) => {
    updateFromPreview(field, value);
  };



  const shortenUrl = (url: string) => {
    // Remove protocol and common parts to save space
    const path = url.replace(config.env.appUrl, '').replace(/^\/+/, '/');
    // Show only the last 2-3 parts of the path
    const parts = path.split('/').filter(Boolean);
    if (parts.length > 3) {
      return '.../' + parts.slice(-2).join('/');
    }
    return path;
  };


  return (
    <div className="chat-dashboard">
      {/* Integrated Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <button 
            className="sidebar-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
          {isSidebarOpen && (
            <div className="sidebar-title">LocRaven</div>
          )}
        </div>

        <div className="sidebar-nav">
          <button 
            className={`nav-item ${viewMode === 'update' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('update');
              setSelectedPage(null);
            }}
          >
            <Calendar size={20} className="nav-icon" />
            {isSidebarOpen && <span>Create Update</span>}
          </button>
          
          <button 
            className={`nav-item ${viewMode === 'profile' ? 'active' : ''}`}
            onClick={handleBusinessDetailsClick}
          >
            <Building2 size={20} className="nav-icon" />
            {isSidebarOpen && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                Business Details
                {!business && (
                  <span 
                    style={{ 
                      width: '6px', 
                      height: '6px', 
                      borderRadius: '50%', 
                      backgroundColor: '#ff8c00',
                      display: 'inline-block'
                    }} 
                    title="Profile not set up"
                  />
                )}
              </span>
            )}
          </button>
          
          <button 
            className={`nav-item ${viewMode === 'links' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('links');
              setSelectedPage(null);
            }}
          >
            <Link2 size={20} className="nav-icon" />
            {isSidebarOpen && <span>Active Links</span>}
          </button>
        </div>

        {isSidebarOpen && (
          <div className="sidebar-sections">
            {/* Active Links List */}
            {activePages.length > 0 && (
              <div className="sidebar-section">
                <div className="section-header">
                  <span style={{ fontSize: '12px', color: '#6e6e6e', textTransform: 'uppercase' }}>
                    Active Links ({activePages.length})
                  </span>
                </div>
                <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.1)', marginBottom: '8px' }}></div>
                <div className="links-list">
                  {activePages.map(page => (
                    <div 
                      key={page.id} 
                      className={`link-item ${selectedPage?.id === page.id ? 'selected' : ''}`}
                      style={{ cursor: 'pointer', padding: '8px', borderRadius: '4px', marginBottom: '4px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}
                    >
                      <div onClick={() => handleLinkClick(page)}>
                        <div style={{ fontSize: '11px', color: '#6b7280', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%', lineHeight: '1', margin: '0', padding: '0' }}>
                          {shortenUrl(page.file_path)}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', lineHeight: '1', margin: '0', padding: '0' }}>
                          <span style={{ fontSize: '10px', color: page.expires_at ? '#f59e0b' : '#22c55e', fontWeight: '500' }}>
                            {page.expires_at ? formatExpirationTime(page.expires_at) : 'Permanent'}
                          </span>
                          <a 
                            href={page.url || `${config.env.appUrl}${page.file_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{ color: '#10b981', textDecoration: 'none', fontSize: '10px', flexShrink: 0 }}
                          >
                            View ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activePages.length === 0 && (
              <div className="empty-state">No active links yet</div>
            )}
          </div>
        )}

        {/* User Profile Section */}
        <div className="sidebar-footer">
          <div className="profile-menu-container">
            <button 
              className="user-profile-btn"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="user-avatar">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              {isSidebarOpen && (
                <>
                  <span className="user-email">{user?.email || 'User'}</span>
                  <MoreHorizontal size={16} className="menu-dots" />
                </>
              )}
            </button>
            
            {showProfileMenu && (
              <div className="profile-dropdown">
                <button 
                  className="dropdown-item"
                  onClick={() => {
                    setViewMode('profile');
                    setShowProfileMenu(false);
                  }}
                >
                  <Building2 size={16} />
                  <span>Business Profile</span>
                </button>
                <button 
                  className="dropdown-item"
                  onClick={() => {
                    setShowSettings(true);
                    setShowProfileMenu(false);
                  }}
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
                <div className="dropdown-divider" />
                <button 
                  className="dropdown-item"
                  onClick={() => {
                    signOut();
                    setShowProfileMenu(false);
                  }}
                >
                  <LogOut size={16} />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Toggle */}
      <button 
        className="mobile-sidebar-toggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Main Content Area */}
      <main className="chat-main">

        {viewMode === 'profile' ? (
          <BusinessProfileView />
        ) : viewMode === 'links' ? (
          <ActiveLinksView 
            pages={pages} 
            activePages={activePages}
            expiredPages={expiredPages}
            onRefresh={refetchPages} 
            onPageClick={handleLinkClick}
            onDeletePage={deletePage}
          />
        ) : viewMode === 'analytics' && selectedPage ? (
          <LinkAnalytics page={selectedPage} onClose={handleBackToChat} />
        ) : viewMode === 'preview' ? (
          <div className="preview-full-screen">
            <PagePreview 
              websiteInfo={websiteInfo} 
              onEdit={handlePreviewEdit}
              onConfirm={handlePreviewConfirm}
              showActions={true}
              completionStatus={completionStatus}
              onBackToForm={handleBackToForm}
            />
          </div>
        ) : (
          <div className="update-form-layout">
            {/* Main Update Form */}
            <div className="update-form-container">
              <div className="form-header">
                <div className="title-section">
                  <h1>Create Business Update</h1>
                  <p>Share news, promotions, or updates about your business</p>
                </div>
              </div>
              
              {/* Profile Tip for New Users */}
              {showProfileTip && (
                <div className="profile-tip">
                  <div className="profile-tip-content">
                    <span className="profile-tip-icon">💡</span>
                    <span className="profile-tip-text">
                      Adding your business details helps create better pages
                    </span>
                    <button
                      className="profile-tip-action"
                      onClick={() => {
                        setViewMode('profile');
                        setShowProfileTip(false);
                      }}
                    >
                      Add details
                    </button>
                    <button
                      className="profile-tip-dismiss"
                      onClick={() => {
                        setShowProfileTip(false);
                        localStorage.setItem('profileTipDismissed', 'true');
                      }}
                      title="Dismiss"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
              
              <div className="update-form">
                {/* Update Content */}
                <div className="form-group">
                  <label htmlFor="update-text">Update Details</label>
                  <textarea
                    id="update-text"
                    value={updateText}
                    onChange={(e) => setUpdateText(e.target.value)}
                    placeholder="Share news, promotions, or updates about your business"
                    rows={6}
                    className="update-textarea"
                  />
                </div>
                
                {/* Date Selection */}
                <div className="date-group">
                  <div className="form-group">
                    <label htmlFor="start-date">Start Date (Defaults to Today)</label>
                    <input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="date-input"
                      min={todaysDate}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="end-date">End Date (Optional)</label>
                    <input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="date-input"
                      min={startDate || todaysDate}
                    />
                  </div>
                </div>
                
                {/* Process Button */}
                <button
                  onClick={handleProcessUpdate}
                  disabled={!updateText.trim() || isProcessing}
                  className="process-btn"
                >
                  <span className={`button-text ${isProcessing ? 'processing' : ''}`}>
                    Process Update
                  </span>
                  {isProcessing && (
                    <div className="button-loading-overlay">
                      <div className="loading-spinner" />
                      Processing...
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />

    </div>
  );
};

export default ChatDashboard;