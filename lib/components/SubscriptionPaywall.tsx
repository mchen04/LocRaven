'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';



interface SubscriptionPaywallProps {
  userEmail: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

const SubscriptionPaywall: React.FC<SubscriptionPaywallProps> = ({ 
  userEmail, 
  onSuccess, 
  onCancel 
}) => {
  // Load Stripe pricing table script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/pricing-table.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Handle successful checkout completion (called by Stripe)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    if (sessionId) {
      // Pricing table redirected with session_id, indicating successful payment
      onSuccess();
    }
  }, [onSuccess]);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#212121',
        zIndex: 9999,
        overflow: 'auto'
      }}
    >
      {onCancel && (
        <button
          onClick={onCancel}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            color: '#9ca3af',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            zIndex: 10000
          }}
        >
          <X className="h-6 w-6" />
        </button>
      )}
      
      <div 
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}
      >
        <div style={{ width: '100%', maxWidth: '87.5rem' }}>
          {React.createElement('stripe-pricing-table', {
            'pricing-table-id': "prctbl_1S1ANTQs1kxAZUb8Mr0rvdrQ",
            'publishable-key': "pk_test_51RYkOaQs1kxAZUb8rNDdzJFYhW8MQIz5F128To8ykNpkNK6Ryd4vqwej6XkNCaVLW7rphT6kFFoBztJZ5Hm5sP1U00EG5UWo6I",
            'customer-email': userEmail
          })}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPaywall;