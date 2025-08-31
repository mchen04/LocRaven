
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

const loadingVariants = cva(
  '',
  {
    variants: {
      layout: {
        inline: 'inline-flex items-center',
        centered: 'flex flex-col items-center justify-center',
        overlay: 'fixed inset-0 bg-black/20 dark:bg-black/40 flex items-center justify-center z-50',
        fullscreen: 'min-h-screen flex items-center justify-center',
      },
      size: {
        xs: '',
        sm: '',
        md: '',
        lg: '',
        xl: '',
      },
      color: {
        primary: 'text-blue-600 dark:text-blue-400',
        secondary: 'text-gray-600 dark:text-gray-400',
        white: 'text-white',
        gray: 'text-gray-400 dark:text-gray-500',
      },
    },
    compoundVariants: [
      // Layout spacing
      {
        layout: ['centered', 'fullscreen'],
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
      },
    },
    defaultVariants: {
      size: 'md',
      layout: 'centered',
    },
  }
);

export interface LoadingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof loadingVariants> {
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton' | 'processing';
  text?: string;
  submessage?: string;
  'data-testid'?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  variant = 'spinner',
  layout = 'centered',
  text,
  submessage,
  color = 'primary',
  className,
  'data-testid': testId,
  ...props
}) => {

  const renderSpinner = () => (
    <div
      className={cn(spinnerVariants({ size }), loadingVariants({ color }))}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );

  const renderDots = () => (
    <div className={cn('flex space-x-1', loadingVariants({ color }))}>
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
        loadingVariants({ color }),
        'bg-current rounded animate-pulse border-0'
      )} 
    />
  );

  const renderSkeleton = () => (
    <div className={cn('space-y-3', textVariants({ size }))}>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
    </div>
  );

  const renderProcessing = () => (
    <div className="flex flex-col items-center space-y-2">
      {renderSpinner()}
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
      {variant !== 'skeleton' && variant !== 'processing' && renderVariant()}
      {text && variant !== 'skeleton' && variant !== 'processing' && (
        <p className={textVariants({ size, layout })}>
          {text}
        </p>
      )}
      {(variant === 'skeleton' || variant === 'processing') && renderVariant()}
    </>
  );

  if (layout === 'overlay') {
    return (
      <div className={cn(loadingVariants({ layout }))} data-testid={testId} {...props}>
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
      className={cn(loadingVariants({ layout, size, color }), className)}
      data-testid={testId}
      {...props}
    >
      {content}
    </div>
  );
};

export default Loading;