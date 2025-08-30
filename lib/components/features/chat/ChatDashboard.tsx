'use client';

import React, { useState, useEffect } from 'react';

import '../../../styles/ChatDashboard.css';
import { Calendar, Settings, LogOut, Building2, Link2, Menu, X, MoreHorizontal, CreditCard } from 'lucide-react';
import { BusinessProfileView } from '../business';
import LinkAnalytics from './LinkAnalytics';
import { ActiveLinksView, PagePreview } from '../pages';
import { SettingsModal } from '../../../components';
import SubscriptionManager from '../../../components/SubscriptionManager';
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
  multiPageData?: {
    pages: Array<{
      url: string;
      title: string;
      intent_type: 'direct' | 'local' | 'category' | 'branded-local' | 'service-urgent' | 'competitive';
      page_variant: string;
    }>;
    batch_id: string;
    total_pages: number;
    processingTime: number;
    updateId?: string;
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
  const [viewMode, setViewMode] = useState<'update' | 'preview' | 'analytics' | 'profile' | 'links' | 'settings' | 'subscription'>('update');
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
    if (!business?.id) {
      alert('Please set up your business profile first');
      return;
    }
    
    console.log('🚀 Processing update:', { updateText, startDate, endDate, business: business?.name });
    setIsProcessing(true);
    
    try {
      // First create the update in database
      const { data: update, error: updateError } = await supabase
        .from('updates')
        .insert({
          business_id: business.id,
          content_text: updateText,
          expiration_date_time: endDate ? new Date(endDate + 'T23:59:59Z').toISOString() : null,
          status: 'pending' as const
        })
        .select()
        .single();

      if (updateError) throw updateError;

      // Call the enhanced multi-page generation function
      const { data, error } = await supabase.functions.invoke('process-update-with-template', {
        body: {
          updateId: update.id,
          businessId: business.id,
          contentText: updateText,
          temporalInfo: {
            updateCategory: 'general',
            expiresAt: endDate ? new Date(endDate + 'T23:59:59Z').toISOString() : null
          }
        }
      });
      
      console.log('📥 Edge Function Response:', { data, error });
      
      if (error) {
        console.error('❌ Error processing update:', error);
        alert(`Error processing update: ${error.message}`);
        return;
      }
      
      if (!data || (!data.websiteInfo && !data.pages)) {
        console.error('❌ No data returned from Edge Function');
        alert('No data returned from processing. Please try again.');
        return;
      }
      
      // Handle new multi-page response format
      if (data.pages && Array.isArray(data.pages) && data.pages.length > 0) {
        console.log('✅ Multi-page generation successful:', data.pages.length, 'pages');
        
        // Convert to websiteInfo format for existing PagePreview component
        const websiteInfo = {
          businessName: business?.name || 'Your Business',
          businessType: business?.primary_category || 'business',
          location: business?.address_city && business?.address_state 
            ? `${business.address_city}, ${business.address_state}` 
            : 'Your Location',
          updateContent: updateText,
          temporalInfo: {
            expiresAt: endDate ? new Date(endDate + 'T23:59:59Z').toISOString() : undefined
          },
          previewData: {
            title: data.pages[0].title, // Use the direct intent page as primary
            description: `Generated ${data.pages.length} AI-optimized pages`,
            eventDescription: updateText
          },
          // Add the multi-page data for the preview component
          multiPageData: {
            pages: data.pages,
            batch_id: data.batch_id,
            total_pages: data.total_pages,
            processingTime: data.processingTime,
            updateId: update.id // Store the actual updateId for publishing
          }
        };
        
        setWebsiteInfo(websiteInfo);
      } else if (data.websiteInfo) {
        // Fallback to single page format
        console.log('✅ Setting website info and switching to preview:', data.websiteInfo);
        setWebsiteInfo(data.websiteInfo);
      }
      
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

  const handleEditPage = (index: number, field: string, value: string) => {
    setWebsiteInfo(prev => {
      if (!prev.multiPageData) return prev;
      
      const updatedPages = [...prev.multiPageData.pages];
      updatedPages[index] = { ...updatedPages[index], [field]: value };
      
      return {
        ...prev,
        multiPageData: {
          ...prev.multiPageData,
          pages: updatedPages
        }
      };
    });
  };

  const handleDeletePage = (index: number) => {
    setWebsiteInfo(prev => {
      if (!prev.multiPageData) return prev;
      
      const updatedPages = prev.multiPageData.pages.filter((_, i) => i !== index);
      
      return {
        ...prev,
        multiPageData: {
          ...prev.multiPageData,
          pages: updatedPages,
          total_pages: updatedPages.length
        }
      };
    });
  };

  const handlePublishPages = async (pageData: any[]) => {
    if (!business?.id || !websiteInfo.multiPageData?.updateId || !websiteInfo.multiPageData?.batch_id) {
      alert('Missing required data for publishing');
      return;
    }

    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('publish-pages', {
        body: {
          updateId: websiteInfo.multiPageData.updateId, // Use the actual updateId
          businessId: business.id,
          pageData: pageData,
          batchId: websiteInfo.multiPageData.batch_id
        }
      });

      if (error) {
        console.error('❌ Error publishing pages:', error);
        alert(`Error publishing pages: ${error.message}`);
        return;
      }

      console.log('✅ Pages published successfully:', data);
      alert(`Successfully published ${data.total_pages} pages!`);
      
      // Reset form and refresh pages
      setUpdateText('');
      setStartDate(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
      });
      setEndDate('');
      setWebsiteInfo({} as WebsiteInfo);
      setViewMode('update');
      await refetchPages();
      
    } catch (error: any) {
      console.error('💥 Unexpected error during publishing:', error);
      alert(`Unexpected error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
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
            {isSidebarOpen && <span>Links</span>}
          </button>

          <button 
            className={`nav-item ${viewMode === 'settings' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('settings');
              setSelectedPage(null);
            }}
          >
            <Settings size={20} className="nav-icon" />
            {isSidebarOpen && <span>Settings</span>}
          </button>

          <button 
            className={`nav-item ${viewMode === 'subscription' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('subscription');
              setSelectedPage(null);
            }}
          >
            <CreditCard size={20} className="nav-icon" />
            {isSidebarOpen && <span>Subscription</span>}
          </button>
          
        </div>


        {/* User Profile Section */}
        <div className="sidebar-footer">
          <div className="profile-menu-container">
            <button 
              className="user-profile-btn"
              onClick={() => signOut()}
            >
              <div className="user-avatar">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              {isSidebarOpen && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="user-email">{user?.email || 'User'}</span>
                  <LogOut size={14} style={{ color: '#ef4444' }} />
                </div>
              )}
            </button>
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
          <div style={{ padding: '2rem' }}>
            <div className="business-details-header" style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: '600', color: '#ffffff', marginBottom: '0.5rem', textAlign: 'center' }}>Business Details</h2>
              <p style={{ color: '#9ca3af', textAlign: 'center', margin: '0' }}>Manage your business profile and information</p>
            </div>
            <BusinessProfileView />
          </div>
        ) : viewMode === 'links' ? (
          <div style={{ padding: '2rem' }}>
            <div className="links-header" style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: '600', color: '#ffffff', marginBottom: '0.5rem', textAlign: 'center' }}>Links</h2>
              <p style={{ color: '#9ca3af', textAlign: 'center', margin: '0' }}>Manage your active and expired pages</p>
            </div>
            <ActiveLinksView 
              pages={pages} 
              activePages={activePages}
              expiredPages={expiredPages}
              onRefresh={refetchPages} 
              onPageClick={handleLinkClick}
              onDeletePage={deletePage}
            />
          </div>
        ) : viewMode === 'settings' ? (
          <div className="settings-view" style={{ padding: '2rem' }}>
            <div className="settings-header" style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: '600', color: '#ffffff', marginBottom: '0.5rem', textAlign: 'center' }}>Settings</h2>
              <p style={{ color: '#9ca3af', textAlign: 'center' }}>Manage your account and preferences</p>
            </div>

            {/* Account Section - All in One */}
            <div className="settings-section" style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: '0.5rem', 
              padding: '1.5rem', 
              marginBottom: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem' }}>Account Information</h3>
              
              {/* Account Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '0.25rem' }}>Email</label>
                  <span style={{ color: '#ffffff' }}>{user?.email || 'Not logged in'}</span>
                </div>
                
                {business && (
                  <>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '0.25rem' }}>Business</label>
                      <span style={{ color: '#ffffff' }}>{business.name || 'Unnamed Business'}</span>
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '0.25rem' }}>Location</label>
                      <span style={{ color: '#ffffff' }}>
                        {business.address_city && business.address_state 
                          ? `${business.address_city}, ${business.address_state}` 
                          : 'Not specified'
                        }
                      </span>
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '0.25rem' }}>Primary Category</label>
                      <span style={{ color: '#ffffff' }}>{business.primary_category || 'Not specified'}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                <button style={{
                  background: '#6366f1',
                  border: 'none',
                  color: 'white',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}>
                  Export Data
                </button>
                
                <button style={{
                  background: '#f59e0b',
                  border: 'none',
                  color: 'white',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}>
                  Clear Pages
                </button>
                
                <button style={{
                  background: '#10b981',
                  border: 'none',
                  color: 'white',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}>
                  Help
                </button>
                
                <button style={{
                  background: '#8b5cf6',
                  border: 'none',
                  color: 'white',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}>
                  Support
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            {business && (
              <div className="danger-zone" style={{ 
                background: 'rgba(239, 68, 68, 0.05)', 
                borderRadius: '0.5rem', 
                padding: '1.5rem',
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#ef4444', marginBottom: '1rem' }}>Danger Zone</h3>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  padding: '1rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: '0.375rem',
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.5rem' }}>Delete Business Profile</h4>
                    <p style={{ fontSize: '0.875rem', color: '#d1d5db', margin: 0 }}>This will permanently delete your business profile and all associated data. You can create a new profile anytime.</p>
                  </div>
                  <button 
                    onClick={() => {
                      const confirmed = window.confirm('Are you sure you want to delete your business profile? This action cannot be undone.');
                      if (confirmed) {
                        // Handle delete logic here
                        alert('Delete functionality would be implemented here');
                      }
                    }}
                    style={{
                      background: '#ef4444',
                      border: 'none',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      marginLeft: '1rem',
                      flexShrink: 0
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#dc2626';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#ef4444';
                    }}
                  >
                    Delete Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : viewMode === 'subscription' ? (
          <div className="subscription-view" style={{ padding: '2rem' }}>
            <div className="subscription-header" style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: '600', color: '#ffffff', marginBottom: '0.5rem', textAlign: 'center' }}>Subscription</h2>
              <p style={{ color: '#9ca3af', textAlign: 'center' }}>Manage your billing and subscription</p>
            </div>
            
            {/* Enhanced Subscription Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
              
              {/* Main Subscription Status */}
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                borderRadius: '0.5rem', 
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#ffffff', margin: 0 }}>Current Status</h3>
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.375rem 0.75rem',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.375rem',
                    color: '#d1d5db',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}>
                    Refresh
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '0.25rem' }}>Plan</label>
                    <span style={{ color: '#ffffff', fontWeight: '500' }}>Professional</span>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '0.25rem' }}>Status</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
                      <span style={{ color: '#10b981', fontWeight: '500' }}>Active</span>
                    </div>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '0.25rem' }}>Next Billing</label>
                    <span style={{ color: '#ffffff' }}>September 28, 2025</span>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '0.25rem' }}>Amount</label>
                    <span style={{ color: '#ffffff', fontWeight: '500' }}>$79.00</span>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '0.25rem' }}>Started</label>
                    <span style={{ color: '#ffffff' }}>August 28, 2025</span>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db', marginBottom: '0.25rem' }}>Billing Method</label>
                    <span style={{ color: '#ffffff' }}>Credit Card</span>
                  </div>
                </div>

                {/* Billing Management */}
                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem' }}>Billing Management</h4>
                  
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    width: 'fit-content',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>
                    Manage Subscription & Billing
                  </button>
                  
                  <p style={{ fontSize: '0.875rem', color: '#9ca3af', margin: '0.75rem 0 0 0', textAlign: 'left' }}>
                    <strong style={{ color: '#ffffff' }}>Stripe Customer Portal</strong> handles all subscription management including plan changes, cancellations, payment methods, and billing history.
                  </p>
                </div>
              </div>
              
              {/* Account Overview Sidebar */}
              <div className="subscription-sidebar" style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                borderRadius: '0.5rem', 
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem' }}>Account Overview</h3>
                
                {/* Plan Features */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.75rem' }}>Plan Features</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                      <span style={{ color: '#10b981' }}>✓</span>
                      <span style={{ color: '#d1d5db' }}>Unlimited business updates</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                      <span style={{ color: '#10b981' }}>✓</span>
                      <span style={{ color: '#d1d5db' }}>Advanced AI optimization</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                      <span style={{ color: '#10b981' }}>✓</span>
                      <span style={{ color: '#d1d5db' }}>Priority support</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                      <span style={{ color: '#10b981' }}>✓</span>
                      <span style={{ color: '#d1d5db' }}>Custom business pages</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                      <span style={{ color: '#10b981' }}>✓</span>
                      <span style={{ color: '#d1d5db' }}>Analytics dashboard</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                      <span style={{ color: '#10b981' }}>✓</span>
                      <span style={{ color: '#d1d5db' }}>Social media integration</span>
                    </div>
                  </div>
                </div>
                
                {/* Account Details */}
                <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.75rem' }}>Account Details</h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '0.5rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '0.25rem'
                    }}>
                      <span style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Member Since</span>
                      <span style={{ color: '#ffffff', fontWeight: '500' }}>Aug 2025</span>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '0.5rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '0.25rem'
                    }}>
                      <span style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Plan Type</span>
                      <span style={{ color: '#ffffff', fontWeight: '500' }}>Monthly</span>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '0.5rem',
                      background: 'rgba(16, 185, 129, 0.1)',
                      borderRadius: '0.25rem',
                      border: '1px solid rgba(16, 185, 129, 0.2)'
                    }}>
                      <span style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Auto-Renew</span>
                      <span style={{ color: '#10b981', fontWeight: '500' }}>Enabled</span>
                    </div>
                  </div>
                </div>
                
              </div>
              
            </div>
            
            {/* Plan Comparison */}
            <div className="plan-comparison" style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: '0.5rem', 
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#ffffff', marginBottom: '1rem', textAlign: 'center' }}>Available Plans</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  padding: '1rem', 
                  borderRadius: '0.375rem', 
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>Basic</h4>
                  <p style={{ color: '#d1d5db', fontSize: '0.875rem', margin: '0 0 0.75rem 0' }}>Perfect for small businesses getting started</p>
                  <div style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.75rem' }}>$29<span style={{ fontSize: '0.875rem', fontWeight: '400' }}>/mo</span></div>
                  <ul style={{ color: '#d1d5db', fontSize: '0.875rem', listStyle: 'none', padding: 0, margin: 0 }}>
                    <li>Up to 5 business updates per month</li>
                    <li>Basic AI optimization</li>
                    <li>Standard support</li>
                    <li>Mobile-responsive pages</li>
                  </ul>
                </div>
                
                <div style={{ 
                  background: 'rgba(99, 102, 241, 0.1)', 
                  padding: '1rem', 
                  borderRadius: '0.375rem', 
                  textAlign: 'center',
                  border: '2px solid #6366f1'
                }}>
                  <div style={{ background: '#6366f1', color: 'white', fontSize: '0.75rem', fontWeight: '600', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', marginBottom: '0.5rem', width: 'fit-content', margin: '0 auto 0.5rem' }}>CURRENT</div>
                  <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>Professional</h4>
                  <p style={{ color: '#d1d5db', fontSize: '0.875rem', margin: '0 0 0.75rem 0' }}>Ideal for growing businesses</p>
                  <div style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.75rem' }}>$79<span style={{ fontSize: '0.875rem', fontWeight: '400' }}>/mo</span></div>
                  <ul style={{ color: '#d1d5db', fontSize: '0.875rem', listStyle: 'none', padding: 0, margin: 0 }}>
                    <li>Unlimited business updates</li>
                    <li>Advanced AI optimization</li>
                    <li>Priority support</li>
                    <li>Custom business pages</li>
                    <li>Analytics dashboard</li>
                  </ul>
                </div>
                
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  padding: '1rem', 
                  borderRadius: '0.375rem', 
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>Enterprise</h4>
                  <p style={{ color: '#d1d5db', fontSize: '0.875rem', margin: '0 0 0.75rem 0' }}>For established businesses requiring premium features</p>
                  <div style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.75rem' }}>$199<span style={{ fontSize: '0.875rem', fontWeight: '400' }}>/mo</span></div>
                  <ul style={{ color: '#d1d5db', fontSize: '0.875rem', listStyle: 'none', padding: 0, margin: 0 }}>
                    <li>Everything in Professional</li>
                    <li>Dedicated account manager</li>
                    <li>Custom integrations</li>
                    <li>Multi-location support</li>
                    <li>White-label options</li>
                  </ul>
                </div>
              </div>
            </div>
            
          </div>
        ) : viewMode === 'analytics' && selectedPage ? (
          <LinkAnalytics page={selectedPage} onClose={handleBackToChat} />
        ) : viewMode === 'preview' ? (
          <div className="preview-full-screen">
            <PagePreview 
              websiteInfo={websiteInfo} 
              onEdit={handlePreviewEdit}
              onEditPage={handleEditPage}
              onDeletePage={handleDeletePage}
              onPublishPages={handlePublishPages}
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