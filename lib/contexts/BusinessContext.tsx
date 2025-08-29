'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Business } from '../../types';
import { supabase } from '../utils/supabase';
import { generateInitialBusinessPage } from '../services/data/websiteGenerator';
import { useAuth } from './AuthContext';

interface BusinessContextType {
  business: Business | null;
  setBusiness: (business: Business | null) => void;
  createBusinessProfile: (data: Partial<Business>) => Promise<{ success: boolean; error?: string; data?: Business }>;
  updateBusinessProfile: (data: Partial<Business>) => Promise<{ success: boolean; error?: string; data?: Business }>;
  deleteBusinessProfile: () => Promise<{ success: boolean; error?: string }>;
  loadBusinessProfile: (userEmail: string) => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType>({} as BusinessContextType);

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};

interface BusinessProviderProps {
  children: React.ReactNode;
}

export const BusinessProvider: React.FC<BusinessProviderProps> = ({ children }) => {
  const [business, setBusiness] = useState<Business | null>(null);
  const { user } = useAuth();

  const loadBusinessProfile = useCallback(async (userEmail: string) => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('email', userEmail)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setBusiness(null);
          return;
        }
        throw error;
      }

      setBusiness(data);
    } catch (error) {
      console.error('Error loading business profile:', error);
      setBusiness(null);
    }
  }, []);

  // Auto-load business profile when user is authenticated
  useEffect(() => {
    if (user?.email) {
      loadBusinessProfile(user.email);
    } else {
      setBusiness(null);
    }
  }, [user?.email, loadBusinessProfile]);

  const createBusinessProfile = useCallback(async (data: Partial<Business>) => {
    try {
      const { data: result, error } = await supabase
        .from('businesses')
        .insert([data])
        .select()
        .single();

      if (error) throw error;

      setBusiness(result);

      // Generate initial business page
      try {
        await generateInitialBusinessPage(result);
      } catch (pageError) {
        console.warn('Page generation failed:', pageError);
      }

      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to create business profile' };
    }
  }, []);

  const updateBusinessProfile = useCallback(async (data: Partial<Business>) => {
    try {
      if (!business?.id) throw new Error('No business profile to update');

      const { data: result, error } = await supabase
        .from('businesses')
        .update(data)
        .eq('id', business.id)
        .select()
        .single();

      if (error) throw error;

      setBusiness(result);

      // Regenerate business page
      try {
        await generateInitialBusinessPage(result);
      } catch (pageError) {
        console.warn('Page regeneration failed:', pageError);
      }

      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update business profile' };
    }
  }, [business?.id]);

  const deleteBusinessProfile = useCallback(async () => {
    try {
      if (!business?.id) throw new Error('No business profile to delete');

      // Delete related data first
      await supabase.from('updates').delete().eq('business_id', business.id);
      await supabase.from('generated_pages').delete().eq('business_id', business.id);
      await supabase.from('business_events').delete().eq('business_id', business.id);

      // Delete business profile
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', business.id);

      if (error) throw error;

      setBusiness(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to delete business profile' };
    }
  }, [business?.id]);

  const value = useMemo(() => ({
    business,
    setBusiness,
    createBusinessProfile,
    updateBusinessProfile,
    deleteBusinessProfile,
    loadBusinessProfile
  }), [business, createBusinessProfile, updateBusinessProfile, deleteBusinessProfile, loadBusinessProfile]);

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
};

export default BusinessProvider;