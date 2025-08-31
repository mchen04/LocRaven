'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedPageWrapperProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedPageWrapper({ children, redirectTo }: ProtectedPageWrapperProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      const loginUrl = redirectTo || `/login?redirectedFrom=${encodeURIComponent(currentPath)}`;
      router.push(loginUrl);
    }
  }, [user, loading, router, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="max-w-md text-center space-y-8">
          {/* Branded Loading Animation */}
          <div className="relative">
            <div className="w-16 h-16 mx-auto text-indigo-600 animate-pulse">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
          
          {/* Loading Content */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Preparing your AI discovery dashboard</h2>
            <p className="text-gray-600">Setting up your business profile and AI optimization tools...</p>
          </div>
          
          {/* Progress Indication */}
          <div className="space-y-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full animate-pulse w-3/4"></div>
            </div>
            <div className="text-sm text-indigo-600 font-medium animate-pulse">
              💡 Your business will be discoverable by AI in under 60 seconds
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}