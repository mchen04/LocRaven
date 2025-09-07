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

      const requestData = {
        updateId: update.id,
        temporalInfo: {
          dealTerms: formData.dealTerms,
          expiresAt: formData.expireDate ? new Date(formData.expireDate).toISOString() : undefined,
          updateCategory: formData.updateCategory || 'general',
        },
        specialHours: formData.specialHours,
        faqData: null, // Add this field that edge function expects
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
   * Get an update by ID for editing
   */
  static async getUpdateById(updateId: string): Promise<ApiResponse<BusinessUpdate>> {
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

      // Get the update
      const { data: update, error } = await supabase
        .from('updates')
        .select('*')
        .eq('id', updateId)
        .eq('business_id', business.id) // Verify ownership
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: update };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch update' 
      };
    }
  }

  /**
   * Update an existing update without AI regeneration (FREE)
   */
  static async updateUpdate(
    updateId: string, 
    formData: UpdateFormData
  ): Promise<ApiResponse<BusinessUpdate>> {
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

      // Update the record
      const updateData = {
        content_text: formData.contentText,
        expires_at: formData.expireDate ? new Date(formData.expireDate).toISOString() : null,
        special_hours_today: formData.specialHours || null,
        deal_terms: formData.dealTerms || null,
        update_category: formData.updateCategory || 'general',
        expiration_date_time: formData.expireDate ? new Date(formData.expireDate).toISOString() : null,
        updated_at: new Date().toISOString(),
      };

      const { data: update, error } = await supabase
        .from('updates')
        .update(updateData)
        .eq('id', updateId)
        .eq('business_id', business.id) // Verify ownership
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: update };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update' 
      };
    }
  }

  /**
   * Update an existing update and regenerate with AI (PAID - 1 credit)
   */
  static async regenerateUpdate(
    updateId: string, 
    formData: UpdateFormData
  ): Promise<ApiResponse<ProcessUpdateResponse>> {
    try {
      // First update the record (free part)
      const updateResponse = await this.updateUpdate(updateId, formData);
      if (!updateResponse.success || !updateResponse.data) {
        return { success: false, error: updateResponse.error || 'Failed to update record' };
      }

      // Then regenerate with AI (paid part)
      const regenerateResponse = await this.processUpdateWithTemplate(updateResponse.data, formData);
      if (!regenerateResponse.success) {
        return { success: false, error: regenerateResponse.error || 'Failed to regenerate pages' };
      }

      return regenerateResponse;
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to regenerate update' 
      };
    }
  }

  /**
   * Update generated page metadata directly (for pages without updateId)
   */
  static async updateGeneratedPage(
    pageId: string,
    updates: {
      title?: string;
      seoDescription?: string;
      contentText?: string;
      expires_at?: string | null;
    }
  ): Promise<ApiResponse<any>> {
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

      // Get current page to access existing page_data
      const { data: currentPage, error: fetchError } = await supabase
        .from('generated_pages')
        .select('*')
        .eq('id', pageId)
        .eq('business_id', business.id)
        .single();

      if (fetchError || !currentPage) {
        return { success: false, error: 'Page not found' };
      }

      // Decompress existing page_data
      const decompressedData = this.decompressPageData(currentPage.page_data);
      if (!decompressedData) {
        return { success: false, error: 'Invalid page data format' };
      }

      // Update editable fields in decompressed data
      if (updates.seoDescription !== undefined) {
        decompressedData.seo.description = updates.seoDescription;
      }
      
      if (updates.contentText !== undefined) {
        decompressedData.update.content_text = updates.contentText;
      }

      if (updates.expires_at !== undefined) {
        decompressedData.update.expires_at = updates.expires_at;
      }

      // Recompress the updated data
      const compressedPageData = this.compressPageData(decompressedData);

      // Update the generated page
      const updateData: any = {
        updated_at: new Date().toISOString(),
        page_data: compressedPageData,
      };

      // Update direct fields
      if (updates.title !== undefined) {
        updateData.title = updates.title;
      }
      
      if (updates.expires_at !== undefined) {
        updateData.expires_at = updates.expires_at;
      }

      const { data: page, error } = await supabase
        .from('generated_pages')
        .update(updateData)
        .eq('id', pageId)
        .eq('business_id', business.id) // Verify ownership
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: page };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update page' 
      };
    }
  }

  /**
   * Get generated page by ID (for editing pages without updateId)
   */
  static async getGeneratedPageById(pageId: string): Promise<ApiResponse<any>> {
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

      // Get the generated page
      const { data: page, error } = await supabase
        .from('generated_pages')
        .select('*')
        .eq('id', pageId)
        .eq('business_id', business.id) // Verify ownership
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      // Decompress page_data to make AI content accessible
      const decompressedData = this.decompressPageData(page.page_data);

      return { 
        success: true, 
        data: {
          ...page,
          decompressedData
        }
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch page' 
      };
    }
  }

  /**
   * Decompress page_data from the compressed format used in generated_pages
   */
  static decompressPageData(compressedData: any) {
    if (!compressedData) return null;
    
    return {
      business: {
        name: compressedData.b?.n,
        address_city: compressedData.b?.c,
        address_state: compressedData.b?.s,
        address_street: compressedData.b?.st,
        zip_code: compressedData.b?.z,
        country: compressedData.b?.country || 'US',
        phone: compressedData.b?.p,
        phone_country_code: compressedData.b?.pcc,
        email: compressedData.b?.e,
        website: compressedData.b?.w,
        description: compressedData.b?.d,
        primary_category: compressedData.b?.cat,
        services: compressedData.b?.srv,
        specialties: compressedData.b?.sp,
        hours: compressedData.b?.h,
        structured_hours: compressedData.b?.sh,
        price_positioning: compressedData.b?.pr,
        payment_methods: compressedData.b?.pm,
        service_area: compressedData.b?.sa,
        service_area_details: compressedData.b?.sad,
        awards: compressedData.b?.aw,
        certifications: compressedData.b?.cert,
        latitude: compressedData.b?.lat,
        longitude: compressedData.b?.lng,
        languages_spoken: compressedData.b?.lang,
        accessibility_features: compressedData.b?.acc,
        parking_info: compressedData.b?.park,
        enhanced_parking_info: compressedData.b?.epark,
        review_summary: compressedData.b?.rev,
        status_override: compressedData.b?.stat,
        business_faqs: compressedData.b?.faqs,
        featured_items: compressedData.b?.feat,
        social_media: compressedData.b?.social,
        established_year: compressedData.b?.est,
      },
      update: {
        content_text: compressedData.u?.t,
        created_at: compressedData.u?.ca,
        expires_at: compressedData.u?.ea,
        special_hours_today: compressedData.u?.sh,
        deal_terms: compressedData.u?.dt,
        update_category: compressedData.u?.cat,
        update_faqs: compressedData.u?.faqs,
      },
      seo: compressedData.seo || { title: '', description: '' },
      intent: compressedData.i,
      faqs: compressedData.f || [],
    };
  }

  /**
   * Compress page data back to the compressed format for storage
   */
  static compressPageData(data: any) {
    return {
      b: {
        n: data.business?.name,
        c: data.business?.address_city,
        s: data.business?.address_state,
        st: data.business?.address_street,
        z: data.business?.zip_code,
        country: data.business?.country || 'US',
        p: data.business?.phone,
        pcc: data.business?.phone_country_code,
        e: data.business?.email,
        w: data.business?.website,
        d: data.business?.description,
        cat: data.business?.primary_category,
        srv: data.business?.services,
        sp: data.business?.specialties,
        h: data.business?.hours,
        sh: data.business?.structured_hours,
        pr: data.business?.price_positioning,
        pm: data.business?.payment_methods,
        sa: data.business?.service_area,
        sad: data.business?.service_area_details,
        aw: data.business?.awards,
        cert: data.business?.certifications,
        lat: data.business?.latitude,
        lng: data.business?.longitude,
        lang: data.business?.languages_spoken,
        acc: data.business?.accessibility_features,
        park: data.business?.parking_info,
        epark: data.business?.enhanced_parking_info,
        rev: data.business?.review_summary,
        stat: data.business?.status_override,
        faqs: data.business?.business_faqs,
        feat: data.business?.featured_items,
        social: data.business?.social_media,
        est: data.business?.established_year,
      },
      u: {
        t: data.update?.content_text,
        ca: data.update?.created_at,
        ea: data.update?.expires_at,
        sh: data.update?.special_hours_today,
        dt: data.update?.deal_terms,
        cat: data.update?.update_category,
        faqs: data.update?.update_faqs,
      },
      seo: data.seo,
      i: data.intent,
      f: data.faqs || [],
    };
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