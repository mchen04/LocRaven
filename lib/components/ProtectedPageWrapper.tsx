'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import './ProtectedPageWrapper.css';

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
      <div className="loading-screen">
        <div className="loading-container">
          {/* Branded Loading Animation */}
          <div className="loading-brand">
            <div className="loading-logo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <div className="loading-pulse"></div>
          </div>
          
          {/* Loading Content */}
          <div className="loading-content">
            <h2>Preparing your AI discovery dashboard</h2>
            <p>Setting up your business profile and AI optimization tools...</p>
          </div>
          
          {/* Progress Indication */}
          <div className="loading-progress">
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            <div className="loading-tips">
              <div className="tip active">💡 Your business will be discoverable by AI in under 60 seconds</div>
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