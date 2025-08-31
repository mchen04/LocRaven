'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '../../lib/utils/supabase/client';
import { getAppUrl } from '../../lib/utils/config';

// React 19 Context interface as specified in REBUILD_TODO.md
interface AuthContextType {
  user: User | null;
  signOut: () => Promise<void>;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Create Supabase client once and memoize it
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      
      setUser(session?.user ?? null);
      setError(null);
      setLoading(false);
    });

    // Listen for auth changes - critical for OAuth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setError(null); // Clear error on any auth state change
      
      if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      } else if (event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null);
      } else if (event === 'INITIAL_SESSION') {
        setUser(session?.user ?? null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signInWithGoogle = useCallback(async () => {
    try {
      setError(null);
      const redirectUrl = getAppUrl('/auth/callback');
      
      // OAuth redirect URL construction for development debugging
      if (process.env.NODE_ENV === 'development') {
        console.debug('OAuth redirect URL:', redirectUrl);
      }
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error('AuthProvider: OAuth error:', error);
        setError(error.message);
        throw new Error(`OAuth authentication failed: ${error.message}`);
      }
    } catch (urlError) {
      const errorMessage = urlError instanceof Error ? urlError.message : 'Authentication failed';
      console.error('AuthProvider: Error during Google sign in:', urlError);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [supabase]);

  const signOut = useCallback(async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('AuthProvider: Sign out error:', error);
        setError(error.message);
        throw new Error(`Sign out failed: ${error.message}`);
      }
      
      setUser(null);
    } catch (signOutError) {
      const errorMessage = signOutError instanceof Error ? signOutError.message : 'Sign out failed';
      console.error('AuthProvider: Error during sign out:', signOutError);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [supabase]);

  const value = useMemo(() => ({
    user,
    signOut,
    loading,
    error,
    signInWithGoogle
  }), [user, signOut, loading, error, signInWithGoogle]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};