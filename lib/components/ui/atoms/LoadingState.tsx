import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

const loadingStateVariants = cva(
  '',
  {
    variants: {
      layout: {
        inline: 'inline-flex items-center',
        centered: 'flex flex-col items-center justify-center',
        overlay: 'fixed inset-0 bg-black/20 dark:bg-black/40 flex items-center justify-center z-50',
        fullscreen: 'min-h-screen flex items-center justify-center',
        card: 'py-8 flex flex-col items-center justify-center',
      },
      size: {
        xs: '',
        sm: '',
        md: '',
        lg: '',
        xl: '',
      },
      color: {
        primary: 'text-primary dark:text-primary-light',
        secondary: 'text-gray-600 dark:text-gray-400',
        white: 'text-white',
        gray: 'text-gray-400 dark:text-gray-500',
      },
    },
    compoundVariants: [
      {
        layout: ['centered', 'fullscreen', 'card'],
        class: 'space-y-2',
      },
    ],
    defaultVariants: {
      layout: 'centered',
      size: 'md',
      color: 'primary',
    },
  }
);

const spinnerVariants = cva(
  'animate-spin rounded-full border-2 border-current border-t-transparent',
  {
    variants: {
      size: {
        xs: 'h-3 w-3',
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const textVariants = cva(
  'text-gray-600 dark:text-gray-400 font-medium',
  {
    variants: {
      size: {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
      },
      layout: {
        inline: 'ml-2',
        centered: 'mt-2',
        overlay: 'mt-2',
        fullscreen: 'mt-2',
        card: 'mt-2',
      },
    },
    defaultVariants: {
      size: 'md',
      layout: 'centered',
    },
  }
);

const skeletonVariants = cva(
  'bg-gray-200 dark:bg-gray-700 animate-pulse',
  {
    variants: {
      variant: {
        text: 'rounded h-4',
        button: 'rounded-md h-10 w-24',
        card: 'rounded-lg h-32',
        avatar: 'rounded-full',
        header: 'rounded h-6',
      },
      size: {
        xs: 'h-3',
        sm: 'h-4',
        md: 'h-5',
        lg: 'h-6',
        xl: 'h-8',
      },
    },
    compoundVariants: [
      {
        variant: 'avatar',
        size: 'xs',
        class: 'w-6 h-6',
      },
      {
        variant: 'avatar',
        size: 'sm',
        class: 'w-8 h-8',
      },
      {
        variant: 'avatar',
        size: 'md',
        class: 'w-10 h-10',
      },
      {
        variant: 'avatar',
        size: 'lg',
        class: 'w-12 h-12',
      },
      {
        variant: 'avatar',
        size: 'xl',
        class: 'w-16 h-16',
      },
    ],
    defaultVariants: {
      variant: 'text',
      size: 'md',
    },
  }
);

export interface LoadingStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof loadingStateVariants> {
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton' | 'processing';
  text?: string;
  submessage?: string;
  lines?: number;
  showHeader?: boolean;
  showButton?: boolean;
  width?: string | number;
  height?: string | number;
  isVisible?: boolean;
  'data-testid'?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  size = 'md',
  variant = 'spinner',
  layout = 'centered',
  text,
  submessage,
  color = 'primary',
  lines = 3,
  showHeader = true,
  showButton = false,
  width = '100%',
  height,
  isVisible = true,
  className,
  'data-testid': testId,
  ...props
}) => {
  if (!isVisible) return null;

  const renderSpinner = () => (
    <div
      className={cn(spinnerVariants({ size }), loadingStateVariants({ color }))}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );

  const renderDots = () => (
    <div className={cn('flex space-x-1', loadingStateVariants({ color }))}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            spinnerVariants({ size }),
            'bg-current rounded-full animate-bounce border-0'
          )}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div
      className={cn(
        spinnerVariants({ size }),
        loadingStateVariants({ color }),
        'bg-current rounded animate-pulse border-0'
      )}
    />
  );

  const renderSkeleton = () => (
    <div className={cn('w-full', textVariants({ size }))}>
      {showHeader && (
        <div className="mb-4 space-y-2">
          <div className={cn(skeletonVariants({ variant: 'header', size }), 'w-3/4')} />
          <div className={cn(skeletonVariants({ variant: 'text', size }), 'w-1/2')} />
        </div>
      )}
      
      <div className="space-y-3">
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={cn(
              skeletonVariants({ variant: 'text', size }),
              i === lines - 1 ? 'w-3/5' : 'w-full'
            )}
          />
        ))}
      </div>
      
      {showButton && (
        <div className="mt-4">
          <div className={skeletonVariants({ variant: 'button', size })} />
        </div>
      )}
    </div>
  );

  const renderProcessing = () => (
    <div className="flex flex-col items-center space-y-2">
      {renderSpinner()}
      {text && (
        <p className={textVariants({ size, layout })}>
          {text}
        </p>
      )}
      {submessage && (
        <p className={cn(textVariants({ size, layout }), 'text-sm opacity-75')}>
          {submessage}
        </p>
      )}
    </div>
  );

  const renderVariant = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'skeleton':
        return renderSkeleton();
      case 'processing':
        return renderProcessing();
      default:
        return renderSpinner();
    }
  };

  const content = (
    <>
      {!['skeleton', 'processing'].includes(variant) && renderVariant()}
      {text && !['skeleton', 'processing'].includes(variant) && (
        <p className={textVariants({ size, layout })}>
          {text}
        </p>
      )}
      {['skeleton', 'processing'].includes(variant) && renderVariant()}
    </>
  );

  if (layout === 'overlay') {
    return (
      <div className={cn(loadingStateVariants({ layout }))} data-testid={testId} {...props}>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
          <div className="flex flex-col items-center space-y-2">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(loadingStateVariants({ layout, size, color }), className)}
      data-testid={testId}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
      }}
      {...props}
    >
      {content}
    </div>
  );
};

export default LoadingState;
export { loadingStateVariants, spinnerVariants, textVariants, skeletonVariants };