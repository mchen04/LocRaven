'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function SubscriptionSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your subscription...');

  const verifySubscription = useCallback(async (sessionId: string) => {
    try {
      const response = await fetch('/api/stripe/verify-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionId }),
      });

      if (response.ok) {
        const { verified } = await response.json();
        
        if (verified) {
          setStatus('success');
          setMessage('Subscription activated successfully! Redirecting to chat...');
          
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            window.location.href = '/chat';
          }, 2000);
        } else {
          setStatus('error');
          setMessage('Could not verify your subscription. Please contact support.');
        }
      } else {
        setStatus('error');
        setMessage('Verification failed. Please contact support.');
      }
    } catch (error) {
      console.error('Error verifying subscription:', error);
      setStatus('error');
      setMessage('An error occurred. Please contact support.');
    }
  }, []);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      setStatus('error');
      setMessage('Invalid session. Please try subscribing again.');
      return;
    }

    verifySubscription(sessionId);
  }, [searchParams, verifySubscription]);


  const handleRetry = () => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      setStatus('verifying');
      setMessage('Verifying your subscription...');
      verifySubscription(sessionId);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card text-center">
        {status === 'verifying' && (
          <>
            <RefreshCw className="h-12 w-12 text-indigo-500 animate-spin mx-auto mb-4" />
            <h2 className="auth-title">
              Verifying Subscription
            </h2>
            <p className="auth-subtitle">
              {message}
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="auth-title">
              Welcome to LocRaven!
            </h2>
            <p className="auth-subtitle">
              {message}
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="auth-title">
              Verification Failed
            </h2>
            <p className="auth-subtitle" style={{marginBottom: '2rem'}}>
              {message}
            </p>
            <div className="auth-actions">
              <button
                onClick={handleRetry}
                className="auth-button primary"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/login')}
                className="auth-button secondary"
              >
                Back to Login
              </button>
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
}