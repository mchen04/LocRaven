'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  ExternalLink,
  RefreshCw,
  AlertTriangle
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'trialing':
        return 'text-blue-600';
      case 'past_due':
        return 'text-yellow-600';
      case 'canceled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'trialing':
        return <Calendar className="h-5 w-5 text-blue-600" />;
      case 'past_due':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'canceled':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
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

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'active':
        return 'Your subscription is active and in good standing.';
      case 'trialing':
        return 'You are currently in your free trial period.';
      case 'past_due':
        return 'Your subscription has a past due payment. Please update your payment method.';
      case 'canceled':
        return 'Your subscription has been canceled. You can reactivate it anytime.';
      case 'none':
        return 'You do not have an active subscription.';
      default:
        return 'Unable to determine subscription status.';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-indigo-600" />
          <span className="ml-2 text-gray-600">Loading subscription details...</span>
        </div>
      </div>
    );
  }

  if (!subscriptionStatus) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Unable to Load Subscription
          </h3>
          <p className="text-gray-600 mb-4">
            We couldn&apos;t retrieve your subscription information.
          </p>
          <button
            onClick={fetchSubscriptionStatus}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Billing & Subscription</h3>
        <p className="text-gray-600 mt-1">Manage your subscription and billing information</p>
      </div>

      {/* Current Status */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900">Current Status</h4>
          <div className="flex items-center">
            {getStatusIcon(subscriptionStatus.subscription_status)}
            <span className={`ml-2 font-medium capitalize ${getStatusColor(subscriptionStatus.subscription_status)}`}>
              {subscriptionStatus.subscription_status === 'none' ? 'No Subscription' : subscriptionStatus.subscription_status}
            </span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-3">
          {getStatusMessage(subscriptionStatus.subscription_status)}
        </p>

        {subscriptionStatus.has_active_subscription && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {subscriptionStatus.plan_name && (
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Current Plan
                </label>
                <p className="text-gray-900 font-semibold">
                  {subscriptionStatus.plan_name}
                </p>
              </div>
            )}
            
            {subscriptionStatus.current_period_end && (
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Next Billing Date
                </label>
                <p className="text-gray-900 font-semibold">
                  {formatDate(subscriptionStatus.current_period_end)}
                </p>
              </div>
            )}
            
            {subscriptionStatus.trial_end && subscriptionStatus.subscription_status === 'trialing' && (
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Trial Ends
                </label>
                <p className="text-gray-900 font-semibold">
                  {formatDate(subscriptionStatus.trial_end)}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {subscriptionStatus.has_active_subscription ? (
          <button
            onClick={handleManageBilling}
            disabled={actionLoading}
            className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            {actionLoading ? 'Opening...' : 'Manage Billing'}
            <ExternalLink className="h-4 w-4 ml-2" />
          </button>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">
              Subscribe to unlock all LocRaven features and start your free trial.
            </p>
            <button
              onClick={() => {
                // Redirect to subscription signup
                window.location.href = '/login';
              }}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Choose a Plan
            </button>
          </div>
        )}

        <button
          onClick={fetchSubscriptionStatus}
          disabled={loading}
          className="w-full flex items-center justify-center px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Status
        </button>
      </div>

      {/* Help Text */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Need help? Contact our support team or visit our documentation for more information 
          about billing and subscription management.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionManager;