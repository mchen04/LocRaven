'use client';

import nextDynamic from 'next/dynamic';
import { Suspense } from 'react';
import ProtectedPageWrapper from '../ProtectedPageWrapper';
import LoadingScreen from '../ui/templates/LoadingScreen';

interface ProtectedDynamicPageProps {
  importPath: () => Promise<{ default: React.ComponentType<any> }>;
  loadingText?: string;
  fallbackText?: string;
  ssr?: boolean;
}

const ProtectedDynamicPage: React.FC<ProtectedDynamicPageProps> = ({
  importPath,
  loadingText = 'Loading...',
  fallbackText = 'Loading...',
  ssr = false
}) => {
  // Dynamically import component with code splitting
  const DynamicComponent = nextDynamic(importPath, {
    loading: () => <LoadingScreen text={loadingText} />,
    ssr
  });

  return (
    <ProtectedPageWrapper>
      <Suspense fallback={<LoadingScreen text={fallbackText} />}>
        <DynamicComponent />
      </Suspense>
    </ProtectedPageWrapper>
  );
};

export default ProtectedDynamicPage;