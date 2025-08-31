'use client';

import { BusinessProfileForm } from '@/components/dashboard/business-profile-form';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Business Profile</h1>
        <p className="text-muted-foreground">
          Complete your business profile to improve AI discoverability and generate better content.
        </p>
      </div>

      {/* Profile form */}
      <BusinessProfileForm />
    </div>
  );
}