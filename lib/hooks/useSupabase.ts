'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../utils/supabase';
import { GeneratedPage, Update } from '../../types';
import { useAuth } from '../contexts/AuthContext';
import { useBusiness } from '../contexts/BusinessContext';
import { isPageExpired } from "../services/data/expirationService";
import { config } from '../utils/config';

export const usePages = () => {
  const [pages, setPages] = useState<GeneratedPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { business } = useBusiness();

  // Memoize derived state to prevent unnecessary recalculations
  const { activePages, expiredPages } = useMemo(() => ({
    activePages: pages.filter(page => !page.expired && !isPageExpired(page.expires_at || null)),
    expiredPages: pages.filter(page => page.expired || isPageExpired(page.expires_at || null))
  }), [pages]);

  const loadPages = useCallback(async () => {
    try {
      setLoading(true);
      
      // If we have a business, get pages from generated_pages
      if (business?.id) {
        const { data, error } = await supabase
          .from('generated_pages')
          .select('*')
          .eq('business_id', business.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Map to match expected format with URLs - removed 'any' type
        const mappedPages = (data || []).map((page): GeneratedPage => ({
          ...page,
          business_name: business.name,
          url: `${config.env.appUrl}${page.file_path}`,
          active: true
        }));

        setPages(mappedPages);
      } else {
        setPages([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [business?.id, business?.name]);

  const deletePage = async (pageId: string) => {
    try {
      // Try deleting from generated_pages first
      const { error: genError } = await supabase
        .from('generated_pages')
        .delete()
        .eq('id', pageId);

      if (genError) {
        throw genError;
      }

      setPages(pages.filter(p => p.id !== pageId));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    if (user) {
      loadPages();
    }
  }, [user?.id, business?.id]);

  // Optimized: Only check expiring pages when needed, less frequent polling
  useEffect(() => {
    if (!business?.id || pages.length === 0) return;

    // Check if any pages expire within the next 30 minutes (reduced from 2 hours)
    const hasExpiringPages = pages.some(page => 
      page.expires_at && 
      new Date(page.expires_at).getTime() - Date.now() < 30 * 60 * 1000
    );

    if (!hasExpiringPages) return;

    // Reduced polling frequency from 30s to 5 minutes for better performance
    const intervalId = setInterval(loadPages, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [pages.length, business?.id, loadPages]);

  // Subscribe to real-time changes
  useEffect(() => {
    if (!business?.id) return;

    const subscription = supabase
      .channel('generated_pages_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'generated_pages',
          filter: `business_id=eq.${business.id}`
        },
        () => {
          loadPages();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [business?.id]);

  return { 
    pages, 
    activePages, 
    expiredPages, 
    loading, 
    error, 
    refreshPages: loadPages,
    deletePage 
  };
};

export const useUpdates = () => {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { business } = useBusiness();

  const loadUpdates = useCallback(async () => {
    if (!business?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('updates')
        .select('*')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUpdates(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load updates');
    } finally {
      setLoading(false);
    }
  }, [business?.id]);

  const createUpdate = useCallback(async (contentText: string) => {
    if (!business?.id) {
      return { success: false, error: 'No business profile' };
    }

    try {
      const { data: update, error: updateError } = await supabase
        .from('updates')
        .insert({
          business_id: business.id,
          content_text: contentText,
          status: 'pending' as const
        })
        .select()
        .single();

      if (updateError) throw updateError;

      const { data: result, error: processError } = await supabase.functions
        .invoke('process-update-with-template', {
          body: {
            updateId: update.id,
            businessId: business.id,
            contentText: contentText
          }
        });

      if (processError) throw processError;

      await loadUpdates();
      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Failed to create update' };
    }
  }, [business?.id, loadUpdates]);

  useEffect(() => {
    loadUpdates();
  }, [loadUpdates]);

  return { updates, loading, error, refreshUpdates: loadUpdates, createUpdate };
};

export const useStats = (pages: GeneratedPage[], updates: Update[]) => {
  // Memoize stats calculation to prevent unnecessary recalculations
  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const updatesToday = updates.filter(update => 
      new Date(update.created_at || '').toDateString() === today
    ).length;

    const activePages = pages.filter(page => 
      new Date(page.created_at || '') > sevenDaysAgo
    ).length;

    return {
      totalPages: pages.length,
      updatesToday,
      activePages
    };
  }, [pages, updates]);

  return stats;
};