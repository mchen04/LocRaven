'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '../../../utils/supabase';
import SubscriptionPaywall from '../../SubscriptionPaywall';

const AuthCallback: React.FC = () => {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);
  const [showPaywall, setShowPaywall] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Helper function to check subscription status
  const checkSubscriptionStatus = async () => {
    try {
      const response = await fetch('/api/stripe/subscription-status');
      if (response.ok) {
        const { status } = await response.json();
        return status;
      }
      return null;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return null;
    }
  };

  const handlePaywallSuccess = () => {
    setShowPaywall(false);
    router.push('/chat');
  };

  const handlePaywallCancel = () => {
    // User canceled subscription - log them out
    const supabase = createBrowserClient();
    supabase.auth.signOut();
    router.push('/login');
  };

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        
        // Check if we have an OAuth error
        const urlParams = new URLSearchParams(window.location.search);
        // Auth code handled by Supabase auth flow automatically
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');
        
        
        if (error) {
          console.error('AuthCallback: OAuth error received:', error, errorDescription);
          router.push('/login');
          return;
        }
        
        // Use proven dual-check pattern from community solutions
        let redirected = false;
        
        // Strategy 1: Check for existing session immediately (handles case where session is already established)
        const supabase = createBrowserClient();
        const { data: { session: immediateSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (immediateSession && !sessionError && !redirected) {
          redirected = true;
          
          // Check subscription status before redirecting
          const subscriptionStatus = await checkSubscriptionStatus();
          
          if (subscriptionStatus?.has_active_subscription) {
            // User has active subscription, redirect to chat
            console.log('🔍 AuthCallback Debug - User has active subscription, redirecting to chat');
            router.push('/chat');
          } else {
            // User needs subscription, show paywall
            console.log('🔍 AuthCallback Debug - User needs subscription, showing paywall');
            setUserEmail(immediateSession.user.email!);
            setShowPaywall(true);
            setIsProcessing(false);
          }
          return;
        }
        
        // Strategy 2: Listen for auth state changes (handles case where session establishes after listener setup)
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
          
          if (redirected) return; // Prevent multiple redirects
          
          if (event === 'SIGNED_IN' && session) {
            redirected = true;
            authListener.subscription.unsubscribe();
            
            // Check subscription status before redirecting
            const subscriptionStatus = await checkSubscriptionStatus();
            
            if (subscriptionStatus?.has_active_subscription) {
              // User has active subscription, redirect to chat
              console.log('🔍 AuthCallback Debug - User has active subscription, redirecting to chat');
              router.push('/chat');
            } else {
              // User needs subscription, show paywall
              console.log('🔍 AuthCallback Debug - User needs subscription, showing paywall');
              setUserEmail(session.user.email!);
              setShowPaywall(true);
              setIsProcessing(false);
            }
          }
        });
        
        // Fallback timeout - if no session after reasonable time, redirect to login
        setTimeout(() => {
          if (!redirected) {
            redirected = true;
            authListener.subscription.unsubscribe();
            router.push('/login');
          }
        }, 8000); // Increased timeout for OAuth processing
        
      } catch (error) {
        console.error('AuthCallback: Error during processing:', error);
        router.push('/login');
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [router]);

  // Show subscription paywall if needed
  if (showPaywall && userEmail) {
    return (
      <SubscriptionPaywall
        userEmail={userEmail}
        onSuccess={handlePaywallSuccess}
        onCancel={handlePaywallCancel}
      />
    );
  }

  // Show loading state during authentication
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#212121'
    }}>
      <div style={{
        background: '#2a2a2a',
        padding: '2rem',
        borderRadius: '0.5rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h2 style={{ color: '#ececec', marginBottom: '1rem' }}>
          {isProcessing ? 'Processing Sign In...' : 'Completing Sign In...'}
        </h2>
        <p style={{ color: '#8e8e8e', fontSize: '0.875rem' }}>
          Please wait while we authenticate your account and redirect you to the dashboard.
        </p>
        
        {/* Loading spinner */}
        <div style={{
          marginTop: '1.5rem',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            border: '2px solid #8e8e8e',
            borderTop: '2px solid #6366f1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
        
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default AuthCallback;