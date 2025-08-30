'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { SubscriptionStatusResponse } from '@/types/subscription';

// SubscriptionManagerProps is empty but kept for future extensibility
interface SubscriptionManagerProps {} // eslint-disable-line @typescript-eslint/no-empty-object-type

const SubscriptionManager: React.FC<SubscriptionManagerProps> = () => {
  const { user } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (user?.email) {
      fetchSubscriptionStatus();
    }
  }, [user]);

  const fetchSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stripe/subscription-status');
      if (response.ok) {
        const { status } = await response.json();
        setSubscriptionStatus(status);
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    if (actionLoading) return;

    setActionLoading(true);
    try {
      const response = await fetch('/api/stripe/customer-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          return_url: window.location.href,
        }),
      });

      if (response.ok) {
        const { portal_url } = await response.json();
        window.open(portal_url, '_blank');
      } else {
        throw new Error('Failed to create billing portal session');
      }
    } catch (error) {
      console.error('Error opening billing portal:', error);
      alert('Failed to open billing portal. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'trialing':
        return <Calendar className="h-4 w-4 text-blue-600" />;
      case 'past_due':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'canceled':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };


  // Loading state
  if (loading) {
    return (
      <div className="settings-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <RefreshCw className="h-5 w-5 animate-spin" style={{ color: '#ececec' }} />
            <span style={{ fontSize: 'var(--text-sm)', color: '#8e8e8e' }}>Loading subscription details...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (!subscriptionStatus) {
    return (
      <div className="settings-section">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle className="h-6 w-6" style={{ color: '#ef4444' }} />
            <div>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: '#ececec', margin: '0 0 0.5rem 0' }}>
                Unable to Load Subscription
              </h4>
              <p style={{ fontSize: 'var(--text-sm)', color: '#8e8e8e', margin: 0 }}>
                We couldn&apos;t retrieve your subscription information.
              </p>
            </div>
            <button
              onClick={fetchSubscriptionStatus}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-medium)',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Current Status Section */}
      <div className="settings-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3>Current Status</h3>
          <button
            onClick={fetchSubscriptionStatus}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.375rem 0.75rem',
              background: 'transparent',
              border: '1px solid rgba(142, 142, 142, 0.3)',
              borderRadius: '0.375rem',
              color: '#8e8e8e',
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#ececec';
              e.currentTarget.style.borderColor = 'rgba(236, 236, 236, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#8e8e8e';
              e.currentTarget.style.borderColor = 'rgba(142, 142, 142, 0.3)';
            }}
          >
            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="settings-info">
          <label>Plan</label>
          <span>{subscriptionStatus?.has_active_subscription ? subscriptionStatus.plan_name || 'Active Plan' : 'No Active Plan'}</span>
        </div>

        <div className="settings-info">
          <label>Status</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {getStatusIcon(subscriptionStatus?.subscription_status || 'none')}
            <span style={{ 
              color: subscriptionStatus?.subscription_status === 'active' ? '#10b981' : 
                     subscriptionStatus?.subscription_status === 'trialing' ? '#3b82f6' :
                     subscriptionStatus?.subscription_status === 'past_due' ? '#f59e0b' : '#ef4444'
            }}>
              {subscriptionStatus?.subscription_status === 'none' ? 'No Subscription' : 
               subscriptionStatus?.subscription_status?.charAt(0).toUpperCase() + subscriptionStatus?.subscription_status?.slice(1)}
            </span>
          </div>
        </div>

        {subscriptionStatus?.has_active_subscription && subscriptionStatus.current_period_end && (
          <div className="settings-info">
            <label>Next Billing</label>
            <span>{formatDate(subscriptionStatus.current_period_end)}</span>
          </div>
        )}

        {subscriptionStatus?.trial_end && subscriptionStatus.subscription_status === 'trialing' && (
          <div className="settings-info">
            <label>Trial Ends</label>
            <span style={{ color: '#3b82f6' }}>{formatDate(subscriptionStatus.trial_end)}</span>
          </div>
        )}
      </div>

      {/* Billing Management Section */}
      <div className="settings-section">
        <h3>Billing Management</h3>
        
        <div style={{ 
          border: '1px solid rgba(142, 142, 142, 0.3)', 
          borderRadius: '0.5rem', 
          padding: '1rem',
          background: 'rgba(59, 130, 246, 0.05)',
          marginBottom: '0.75rem'
        }}>
          <p style={{ fontSize: 'var(--text-sm)', color: '#8e8e8e', lineHeight: '1.5', margin: 0 }}>
            {subscriptionStatus?.has_active_subscription 
              ? 'Manage your subscription, change plans, update billing details, view invoices, and cancel subscription through Stripe\'s secure portal.'
              : 'Subscribe to unlock all LocRaven features and start your free trial.'
            }
          </p>
        </div>

        {subscriptionStatus?.has_active_subscription ? (
          <button
            onClick={handleManageBilling}
            disabled={actionLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              width: '100%',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              cursor: actionLoading ? 'not-allowed' : 'pointer',
              opacity: actionLoading ? 0.5 : 1,
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => !actionLoading && (e.currentTarget.style.backgroundColor = '#2563eb')}
            onMouseOut={(e) => !actionLoading && (e.currentTarget.style.backgroundColor = '#3b82f6')}
          >
            <CreditCard className="h-4 w-4" />
            {actionLoading ? 'Opening Portal...' : 'Manage Subscription & Billing'}
            <ExternalLink className="h-3 w-3" />
          </button>
        ) : (
          <button
            onClick={() => window.location.href = '/login'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              width: '100%',
              background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, #2563eb, #7c3aed)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, #3b82f6, #8b5cf6)';
            }}
          >
            <Zap className="h-4 w-4" />
            Choose Your Plan
            <ArrowRight className="h-4 w-4" />
          </button>
        )}

        <div style={{ 
          marginTop: '0.75rem',
          padding: '0.75rem',
          background: 'rgba(142, 142, 142, 0.05)',
          border: '1px solid rgba(142, 142, 142, 0.1)',
          borderRadius: '0.375rem'
        }}>
          <p style={{ fontSize: 'var(--text-sm)', color: '#8e8e8e', margin: 0, textAlign: 'center' }}>
            <strong style={{ color: '#ececec' }}>Stripe Customer Portal</strong> handles all subscription management including plan changes, cancellations, payment methods, and billing history.
          </p>
        </div>
      </div>
    </>
  );
};

export default SubscriptionManager;