'use client';

import { useEffect, useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import type { UsageStats } from '@/features/account/controllers/get-usage-stats';
import type { BusinessProfile as FeatureBusinessProfile } from '@/features/business/types/business-types';
import { BusinessUpdatesService } from '@/services/business-updates';
import type {
  BusinessProfile,
  BusinessUpdate,
  BusinessUsage,
  GeneratedPage,
  UpdateFormData,
  UpdateFormErrors,
} from '@/types/business-updates';
import { mapBusinessProfileForUpdates, mapUsageStatsToBusinessUsage } from '@/utils/business-data-mappers';

interface UpdatesTabProps {
  initialBusinessProfile?: FeatureBusinessProfile | null;
  initialUsageStats?: UsageStats | null;
}

export function UpdatesTab({ initialBusinessProfile, initialUsageStats }: UpdatesTabProps) {
  // Form state
  const [formData, setFormData] = useState<UpdateFormData>({
    contentText: '',
    startDate: '',
    expireDate: '',
    specialHours: '',
    updateCategory: 'general',
    dealTerms: '',
  });
  
  const [formErrors, setFormErrors] = useState<UpdateFormErrors>({});
  
  // API state
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState<string[]>([]);
  const [currentUpdate, setCurrentUpdate] = useState<BusinessUpdate | null>(null);
  const [generatedPages, setGeneratedPages] = useState<GeneratedPage[]>([]);
  
  // Initialize with mapped server data if available
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(
    initialBusinessProfile ? mapBusinessProfileForUpdates(initialBusinessProfile) : null
  );
  const [businessUsage, setBusinessUsage] = useState<BusinessUsage | null>(
    initialUsageStats && initialBusinessProfile 
      ? mapUsageStatsToBusinessUsage(initialUsageStats, initialBusinessProfile.id) 
      : null
  );
  
  // UI state
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();

  // Data is now passed as props from server component - no need for client-side fetching

  // Real-time subscriptions for update status
  useEffect(() => {
    if (!currentUpdate) return;

    const updateSubscription = BusinessUpdatesService.subscribeToUpdateStatus(
      currentUpdate.id,
      (update) => {
        setCurrentUpdate(update);
        if (update.status === 'ready-for-preview') {
          loadGeneratedPages(update.id);
        }
      }
    );

    const pagesSubscription = BusinessUpdatesService.subscribeToGeneratedPages(
      currentUpdate.id,
      setGeneratedPages
    );

    return () => {
      BusinessUpdatesService.unsubscribe(updateSubscription);
      BusinessUpdatesService.unsubscribe(pagesSubscription);
    };
  }, [currentUpdate]);

  // Business profile and usage data now comes from server props

  const loadGeneratedPages = async (updateId: string) => {
    const response = await BusinessUpdatesService.getGeneratedPages(updateId);
    if (response.success && response.data) {
      setGeneratedPages(response.data);
    }
  };

  const validateForm = (): boolean => {
    const errors: UpdateFormErrors = {};

    if (!formData.contentText.trim()) {
      errors.contentText = 'Update content is required';
    }

    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }

    if (!formData.expireDate) {
      errors.expireDate = 'Expire date is required';
    }

    if (formData.startDate && formData.expireDate) {
      const startDate = new Date(formData.startDate);
      const expireDate = new Date(formData.expireDate);
      if (expireDate <= startDate) {
        errors.expireDate = 'Expire date must be after start date';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (field: keyof UpdateFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleGeneratePages = async () => {
    if (!validateForm()) return;

    // Check usage limits
    if (businessUsage && businessUsage.updates_used >= businessUsage.updates_limit) {
      setErrorMessage(`Usage limit reached: ${businessUsage.updates_used}/${businessUsage.updates_limit} updates used this month`);
      return;
    }

    setIsGenerating(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      console.log('🔄 Starting page generation process...');
      
      // Step 1: Create the update
      console.log('📝 Creating update record...');
      const createResponse = await BusinessUpdatesService.createUpdate(formData);
      console.log('✅ Create response:', createResponse);
      
      if (!createResponse.success || !createResponse.data) {
        console.error('❌ Failed to create update:', createResponse.error);
        throw new Error(createResponse.error || 'Failed to create update');
      }

      const update = createResponse.data;
      console.log('✅ Created update:', update);
      setCurrentUpdate(update);

      // Step 2: Process with AI template generation
      console.log('🤖 Processing with AI template generation...');
      const processResponse = await BusinessUpdatesService.processUpdateWithTemplate(update, formData);
      console.log('🔄 Process response:', processResponse);
      
      if (!processResponse.success || !processResponse.data) {
        console.error('❌ Failed to process update:', processResponse.error);
        throw new Error(processResponse.error || 'Failed to process update');
      }

      const result = processResponse.data;
      setGeneratedPages(result.pages);
      toast({
        title: "Pages generated!",
        description: `Successfully created ${result.total_pages} AI-optimized pages in ${result.processingTime}ms`,
      });
      
      // Usage data will be refreshed on next page load

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to generate pages';
      setErrorMessage(errorMsg);
      console.error('Error generating pages:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishPage = async (page: GeneratedPage) => {
    setIsPublishing(prev => [...prev, page.id]);
    setErrorMessage('');

    try {
      const response = await BusinessUpdatesService.publishPages([page.id]);
      if (!response.success) {
        throw new Error(response.error || 'Failed to publish page');
      }

      // Update the page status in local state
      setGeneratedPages(prev => 
        prev.map(p => 
          p.id === page.id 
            ? { ...p, published: true, published_at: new Date().toISOString() }
            : p
        )
      );

      toast({
        title: "Page published",
        description: page.title,
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to publish page';
      setErrorMessage(errorMsg);
    } finally {
      setIsPublishing(prev => prev.filter(id => id !== page.id));
    }
  };

  const handlePublishAllPages = async () => {
    const unpublishedPages = generatedPages.filter(page => !page.published);
    if (unpublishedPages.length === 0) return;

    const pageIds = unpublishedPages.map(page => page.id);
    setIsPublishing(pageIds);
    setErrorMessage('');

    try {
      const response = await BusinessUpdatesService.publishPages(pageIds, generatedPages[0]?.generation_batch_id);
      if (!response.success) {
        throw new Error(response.error || 'Failed to publish pages');
      }

      // Update all pages status in local state
      setGeneratedPages(prev => 
        prev.map(page => 
          pageIds.includes(page.id)
            ? { ...page, published: true, published_at: new Date().toISOString() }
            : page
        )
      );

      toast({
        title: "All pages published",
        description: `Successfully published ${unpublishedPages.length} pages`,
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to publish pages';
      setErrorMessage(errorMsg);
    } finally {
      setIsPublishing([]);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Usage and Business Info */}
      <div className='flex items-center justify-between rounded-md bg-zinc-900 p-4'>
        <div>
          <h3 className='text-lg font-medium text-white'>
            {businessProfile?.name || 'Business Profile'}
          </h3>
          <p className='text-sm text-zinc-400'>
            {businessProfile?.address_city && businessProfile?.address_state
              ? `${businessProfile.address_city}, ${businessProfile.address_state}`
              : 'Complete your business profile to get started'
            }
          </p>
        </div>
        <div className='text-right'>
          <p className='text-sm text-zinc-400'>Usage this month</p>
          <p className='text-lg font-semibold text-white'>
            {businessUsage 
              ? `${businessUsage.updates_used}/${businessUsage.updates_limit === 0 ? 'Unlimited' : businessUsage.updates_limit}`
              : '0/250'
            }
          </p>
        </div>
      </div>

      {/* Error and Success Messages */}
      {errorMessage && (
        <Alert className='border-red-500 bg-red-950 text-red-200'>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert className='border-green-500 bg-green-950 text-green-200'>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <Card title='Create Business Update'>
        <div className='space-y-4'>
          <div>
            <label htmlFor='update-text' className='mb-2 block text-sm font-medium text-white'>
              Update Content
            </label>
            <textarea
              id='update-text'
              value={formData.contentText}
              onChange={(e) => handleFormChange('contentText', e.target.value)}
              className={`min-h-24 w-full rounded-md border bg-zinc-800 px-3 py-2 text-white placeholder-zinc-400 focus:outline-none focus:ring-1 ${
                formErrors.contentText 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-zinc-700 focus:border-zinc-600 focus:ring-zinc-600'
              }`}
              placeholder='Enter your business update or announcement...'
            />
            {formErrors.contentText && (
              <p className='mt-1 text-sm text-red-400'>{formErrors.contentText}</p>
            )}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label htmlFor='start-date' className='mb-2 block text-sm font-medium text-white'>
                Start Date
              </label>
              <Input
                id='start-date'
                type='date'
                value={formData.startDate}
                onChange={(e) => handleFormChange('startDate', e.target.value)}
                className={`bg-zinc-800 text-white ${
                  formErrors.startDate
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-zinc-700 focus:border-zinc-600'
                }`}
              />
              {formErrors.startDate && (
                <p className='mt-1 text-sm text-red-400'>{formErrors.startDate}</p>
              )}
            </div>
            <div>
              <label htmlFor='expire-date' className='mb-2 block text-sm font-medium text-white'>
                Expire Date
              </label>
              <Input
                id='expire-date'
                type='date'
                value={formData.expireDate}
                onChange={(e) => handleFormChange('expireDate', e.target.value)}
                className={`bg-zinc-800 text-white ${
                  formErrors.expireDate
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-zinc-700 focus:border-zinc-600'
                }`}
              />
              {formErrors.expireDate && (
                <p className='mt-1 text-sm text-red-400'>{formErrors.expireDate}</p>
              )}
            </div>
          </div>

          {/* Optional fields */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label htmlFor='special-hours' className='mb-2 block text-sm font-medium text-white'>
                Special Hours (Optional)
              </label>
              <Input
                id='special-hours'
                value={formData.specialHours}
                onChange={(e) => handleFormChange('specialHours', e.target.value)}
                className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600'
                placeholder='e.g., Open until 10pm today'
              />
            </div>
            <div>
              <label htmlFor='update-category' className='mb-2 block text-sm font-medium text-white'>
                Category
              </label>
              <select
                id='update-category'
                value={formData.updateCategory}
                onChange={(e) => handleFormChange('updateCategory', e.target.value)}
                className='w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600'
              >
                <option value='general'>General Update</option>
                <option value='special'>Special/Promotion</option>
                <option value='hours'>Hours Change</option>
                <option value='event'>Event</option>
                <option value='new_service'>New Service</option>
                <option value='closure'>Closure</option>
              </select>
            </div>
          </div>

          {formData.updateCategory === 'special' && (
            <div>
              <label htmlFor='deal-terms' className='mb-2 block text-sm font-medium text-white'>
                Deal Terms (Optional)
              </label>
              <Input
                id='deal-terms'
                value={formData.dealTerms}
                onChange={(e) => handleFormChange('dealTerms', e.target.value)}
                className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600'
                placeholder='e.g., Valid for new customers only'
              />
            </div>
          )}

          {/* Current Update Status */}
          {currentUpdate && (
            <div className='rounded-md bg-zinc-800 p-3'>
              <div className='flex items-center justify-between'>
                <span className='text-white'>Status:</span>
                <Badge 
                  variant={
                    currentUpdate.status === 'ready-for-preview' ? 'default' :
                    currentUpdate.status === 'processing' ? 'secondary' :
                    currentUpdate.status === 'failed' ? 'destructive' : 'outline'
                  }
                >
                  {currentUpdate.status.replace('-', ' ')}
                </Badge>
              </div>
              {currentUpdate.processing_time_ms && (
                <p className='text-sm text-zinc-400 mt-1'>
                  Processing time: {currentUpdate.processing_time_ms}ms
                </p>
              )}
              {currentUpdate.error_message && (
                <p className='text-sm text-red-400 mt-1'>
                  Error: {currentUpdate.error_message}
                </p>
              )}
            </div>
          )}

          <Button
            onClick={handleGeneratePages}
            disabled={isGenerating || (businessUsage ? businessUsage.updates_used >= businessUsage.updates_limit : false)}
            className='w-full'
          >
            {isGenerating ? 'Generating AI Pages...' : 'Generate AI Pages'}
          </Button>
        </div>
      </Card>

      {generatedPages.length > 0 && (
        <Card title={`Generated Pages (${generatedPages.length})`}>
          <div className='space-y-4'>
            {/* Bulk actions */}
            <div className='flex items-center justify-between'>
              <p className='text-sm text-zinc-400'>
                {generatedPages.filter(p => p.published).length} of {generatedPages.length} pages published
              </p>
              {generatedPages.some(page => !page.published) && (
                <Button
                  size='sm'
                  onClick={handlePublishAllPages}
                  disabled={isPublishing.length > 0}
                >
                  {isPublishing.length > 0 ? 'Publishing...' : 'Publish All'}
                </Button>
              )}
            </div>

            {/* Generated pages list */}
            <div className='space-y-3'>
              {generatedPages.map((page) => (
                <div
                  key={page.id}
                  className='flex items-center justify-between rounded-md bg-zinc-800 p-4'
                >
                  <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                      <span className='text-white font-medium'>{page.title}</span>
                      <Badge variant='outline' className='text-xs'>
                        {page.intent_type}
                      </Badge>
                      {page.published && (
                        <Badge variant='default' className='text-xs'>
                          Published
                        </Badge>
                      )}
                    </div>
                    <p className='text-sm text-zinc-400 mt-1'>
                      {page.slug} • {page.estimated_html_size_kb || page.rendered_size_kb}KB
                    </p>
                    {page.published_at && (
                      <p className='text-xs text-zinc-500'>
                        Published: {new Date(page.published_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className='flex gap-2'>
                    {!page.published ? (
                      <>
                        <Button size='sm' variant='secondary' asChild>
                          <a href={`https://pub-31a9302263d148d4b7988d574b3c2488.r2.dev${page.file_path}/index.html`} target='_blank' rel='noopener noreferrer'>
                            Preview
                          </a>
                        </Button>
                        <Button
                          size='sm'
                          onClick={() => handlePublishPage(page)}
                          disabled={isPublishing.includes(page.id)}
                        >
                          {isPublishing.includes(page.id) ? 'Publishing...' : 'Publish'}
                        </Button>
                      </>
                    ) : (
                      <Button size='sm' variant='outline' asChild>
                        <a href={`https://locraven.com${page.file_path}`} target='_blank' rel='noopener noreferrer'>
                          View Live
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

// Reuse the Card component from the original account page
function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className='w-full rounded-md bg-zinc-900'>
      <div className='p-4'>
        <h2 className='mb-4 text-xl font-semibold text-white'>{title}</h2>
        <div>{children}</div>
      </div>
    </div>
  );
}