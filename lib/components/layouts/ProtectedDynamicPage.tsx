'use client';

import nextDynamic from 'next/dynamic';
import { Suspense } from 'react';
import ProtectedPageWrapper from '../ProtectedPageWrapper';
import { Loading } from '../ui/atoms';

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
    loading: () => <Loading text={loadingText} layout="centered" />,
    ssr
  });

  return (
    <ProtectedPageWrapper>
      <Suspense fallback={<Loading text={fallbackText} layout="centered" />}>
        <DynamicComponent />
      </Suspense>
    </ProtectedPageWrapper>
  );
};

export default ProtectedDynamicPage;