'use client';

import { UpdateForm } from '@/components/dashboard/update-form';
import { StatsCards } from '@/components/dashboard/stats-cards';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create Update</h1>
        <p className="text-muted-foreground">
          Share what&apos;s new with your business and get discovered by AI assistants.
        </p>
      </div>

      {/* Stats cards */}
      <StatsCards />

      {/* Update form */}
      <UpdateForm />
    </div>
  );
}