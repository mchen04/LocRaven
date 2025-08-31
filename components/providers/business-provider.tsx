'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Business } from '../../types';
import { supabase } from '../../lib/utils/supabase';
import { generateInitialBusinessPage } from '../../lib/services/data/websiteGenerator';
import { useAuth } from './auth-provider';

// React 19 Context interface as specified in REBUILD_TODO.md
interface BusinessContextType {
  business: Business | null;
  updateBusiness: (data: BusinessData) => Promise<void>;
  loading: boolean;
  error: string | null;
  createBusinessProfile: (data: Partial<Business>) => Promise<{ success: boolean; error?: string; data?: Business }>;
  deleteBusinessProfile: () => Promise<{ success: boolean; error?: string }>;
}

// Business data type for updates
type BusinessData = Partial<Business>;

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadBusinessProfile = useCallback(async (userEmail: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('email', userEmail)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No business profile found
          setBusiness(null);
          return;
        }
        throw error;
      }

      setBusiness(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load business profile';
      console.error('BusinessProvider: Error loading business profile:', error);
      setError(errorMessage);
      setBusiness(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-load business profile when user is authenticated
  useEffect(() => {
    if (user?.email) {
      loadBusinessProfile(user.email);
    } else {
      setBusiness(null);
      setError(null);
    }
  }, [user?.email, loadBusinessProfile]);

  const updateBusiness = useCallback(async (data: BusinessData) => {
    try {
      setLoading(true);
      setError(null);

      if (!business?.id) {
        throw new Error('No business profile to update');
      }

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
        console.warn('BusinessProvider: Page regeneration failed:', pageError);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update business profile';
      console.error('BusinessProvider: Error updating business:', error);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [business?.id]);

  const createBusinessProfile = useCallback(async (data: Partial<Business>) => {
    try {
      setLoading(true);
      setError(null);

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
        console.warn('BusinessProvider: Page generation failed:', pageError);
      }

      return { success: true, data: result };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create business profile';
      console.error('BusinessProvider: Error creating business:', error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBusinessProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!business?.id) {
        throw new Error('No business profile to delete');
      }

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
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete business profile';
      console.error('BusinessProvider: Error deleting business:', error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [business?.id]);

  const value = useMemo(() => ({
    business,
    updateBusiness,
    loading,
    error,
    createBusinessProfile,
    deleteBusinessProfile
  }), [business, updateBusiness, loading, error, createBusinessProfile, deleteBusinessProfile]);

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
};