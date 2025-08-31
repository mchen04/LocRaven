'use client';

import React, { useState, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';
import Sidebar, { type ViewMode } from '../../ui/organisms/Sidebar';
import Card from '../../ui/atoms/Card';
import Button from '../../ui/atoms/Button';
import Input from '../../ui/atoms/Input';
import { cn } from '../../../utils/cn';
import { themeClasses, themeClass } from '../../../theme/utils';
import { BusinessProfileView } from '../business';
import LinkAnalytics from './LinkAnalytics';
import { ActiveLinksView, PagePreview } from '../pages';
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
  const [viewMode, setViewMode] = useState<ViewMode>('update');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [hasAutoSelectedProfile, setHasAutoSelectedProfile] = useState(false);
  const [showProfileTip, setShowProfileTip] = useState(false);
  const [websiteInfo, setWebsiteInfo] = useState<WebsiteInfo>({} as WebsiteInfo);
  
  const updateFromPreview = (field: string, value: string | number | boolean) => {
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
        setWebsiteInfo(data.websiteInfo);
      }
      
      setViewMode('preview');
    } catch (error: unknown) {
      console.error('💥 Unexpected error:', error);
      alert(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle onboarding and UI state
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
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
    if (typeof window === 'undefined') return;
    
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
    
    // Return empty cleanup function when not adding event listener
    return () => {};
  }, [showProfileMenu]);


  const handleGenerateWebsite = async (websiteInfo: WebsiteInfo) => {
    try {
      const generatedPages = await generateWebsite(websiteInfo as any);
      await refetchPages();
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

  const handlePublishPages = async (pageData: Array<Record<string, unknown>>) => {
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
      
    } catch (error: unknown) {
      console.error('💥 Unexpected error during publishing:', error);
      alert(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
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


  const handleViewChange = (view: ViewMode) => {
    setViewMode(view);
    setSelectedPage(null);
  };

  return (
    <div className={cn(
      'grid min-h-screen max-h-screen overflow-hidden',
      'bg-white dark:bg-dark',
      'text-gray-900 dark:text-gray-100',
      'font-sans',
      isSidebarOpen ? 'grid-cols-[16rem,1fr]' : 'grid-cols-[4.375rem,1fr]'
    )}>
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        currentView={viewMode}
        onViewChange={handleViewChange}
        user={user}
        business={business}
        onSignOut={signOut}
      />

      {/* Main Content Area */}
      <main className="overflow-hidden">

        {viewMode === 'profile' ? (
          <div className="p-8">
            <div className="mb-8 text-center">
              <h2 className={cn(themeClasses.heading(), 'text-3xl mb-2')}>Business Details</h2>
              <p className={themeClass('text-muted')}>Manage your business profile and information</p>
            </div>
            <BusinessProfileView />
          </div>
        ) : viewMode === 'links' ? (
          <div className="p-8">
            <div className="mb-8 text-center">
              <h2 className={cn(themeClasses.heading(), 'text-3xl mb-2')}>Links</h2>
              <p className={themeClass('text-muted')}>Manage your active and expired pages</p>
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
          <div className="p-8">
            <div className="mb-8 text-center">
              <h2 className={cn(themeClasses.heading(), 'text-3xl mb-2')}>Settings</h2>
              <p className={themeClass('text-muted')}>Manage your account and preferences</p>
            </div>

            {/* Account Section - All in One */}
            <Card variant="elevated" padding="lg" className="mb-6">
              <h3 className={cn(themeClasses.heading(), 'text-xl mb-4')}>Account Information</h3>
              
              {/* Account Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className={cn('block text-sm font-medium', themeClass('text-muted'), 'mb-1')}>Email</label>
                  <span className={themeClasses.body()}>{user?.email || 'Not logged in'}</span>
                </div>
                
                {business && (
                  <>
                    <div>
                      <label className={cn('block text-sm font-medium', themeClass('text-muted'), 'mb-1')}>Business</label>
                      <span className={themeClasses.body()}>{business.name || 'Unnamed Business'}</span>
                    </div>
                    
                    <div>
                      <label className={cn('block text-sm font-medium', themeClass('text-muted'), 'mb-1')}>Location</label>
                      <span className={themeClasses.body()}>
                        {business.address_city && business.address_state 
                          ? `${business.address_city}, ${business.address_state}` 
                          : 'Not specified'
                        }
                      </span>
                    </div>
                    
                    <div>
                      <label className={cn('block text-sm font-medium', themeClass('text-muted'), 'mb-1')}>Primary Category</label>
                      <span className={themeClasses.body()}>{business.primary_category || 'Not specified'}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button variant="primary" size="sm" fullWidth>
                  Export Data
                </Button>
                
                <Button variant="warning" size="sm" fullWidth>
                  Clear Pages
                </Button>
                
                <Button variant="success" size="sm" fullWidth>
                  Help
                </Button>
                
                <Button variant="secondary" size="sm" fullWidth>
                  Support
                </Button>
              </div>
            </Card>

            {/* Danger Zone */}
            {business && (
              <Card variant="error" padding="lg" className="mt-6">
                <h3 className={cn('text-xl font-semibold mb-4 text-red-600 dark:text-red-400')}>Danger Zone</h3>
                
                <div className="flex justify-between items-start p-4 bg-red-500/10 rounded-md border border-red-500/30">
                  <div>
                    <h4 className="text-base font-semibold text-white mb-2">Delete Business Profile</h4>
                    <p className="text-sm text-gray-300 m-0">This will permanently delete your business profile and all associated data. You can create a new profile anytime.</p>
                  </div>
                  <Button 
                    onClick={() => {
                      if (typeof window === 'undefined') return;
                      const confirmed = window.confirm('Are you sure you want to delete your business profile? This action cannot be undone.');
                      if (confirmed) {
                        // Handle delete logic here
                        alert('Delete functionality would be implemented here');
                      }
                    }}
                    variant="danger"
                    size="sm"
                    className="ml-4 flex-shrink-0"
                  >
                    Delete Profile
                  </Button>
                </div>
              </Card>
            )}
          </div>
        ) : viewMode === 'subscription' ? (
          <div className="subscription-view p-8">
            <div className="subscription-header mb-8">
              <h2 className="text-3xl font-semibold text-white mb-2 text-center">Subscription</h2>
              <p className="text-gray-400 text-center">Manage your billing and subscription</p>
            </div>
            
            {/* Enhanced Subscription Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              
              {/* Main Subscription Status */}
              <Card variant="default" padding="lg" className="lg:col-span-2 bg-white/5 border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-white m-0">Current Status</h3>
                  <Button variant="ghost" size="sm" className="border border-white/20 text-gray-300">
                    Refresh
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Plan</label>
                    <span className="text-white font-medium">Professional</span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="text-emerald-500 font-medium">Active</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Next Billing</label>
                    <span className="text-white">September 28, 2025</span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
                    <span className="text-white font-medium">$79.00</span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Started</label>
                    <span className="text-white">August 28, 2025</span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Billing Method</label>
                    <span className="text-white">Credit Card</span>
                  </div>
                </div>

                {/* Billing Management */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="text-base font-semibold text-white mb-4">Billing Management</h4>
                  
                  <Button variant="primary" size="sm" className="w-fit">
                    Manage Subscription & Billing
                  </Button>
                  
                  <p className="text-sm text-gray-400 mt-3 mb-0 text-left">
                    <strong className="text-white">Stripe Customer Portal</strong> handles all subscription management including plan changes, cancellations, payment methods, and billing history.
                  </p>
                </div>
              </Card>
              
              {/* Account Overview Sidebar */}
              <Card variant="default" padding="lg" className="bg-white/5 border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Account Overview</h3>
                
                {/* Plan Features */}
                <div className="mb-6">
                  <h4 className="text-base font-semibold text-white mb-3">Plan Features</h4>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-emerald-500">✓</span>
                      <span className="text-gray-300">Unlimited business updates</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-emerald-500">✓</span>
                      <span className="text-gray-300">Advanced AI optimization</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-emerald-500">✓</span>
                      <span className="text-gray-300">Priority support</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-emerald-500">✓</span>
                      <span className="text-gray-300">Custom business pages</span>
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
                
              </Card>
              
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
          <div className="p-8">
            {/* Main Update Form */}
            <div className="max-w-2xl mx-auto">
              <div className="mb-8 text-center">
                <div>
                  <h1 className={cn(themeClasses.heading(), 'text-3xl mb-2')}>Create Business Update</h1>
                  <p className={themeClass('text-muted')}>Share news, promotions, or updates about your business</p>
                </div>
              </div>
              
              {/* Profile Tip for New Users */}
              {showProfileTip && (
                <Card variant="info" padding="md" className="mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">💡</span>
                      <span className={themeClass('text-default')}>
                        Adding your business details helps create better pages
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setViewMode('profile');
                          setShowProfileTip(false);
                        }}
                      >
                        Add details
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowProfileTip(false);
                          if (typeof window !== 'undefined') {
                            localStorage.setItem('profileTipDismissed', 'true');
                          }
                        }}
                        title="Dismiss"
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
              
              <Card variant="default" padding="lg">
                {/* Update Content */}
                <div className="mb-6">
                  <label htmlFor="update-text" className={cn('block text-sm font-medium', themeClass('text-default'), 'mb-2')}>
                    Update Details
                  </label>
                  <textarea
                    id="update-text"
                    value={updateText}
                    onChange={(e) => setUpdateText(e.target.value)}
                    placeholder="Share news, promotions, or updates about your business"
                    rows={6}
                    className={cn(
                      'w-full px-3 py-2 border rounded-md resize-y',
                      'border-gray-300 dark:border-gray-600',
                      'bg-white dark:bg-dark-card',
                      'text-gray-900 dark:text-gray-100',
                      'placeholder-gray-500 dark:placeholder-gray-400',
                      'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                      'transition-colors duration-200'
                    )}
                  />
                </div>
                
                {/* Date Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="start-date" className={cn('block text-sm font-medium', themeClass('text-default'), 'mb-2')}>
                      Start Date (Defaults to Today)
                    </label>
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={todaysDate}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="end-date" className={cn('block text-sm font-medium', themeClass('text-default'), 'mb-2')}>
                      End Date (Optional)
                    </label>
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || todaysDate}
                    />
                  </div>
                </div>
                
                {/* Process Button */}
                <Button
                  onClick={handleProcessUpdate}
                  disabled={!updateText.trim() || isProcessing}
                  loading={isProcessing}
                  size="lg"
                  fullWidth
                >
                  Process Update
                </Button>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatDashboard;