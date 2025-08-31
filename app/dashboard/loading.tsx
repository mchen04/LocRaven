import { Loading } from '@/lib/components/ui/atoms';
import { Card } from '@/lib/components/ui/atoms';
import { Container, Section } from '@/lib/components/ui/utils';

// Dashboard-specific loading UI
export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Loading header skeleton */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <Container>
          <div className="h-16 flex items-center justify-between">
            <Loading variant="skeleton" layout="inline" className="h-6 w-32" />
            <div className="flex space-x-2">
              <Loading variant="skeleton" layout="inline" className="h-8 w-20" />
              <Loading variant="skeleton" layout="inline" className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </Container>
      </div>

      {/* Loading content */}
      <Container className="py-8">
        <Section spacing="lg">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column skeleton */}
            <div className="lg:col-span-1">
              <Card padding="lg">
                <Loading variant="skeleton" layout="inline" className="h-6 w-24 mb-4" />
                <Loading variant="skeleton" layout="inline" className="h-4 w-full mb-2" />
                <Loading variant="skeleton" layout="inline" className="h-8 w-20 mt-4" />
              </Card>
            </div>

            {/* Right column skeleton */}
            <div className="lg:col-span-2">
              <Card padding="lg">
                <Loading variant="skeleton" layout="inline" className="h-6 w-32 mb-4" />
                <div className="space-y-3">
                  <Loading variant="skeleton" layout="inline" className="h-4 w-full" />
                  <Loading variant="skeleton" layout="inline" className="h-4 w-3/4" />
                  <Loading variant="skeleton" layout="inline" className="h-4 w-1/2" />
                </div>
              </Card>
            </div>
          </div>
        </Section>

        {/* Loading spinner overlay */}
        <Loading 
          size="md" 
          text="Loading your dashboard..." 
          layout="overlay" 
        />
      </Container>
    </div>
  );
}