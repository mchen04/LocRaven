'use client';

import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/components/ui/use-toast';
import type { UserLink } from '@/features/links/types/links-types';
import { BusinessUpdatesService } from '@/services/business-updates';
import type { BusinessUpdate, GeneratedPage, UpdateFormData, UpdateFormErrors } from '@/types/business-updates';

interface EditUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: UserLink;
  onSuccess: (updatedPages?: GeneratedPage[]) => void;
}

export function EditUpdateModal({ isOpen, onClose, link, onSuccess }: EditUpdateModalProps) {
  const { toast } = useToast();
  
  // Form state - extended to handle AI-generated content
  const [formData, setFormData] = useState<UpdateFormData & {
    pageTitle?: string;
    seoDescription?: string;
  }>({
    contentText: '',
    startDate: '',
    expireDate: '',
    specialHours: '',
    updateCategory: 'general',
    dealTerms: '',
    pageTitle: '',
    seoDescription: '',
  });
  
  const [formErrors, setFormErrors] = useState<UpdateFormErrors & {
    pageTitle?: string;
    seoDescription?: string;
  }>({});
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  // Original update data
  const [originalUpdate, setOriginalUpdate] = useState<BusinessUpdate | null>(null);

  const loadUpdateData = useCallback(async () => {
    if (!link.updateId) {
      toast({
        title: "Error",
        description: "Cannot edit: Update ID not found",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await BusinessUpdatesService.getUpdateById(link.updateId);
      
      if (response.success && response.data) {
        const update = response.data;
        setOriginalUpdate(update);
        
        // Populate form with existing data
        setFormData({
          contentText: update.content_text || '',
          startDate: update.created_at ? new Date(update.created_at).toISOString().split('T')[0] : '',
          expireDate: update.expires_at ? new Date(update.expires_at).toISOString().split('T')[0] : '',
          specialHours: update.special_hours_today || '',
          updateCategory: update.update_category || 'general',
          dealTerms: update.deal_terms || '',
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to load update data",
          variant: "destructive",
        });
        onClose();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load update data",
        variant: "destructive",
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  }, [link.updateId, toast, onClose]);

  const loadPageData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const response = await BusinessUpdatesService.getGeneratedPageById(link.id);
      
      if (response.success && response.data) {
        const page = response.data;
        const decompressed = page.decompressedData;
        
        // Extract AI-generated content from decompressed page_data
        setFormData({
          pageTitle: page.title || '',
          seoDescription: decompressed?.seo?.description || '',
          contentText: decompressed?.update?.content_text || '',
          startDate: page.created_at ? new Date(page.created_at).toISOString().split('T')[0] : '',
          expireDate: page.expires_at ? new Date(page.expires_at).toISOString().split('T')[0] : '',
          specialHours: decompressed?.update?.special_hours_today || '',
          updateCategory: decompressed?.update?.update_category || 'general',
          dealTerms: decompressed?.update?.deal_terms || '',
        });
        
        // No original update for standalone pages
        setOriginalUpdate(null);
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to load page data",
          variant: "destructive",
        });
        onClose();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load page data",
        variant: "destructive",
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  }, [link.id, toast, onClose]);

  // Load the original data when modal opens (either update or page data)
  useEffect(() => {
    if (isOpen) {
      if (link.updateId) {
        loadUpdateData();
      } else {
        loadPageData();
      }
    }
  }, [isOpen, link.updateId, loadUpdateData, loadPageData]);

  const validateForm = (): boolean => {
    const errors: UpdateFormErrors & {
      pageTitle?: string;
      seoDescription?: string;
    } = {};

    // For standalone pages, validate page title instead of content text
    if (!originalUpdate && !formData.pageTitle?.trim()) {
      errors.pageTitle = 'Page title is required';
    } else if (originalUpdate && !formData.contentText.trim()) {
      errors.contentText = 'Update content is required';
    }

    // Validate page title length
    if (formData.pageTitle && formData.pageTitle.length > 60) {
      errors.pageTitle = 'Page title must be 60 characters or less';
    }

    // Validate SEO description length
    if (formData.seoDescription && formData.seoDescription.length > 160) {
      errors.seoDescription = 'SEO description must be 160 characters or less';
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

  const handleFormChange = (field: keyof (UpdateFormData & { pageTitle?: string; seoDescription?: string }), value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) return;

    setIsSaving(true);

    try {
      if (originalUpdate) {
        // This is a page created from an update - use update method
        const response = await BusinessUpdatesService.updateUpdate(originalUpdate.id, formData);
        
        if (response.success) {
          toast({
            title: "Success",
            description: "Update saved successfully",
          });
          onSuccess();
          onClose();
        } else {
          toast({
            title: "Error", 
            description: response.error || "Failed to save changes",
            variant: "destructive",
          });
        }
      } else {
        // This is a standalone page - update page directly with AI-generated content
        const response = await BusinessUpdatesService.updateGeneratedPage(link.id, {
          title: formData.pageTitle,
          seoDescription: formData.seoDescription,
          contentText: formData.contentText,
          expires_at: formData.expireDate ? new Date(formData.expireDate).toISOString() : null,
        });
        
        if (response.success) {
          toast({
            title: "Success",
            description: "Page updated successfully",
          });
          onSuccess();
          onClose();
        } else {
          toast({
            title: "Error", 
            description: response.error || "Failed to update page",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerateWithAI = async () => {
    if (!validateForm() || !originalUpdate) return;

    setIsRegenerating(true);

    try {
      const response = await BusinessUpdatesService.regenerateUpdate(originalUpdate.id, formData);
      
      if (response.success && response.data) {
        toast({
          title: "Pages regenerated!",
          description: `Successfully regenerated ${response.data.total_pages} AI-optimized pages`,
        });
        onSuccess(response.data.pages);
        onClose();
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to regenerate pages",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to regenerate pages", 
        variant: "destructive",
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleClose = () => {
    if (isSaving || isRegenerating) return; // Prevent closing during operations
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Update</SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="text-white mb-2">Loading update data...</div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-6">
            {/* AI-Generated Fields for Standalone Pages */}
            {!originalUpdate && (
              <>
                {/* Page Title */}
                <div>
                  <label htmlFor="page-title" className="mb-2 block text-sm font-medium text-white">
                    Page Title <span className="text-blue-400">(AI Generated)</span>
                  </label>
                  <input
                    id="page-title"
                    type="text"
                    value={formData.pageTitle}
                    onChange={(e) => handleFormChange('pageTitle', e.target.value)}
                    className={`w-full rounded-md border bg-zinc-800 px-3 py-2 text-white placeholder-zinc-400 focus:outline-none focus:ring-1 ${
                      formErrors.pageTitle 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-zinc-700 focus:border-zinc-600 focus:ring-zinc-600'
                    }`}
                    placeholder="Enter the page title..."
                    maxLength={60}
                  />
                  <div className="mt-1 flex justify-between">
                    {formErrors.pageTitle && (
                      <p className="text-sm text-red-400">{formErrors.pageTitle}</p>
                    )}
                    <span className="text-xs text-zinc-400">
                      {formData.pageTitle?.length || 0}/60 characters
                    </span>
                  </div>
                </div>

                {/* SEO Description */}
                <div>
                  <label htmlFor="seo-description" className="mb-2 block text-sm font-medium text-white">
                    SEO Description <span className="text-blue-400">(AI Generated)</span>
                  </label>
                  <textarea
                    id="seo-description"
                    value={formData.seoDescription}
                    onChange={(e) => handleFormChange('seoDescription', e.target.value)}
                    className={`min-h-20 w-full rounded-md border bg-zinc-800 px-3 py-2 text-white placeholder-zinc-400 focus:outline-none focus:ring-1 ${
                      formErrors.seoDescription 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-zinc-700 focus:border-zinc-600 focus:ring-zinc-600'
                    }`}
                    placeholder="Enter the SEO description for search engines..."
                    maxLength={160}
                  />
                  <div className="mt-1 flex justify-between">
                    {formErrors.seoDescription && (
                      <p className="text-sm text-red-400">{formErrors.seoDescription}</p>
                    )}
                    <span className="text-xs text-zinc-400">
                      {formData.seoDescription?.length || 0}/160 characters
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Content Text */}
            <div>
              <label htmlFor="update-text" className="mb-2 block text-sm font-medium text-white">
                {originalUpdate ? 'Update Content' : 'Announcement Content'} 
                {!originalUpdate && <span className="text-blue-400"> (AI Generated)</span>}
              </label>
              <textarea
                id="update-text"
                value={formData.contentText}
                onChange={(e) => handleFormChange('contentText', e.target.value)}
                className={`min-h-24 w-full rounded-md border bg-zinc-800 px-3 py-2 text-white placeholder-zinc-400 focus:outline-none focus:ring-1 ${
                  formErrors.contentText 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-zinc-700 focus:border-zinc-600 focus:ring-zinc-600'
                }`}
                placeholder={originalUpdate ? "Enter your business update or announcement..." : "The announcement or update content..."}
              />
              {formErrors.contentText && (
                <p className="mt-1 text-sm text-red-400">{formErrors.contentText}</p>
              )}
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="start-date" className="mb-2 block text-sm font-medium text-white">
                  Start Date
                </label>
                <Input
                  id="start-date"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleFormChange('startDate', e.target.value)}
                  className="bg-zinc-800 text-white border-zinc-700 focus:border-zinc-600"
                />
              </div>
              <div>
                <label htmlFor="expire-date" className="mb-2 block text-sm font-medium text-white">
                  Expire Date
                </label>
                <Input
                  id="expire-date"
                  type="date"
                  value={formData.expireDate}
                  onChange={(e) => handleFormChange('expireDate', e.target.value)}
                  className={`bg-zinc-800 text-white ${
                    formErrors.expireDate
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-zinc-700 focus:border-zinc-600'
                  }`}
                />
                {formErrors.expireDate && (
                  <p className="mt-1 text-sm text-red-400">{formErrors.expireDate}</p>
                )}
              </div>
            </div>

            {/* Optional Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="special-hours" className="mb-2 block text-sm font-medium text-white">
                  Special Hours (Optional)
                </label>
                <Input
                  id="special-hours"
                  value={formData.specialHours}
                  onChange={(e) => handleFormChange('specialHours', e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600"
                  placeholder="e.g., Open until 10pm today"
                />
              </div>
              <div>
                <label htmlFor="update-category" className="mb-2 block text-sm font-medium text-white">
                  Category
                </label>
                <select
                  id="update-category"
                  value={formData.updateCategory}
                  onChange={(e) => handleFormChange('updateCategory', e.target.value)}
                  className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                >
                  <option value="general">General Update</option>
                  <option value="special">Special/Promotion</option>
                  <option value="hours">Hours Change</option>
                  <option value="event">Event</option>
                  <option value="new_service">New Service</option>
                  <option value="closure">Closure</option>
                </select>
              </div>
            </div>

            {/* Deal Terms (conditional) */}
            {formData.updateCategory === 'special' && (
              <div>
                <label htmlFor="deal-terms" className="mb-2 block text-sm font-medium text-white">
                  Deal Terms (Optional)
                </label>
                <Input
                  id="deal-terms"
                  value={formData.dealTerms}
                  onChange={(e) => handleFormChange('dealTerms', e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600"
                  placeholder="e.g., Valid for new customers only"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="border-t border-zinc-700 pt-6">
              <div className="space-y-4">
                {/* Helper Text */}
                <div className="bg-zinc-800 rounded-md p-4">
                  <h4 className="text-white font-medium mb-2">
                    {originalUpdate ? 'Save Options:' : 'Editing AI-Generated Content:'}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-zinc-300">
                        <strong>Save Changes</strong> - {originalUpdate 
                          ? 'Free updates to dates, hours, and text' 
                          : 'Free edits to AI-generated title, description, and content'}
                      </span>
                    </div>
                    {originalUpdate && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-zinc-300">
                          <strong>Save & Regenerate</strong> - Costs 1 update credit for fresh AI content
                        </span>
                      </div>
                    )}
                    {!originalUpdate && (
                      <div className="mt-2 text-xs text-zinc-400">
                        You&apos;re editing the actual AI-generated content that appears on your page. 
                        Changes will be reflected immediately after saving.
                      </div>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleSaveChanges}
                    disabled={isSaving || isRegenerating}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  {originalUpdate && (
                    <Button
                      onClick={handleRegenerateWithAI}
                      disabled={isSaving || isRegenerating}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {isRegenerating ? 'Regenerating...' : 'Save & Regenerate (1 Credit)'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}