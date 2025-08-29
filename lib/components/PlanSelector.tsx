'use client';

import React, { useState, useEffect } from 'react';
import { Check, Crown, Zap, Shield } from 'lucide-react';
import type { SubscriptionPlan } from '@/types/subscription';

interface PlanSelectorProps {
  onPlanSelect: (planId: string, priceId: string) => void;
  currentPlanId?: string | null;
  loading?: boolean;
  showHeader?: boolean;
}

const PlanSelector: React.FC<PlanSelectorProps> = ({ 
  onPlanSelect, 
  currentPlanId,
  loading = false,
  showHeader = true
}) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [showAnnual, setShowAnnual] = useState(false);

  useEffect(() => {
    fetchSubscriptionPlans();
  }, []);

  const fetchSubscriptionPlans = async () => {
    try {
      const response = await fetch('/api/stripe/plans');
      const { plans: fetchedPlans } = await response.json();
      setPlans(fetchedPlans);
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
    } finally {
      setPlansLoading(false);
    }
  };

  const getPlanIcon = (planName: string) => {
    if (planName.includes('Basic')) return <Shield className="h-5 w-5" />;
    if (planName.includes('Professional')) return <Zap className="h-5 w-5" />;
    if (planName.includes('Enterprise')) return <Crown className="h-5 w-5" />;
    return <Check className="h-5 w-5" />;
  };

  const getDisplayPlans = () => {
    return plans.filter(plan => 
      showAnnual ? plan.interval === 'year' : plan.interval === 'month'
    );
  };

  const formatPrice = (price: number, interval: string) => {
    if (interval === 'year') {
      const monthlyEquivalent = price / 12;
      return (
        <div>
          <span className="text-2xl font-bold">${monthlyEquivalent.toFixed(0)}</span>
          <span className="text-gray-400">/month</span>
          <div className="text-xs text-gray-500">Billed ${price} annually</div>
        </div>
      );
    }
    return (
      <div>
        <span className="text-2xl font-bold">${price}</span>
        <span className="text-gray-400">/{interval}</span>
      </div>
    );
  };

  const isCurrentPlan = (planId: string) => {
    return currentPlanId === planId;
  };

  if (plansLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading plans...</p>
      </div>
    );
  }

  return (
    <div>
      {showHeader && (
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Subscription Plans
          </h3>
          <p className="text-gray-600 mb-6">
            Choose the plan that best fits your business needs
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`${!showAnnual ? 'text-indigo-600 font-semibold' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setShowAnnual(!showAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                showAnnual ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`${showAnnual ? 'text-indigo-600 font-semibold' : 'text-gray-500'}`}>
              Annual
              {showAnnual && (
                <span className="ml-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  Save 20%
                </span>
              )}
            </span>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {getDisplayPlans().map((plan) => {
          const isProfessional = plan.name.includes('Professional');
          const isCurrent = isCurrentPlan(plan.id);
          
          return (
            <div
              key={plan.id}
              className={`relative rounded-lg border-2 p-4 transition-all ${
                isCurrent
                  ? 'border-green-500 bg-green-50'
                  : isProfessional
                  ? 'border-indigo-200 bg-indigo-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {isProfessional && !isCurrent && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <span className="bg-indigo-600 text-white px-2 py-1 text-xs rounded-full">
                    Popular
                  </span>
                </div>
              )}

              {isCurrent && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-600 text-white px-2 py-1 text-xs rounded-full">
                    Current Plan
                  </span>
                </div>
              )}
              
              <div className="text-center mb-4">
                <div className={`inline-flex items-center justify-center p-2 rounded-lg mb-3 ${
                  isCurrent
                    ? 'bg-green-600 text-white'
                    : isProfessional 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {getPlanIcon(plan.name)}
                </div>
                
                <h4 className="text-lg font-bold text-gray-900 mb-1">
                  {plan.name.replace(' (Annual)', '')}
                </h4>
                
                <div className="mb-3">
                  {formatPrice(plan.price, plan.interval)}
                </div>
              </div>

              {/* Key Features */}
              <ul className="space-y-2 mb-4 text-sm">
                {plan.features.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
                {plan.features.length > 4 && (
                  <li className="text-gray-500 text-xs">
                    +{plan.features.length - 4} more features
                  </li>
                )}
              </ul>

              <button
                onClick={() => onPlanSelect(plan.id, plan.stripe_price_id)}
                disabled={loading || isCurrent}
                className={`w-full py-2 px-4 rounded-lg font-semibold text-sm transition-colors ${
                  isCurrent
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : isProfessional
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading 
                  ? 'Processing...' 
                  : isCurrent 
                  ? 'Current Plan'
                  : 'Select Plan'
                }
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlanSelector;