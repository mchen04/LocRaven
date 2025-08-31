'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';
import { getLandingUrl } from '../../../utils/config';
import Button from '../../ui/atoms/Button';
import Card from '../../ui/atoms/Card';
import { cn } from '../../../utils/cn';
import { themeClasses, themeClass } from '../../../theme/utils';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card variant="elevated" padding="lg" className="bg-white dark:bg-dark-card">
          {/* Professional Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <div className="text-left">
                <h1 className={cn(themeClasses.heading(), 'text-2xl')}>LocRaven</h1>
                <p className={cn('text-sm', themeClass('text-muted'))}>AI-Discoverable Business Updates</p>
              </div>
            </div>
          </div>

          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h2 className={cn(themeClasses.heading(), 'text-xl mb-2')}>Welcome back</h2>
            <p className={themeClass('text-muted')}>Sign in to your account to start getting discovered by AI</p>
          </div>

          {/* Auth Methods */}
          <div className="mb-8">
            <Button
              onClick={handleGoogleSignIn}
              variant="primary"
              size="lg"
              fullWidth
              className="gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
          </div>

          {/* Benefits */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <span className={themeClass('text-default')}>Get discovered in 60 seconds</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4"/>
                  <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                  <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                </svg>
              </div>
              <span className={themeClass('text-default')}>14-day free trial</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <circle cx="12" cy="16" r="1"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <span className={themeClass('text-default')}>Cancel anytime</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button 
              variant="ghost"
              onClick={() => window.location.href = getLandingUrl()}
              className="mb-4 sm:mb-0"
            >
              ← Back to Home
            </Button>
            <div className="flex items-center gap-4">
              <Link href={"/privacy" as any} className={cn('text-sm hover:underline', themeClass('text-muted'))}>
                Privacy
              </Link>
              <Link href={"/terms" as any} className={cn('text-sm hover:underline', themeClass('text-muted'))}>
                Terms
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;