'use server';

import { revalidatePath } from 'next/cache';

import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';
import { TablesInsert, TablesUpdate } from '@/libs/supabase/types';

export type BusinessProfileInsert = TablesInsert<'businesses'>;
export type BusinessProfileUpdate = TablesUpdate<'businesses'>;

export interface UpsertBusinessProfileData {
  name: string;
  description?: string | null;
  website?: string | null;
  phone?: string | null;
  phone_country_code?: string | null;
  address_street?: string | null;
  address_city?: string | null;
  address_state?: string | null;
  zip_code?: string | null;
  country?: string | null;
  primary_category?: string | null;
  established_year?: number | null;
  hours?: string | null;
  parking_info?: string | null;
  price_positioning?: string | null;
  service_area?: string | null;
  specialties?: string[] | null;
  services?: string[] | null;
  payment_methods?: string[] | null;
  languages_spoken?: string[] | null;
  accessibility_features?: string[] | null;
  static_tags?: string[] | null;
  social_media?: Record<string, string> | null;
  business_faqs?: Array<{ question: string; answer: string }> | null;
}

export async function upsertBusinessProfile(data: UpsertBusinessProfileData) {
  try {
    const supabase = await createSupabaseServerClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('Authentication required');
    }

    if (!user.email) {
      throw new Error('User email not found');
    }

    // Check if business already exists
    const { data: existingBusiness } = await supabase
      .from('businesses')
      .select('id')
      .eq('email', user.email)
      .single();

    const profileData = {
      name: data.name,
      description: data.description,
      website: data.website,
      phone: data.phone,
      phone_country_code: data.phone_country_code,
      address_street: data.address_street,
      address_city: data.address_city,
      address_state: data.address_state,
      zip_code: data.zip_code,
      country: data.country,
      primary_category: data.primary_category as any,
      established_year: data.established_year,
      hours: data.hours,
      parking_info: data.parking_info,
      price_positioning: data.price_positioning,
      service_area: data.service_area,
      specialties: data.specialties,
      services: data.services,
      payment_methods: data.payment_methods,
      languages_spoken: data.languages_spoken,
      accessibility_features: data.accessibility_features,
      static_tags: data.static_tags as any,
      social_media: data.social_media,
      business_faqs: data.business_faqs,
      email: user.email,
      updated_at: new Date().toISOString(),
    };

    if (existingBusiness) {
      // Update existing business
      const { data: updatedBusiness, error } = await supabase
        .from('businesses')
        .update(profileData)
        .eq('id', existingBusiness.id)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating business profile:', error);
        throw new Error('Failed to update business profile');
      }

      revalidatePath('/dashboard');
      return { success: true, data: updatedBusiness };
    } else {
      // Create new business
      const { data: newBusiness, error } = await supabase
        .from('businesses')
        .insert(profileData)
        .select('*')
        .single();

      if (error) {
        console.error('Error creating business profile:', error);
        throw new Error('Failed to create business profile');
      }

      revalidatePath('/dashboard');
      return { success: true, data: newBusiness };
    }
  } catch (error) {
    console.error('Upsert business profile error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to save business profile' 
    };
  }
}