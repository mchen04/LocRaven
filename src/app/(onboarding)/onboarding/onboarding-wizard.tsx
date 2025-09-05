'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { BusinessProfileTab } from '@/app/(dashboard)/dashboard/tabs/business-profile-tab';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { BusinessProfile } from '@/features/business/types/business-types';

import { completeOnboarding } from './actions';

interface OnboardingWizardProps {
  initialData?: BusinessProfile | null;
  userEmail: string;
}

export function OnboardingWizard({ initialData, userEmail }: OnboardingWizardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isCompleting, setIsCompleting] = useState(false);

  async function handleCompleteOnboarding() {
    setIsCompleting(true);
    
    try {
      const result = await completeOnboarding(userEmail);
      
      if (result.success) {
        toast({
          title: 'Onboarding Complete!',
          description: result.permanentPageUrl ? 
            `Your business page is live at: ${result.permanentPageUrl}` :
            'Your business profile has been saved successfully.',
        });
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'Failed to complete onboarding. Please try again.',
        });
      }
    } catch (error) {
      console.error('Onboarding completion error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsCompleting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Onboarding-specific header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Tell us about your business</h2>
        <p className="text-gray-400 text-sm">
          This information will be used to create your permanent business page
        </p>
      </div>

      {/* Reuse existing BusinessProfileTab component */}
      <div className="bg-black rounded-lg p-6">
        <BusinessProfileTab initialData={initialData} />
      </div>

      {/* Onboarding-specific actions */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-800">
        <p className="text-sm text-gray-400">
          After saving your profile, we&apos;ll generate your permanent business page
        </p>
        
        <Button
          onClick={handleCompleteOnboarding}
          disabled={isCompleting}
          className="bg-cyan-500 hover:bg-cyan-400 text-black"
        >
          {isCompleting ? 'Setting up your page...' : 'Complete Setup'}
        </Button>
      </div>
    </div>
  );
}