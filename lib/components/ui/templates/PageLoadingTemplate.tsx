
import { Card, Loading } from '../atoms';

interface PageLoadingTemplateProps {
  title?: string;
  message?: string;
  showSkeleton?: boolean;
}

export const PageLoadingTemplate: React.FC<PageLoadingTemplateProps> = ({
  title = 'Loading...',
  message = 'Please wait while we load your content.',
  showSkeleton = false
}) => {
  if (showSkeleton) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header skeleton */}
        <Loading variant="skeleton" layout="inline" className="w-full mb-6" />
        
        {/* Content skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} padding="md">
              <Loading variant="skeleton" layout="inline" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="text-center" padding="lg">
        <Loading size="lg" layout="centered" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 mt-4">
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {message}
        </p>
      </Card>
    </div>
  );
};

export default PageLoadingTemplate;