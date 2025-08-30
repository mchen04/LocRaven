import LoadingScreen from '@/lib/components/ui/templates/LoadingScreen';
import { SkeletonHeader, SkeletonCard } from '@/lib/components/ui/molecules';

// Dashboard-specific loading UI
export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Loading header skeleton */}
      <SkeletonHeader showNav={false} showActions={true} />

      {/* Loading content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column skeleton */}
          <div className="lg:col-span-1">
            <SkeletonCard lines={1} showHeader={true} showButton={true} />
          </div>

          {/* Right column skeleton */}
          <div className="lg:col-span-2">
            <SkeletonCard lines={3} showHeader={true} showButton={false} />
          </div>
        </div>

        {/* Loading spinner overlay */}
        <LoadingScreen 
          size="md" 
          text="Loading your dashboard..." 
          variant="overlay" 
        />
      </div>
    </div>
  );
}