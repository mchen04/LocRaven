// Business updates API service layer for Supabase integration

import type {
  ApiResponse,
  BusinessProfile,
  BusinessUpdate,
  BusinessUsage,
  GeneratedPage,
  ProcessUpdateRequest,
  ProcessUpdateResponse,
  PublishPagesRequest,
  PublishPagesResponse,
  UpdateFormData,
} from '@/types/business-updates';
import { getEnvVar } from '@/utils/get-env-var';
import { createBrowserClient } from '@supabase/ssr';

// Initialize Supabase client
const supabase = createBrowserClient(
  getEnvVar(process.env.NEXT_PUBLIC_SUPABASE_URL!, 'NEXT_PUBLIC_SUPABASE_URL'),
  getEnvVar(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 'NEXT_PUBLIC_SUPABASE_ANON_KEY')
);

export class BusinessUpdatesService {
  /**
   * Get current user's business profile
   */
  static async getCurrentBusinessProfile(): Promise<ApiResponse<BusinessProfile>> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        return { success: false, error: 'User not authenticated' };
      }

      if (!user.email) {
        return { success: false, error: 'User email not found' };
      }

      const { data: business, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('email', user.email)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: business };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch business profile' 
      };
    }
  }

  /**
   * Create a new business update
   */
  static async createUpdate(formData: UpdateFormData): Promise<ApiResponse<BusinessUpdate>> {
    try {
      const businessResponse = await this.getCurrentBusinessProfile();
      if (!businessResponse.success || !businessResponse.data) {
        return { success: false, error: 'Business profile not found' };
      }

      const business = businessResponse.data;
      
      // Create the update record
      const updateData = {
        business_id: business.id,
        content_text: formData.contentText,
        status: 'draft' as const,
        created_at: new Date().toISOString(),
        expires_at: formData.expireDate ? new Date(formData.expireDate).toISOString() : null,
        special_hours_today: formData.specialHours || null,
        deal_terms: formData.dealTerms || null,
        update_category: formData.updateCategory || 'general',
        expiration_date_time: formData.expireDate ? new Date(formData.expireDate).toISOString() : null,
      };

      const { data: update, error } = await supabase
        .from('updates')
        .insert(updateData)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: update };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create update' 
      };
    }
  }

  /**
   * Process update with AI template generation
   */
  static async processUpdateWithTemplate(
    update: BusinessUpdate,
    formData: UpdateFormData
  ): Promise<ApiResponse<ProcessUpdateResponse>> {
    try {
      const businessResponse = await this.getCurrentBusinessProfile();
      if (!businessResponse.success || !businessResponse.data) {
        return { success: false, error: 'Business profile not found' };
      }

      const business = businessResponse.data;

      const requestData: ProcessUpdateRequest = {
        updateId: update.id,
        businessId: business.id,
        contentText: formData.contentText,
        temporalInfo: {
          dealTerms: formData.dealTerms,
          expiresAt: formData.expireDate ? new Date(formData.expireDate).toISOString() : undefined,
          updateCategory: formData.updateCategory || 'general',
        },
        specialHours: formData.specialHours,
      };

      // Call the edge function
      const { data, error } = await supabase.functions.invoke('process-update-with-template', {
        body: requestData,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process update' 
      };
    }
  }

  /**
   * Get generated pages for an update
   */
  static async getGeneratedPages(updateId: string): Promise<ApiResponse<GeneratedPage[]>> {
    try {
      const { data: pages, error } = await supabase
        .from('generated_pages')
        .select('*')
        .eq('update_id', updateId)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: pages || [] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch generated pages' 
      };
    }
  }

  /**
   * Publish selected pages
   */
  static async publishPages(
    pageIds: string[],
    batchId?: string
  ): Promise<ApiResponse<PublishPagesResponse>> {
    try {
      const requestData: PublishPagesRequest = {
        pageIds,
        batchId,
      };

      // Call the publish-pages edge function
      const { data, error } = await supabase.functions.invoke('publish-pages', {
        body: requestData,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to publish pages' 
      };
    }
  }

  /**
   * Get update status
   */
  static async getUpdateStatus(updateId: string): Promise<ApiResponse<BusinessUpdate>> {
    try {
      const { data: update, error } = await supabase
        .from('updates')
        .select('*')
        .eq('id', updateId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: update };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch update status' 
      };
    }
  }

  /**
   * Get business usage tracking
   */
  static async getBusinessUsage(): Promise<ApiResponse<BusinessUsage>> {
    try {
      const businessResponse = await this.getCurrentBusinessProfile();
      if (!businessResponse.success || !businessResponse.data) {
        return { success: false, error: 'Business profile not found' };
      }

      const business = businessResponse.data;

      // Calculate current month boundaries
      const currentMonthStart = new Date();
      currentMonthStart.setDate(1);
      currentMonthStart.setHours(0, 0, 0, 0);

      const { data: usage, error } = await supabase
        .from('business_usage_tracking')
        .select('*')
        .eq('business_id', business.id)
        .eq('usage_period_start', currentMonthStart.toISOString())
        .single();

      if (error) {
        // If no usage record exists, return default values
        if (error.code === 'PGRST116') {
          return {
            success: true,
            data: {
              business_id: business.id,
              updates_used: 0,
              updates_limit: 10, // Default limit
              usage_period_start: currentMonthStart.toISOString(),
              usage_period_end: new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth() + 1, 0).toISOString(),
            },
          };
        }
        return { success: false, error: error.message };
      }

      return { success: true, data: usage };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch business usage' 
      };
    }
  }

  /**
   * Subscribe to real-time updates for processing status
   */
  static subscribeToUpdateStatus(
    updateId: string,
    callback: (update: BusinessUpdate) => void
  ) {
    const subscription = supabase
      .channel(`update-${updateId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'updates',
          filter: `id=eq.${updateId}`,
        },
        (payload) => {
          callback(payload.new as BusinessUpdate);
        }
      )
      .subscribe();

    return subscription;
  }

  /**
   * Subscribe to real-time updates for generated pages
   */
  static subscribeToGeneratedPages(
    updateId: string,
    callback: (pages: GeneratedPage[]) => void
  ) {
    const subscription = supabase
      .channel(`pages-${updateId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'generated_pages',
          filter: `update_id=eq.${updateId}`,
        },
        async () => {
          // Fetch all pages for this update
          const pagesResponse = await this.getGeneratedPages(updateId);
          if (pagesResponse.success && pagesResponse.data) {
            callback(pagesResponse.data);
          }
        }
      )
      .subscribe();

    return subscription;
  }

  /**
   * Delete a generated page (link)
   */
  static async deleteGeneratedPage(pageId: string): Promise<ApiResponse<void>> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user?.email) {
        return { success: false, error: 'User not authenticated' };
      }

      // First verify ownership through business email
      const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('email', user.email)
        .single();

      if (!business) {
        return { success: false, error: 'Business not found' };
      }

      // Delete the page (RLS will verify ownership)
      const { error } = await supabase
        .from('generated_pages')
        .delete()
        .eq('id', pageId)
        .eq('business_id', business.id); // Extra safety check

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete page' 
      };
    }
  }

  /**
   * Unsubscribe from real-time updates
   */
  static unsubscribe(subscription: any) {
    if (subscription) {
      supabase.removeChannel(subscription);
    }
  }
}

export default BusinessUpdatesService;