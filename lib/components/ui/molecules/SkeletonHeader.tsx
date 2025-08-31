
import Skeleton from '../atoms/Skeleton';

interface SkeletonHeaderProps {
  showNav?: boolean;
  showActions?: boolean;
  className?: string;
}

const SkeletonHeader: React.FC<SkeletonHeaderProps> = ({
  showNav = true,
  showActions = true,
  className = ''
}) => {
  return (
    <div className={`sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 animate-pulse">
          {/* Logo/Brand skeleton */}
          <Skeleton width="8rem" height="2rem" />
          
          {/* Navigation skeleton */}
          {showNav && (
            <div className="hidden md:flex items-center space-x-6">
              <Skeleton width="4rem" height="1rem" />
              <Skeleton width="5rem" height="1rem" />
              <Skeleton width="3rem" height="1rem" />
            </div>
          )}
          
          {/* Actions skeleton */}
          {showActions && (
            <div className="flex items-center space-x-4">
              <Skeleton width="6rem" height="2rem" />
              <Skeleton width="5rem" height="2rem" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkeletonHeader;