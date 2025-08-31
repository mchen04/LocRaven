'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';
import { getLandingUrl } from '../../../utils/config';

const Login: React.FC = () => {
  const router = useRouter();
  const { signInWithGoogle, user } = useAuth();

  useEffect(() => {
    // If user is already logged in, redirect to chat
    if (user) {
      router.push('/chat');
    }
  }, [user, router]);

  const handleGoogleSignIn = () => {
    // Simple sign in - Supabase handles everything
    signInWithGoogle();
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          {/* Professional Header */}
          <div className="auth-header">
            <div className="brand-logo">
              <div className="logo-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <div className="brand-text">
                <h1>LocRaven</h1>
                <p>AI-Discoverable Business Updates</p>
              </div>
            </div>
          </div>

          {/* Welcome Section */}
          <div className="auth-welcome">
            <h2>Welcome back</h2>
            <p>Sign in to your account to start getting discovered by AI</p>
          </div>

          {/* Auth Methods */}
          <div className="auth-methods">
            <button
              onClick={handleGoogleSignIn}
              className="auth-button primary"
            >
              <svg className="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Benefits */}
          <div className="auth-benefits">
            <div className="benefit">
              <svg className="benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
              <span>Get discovered in 60 seconds</span>
            </div>
            <div className="benefit">
              <svg className="benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4"/>
                <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
              </svg>
              <span>14-day free trial</span>
            </div>
            <div className="benefit">
              <svg className="benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <circle cx="12" cy="16" r="1"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span>Cancel anytime</span>
            </div>
          </div>

          {/* Footer */}
          <div className="auth-footer">
            <button 
              onClick={() => window.location.href = getLandingUrl()}
              className="back-link"
            >
              ← Back to Home
            </button>
            <div className="auth-links">
              <Link href={"/privacy" as any} className="footer-link">Privacy</Link>
              <Link href={"/terms" as any} className="footer-link">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;