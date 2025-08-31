'use client';

import { PagesList } from '@/components/dashboard/pages-list';

export default function LinksPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Links</h1>
        <p className="text-muted-foreground">
          Manage your active and expired AI-discoverable pages.
        </p>
      </div>

      {/* Pages list */}
      <PagesList />
    </div>
  );
}