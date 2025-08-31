import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

const skeletonVariants = cva(
  'bg-gray-200 dark:bg-gray-700',
  {
    variants: {
      variant: {
        rectangular: 'rounded',
        circular: 'rounded-full',
        text: 'rounded',
        button: 'rounded-md',
        card: 'rounded-lg',
        avatar: 'rounded-full',
      },
      size: {
        xs: 'h-3',
        sm: 'h-4',
        md: 'h-5',
        lg: 'h-6',
        xl: 'h-8',
        '2xl': 'h-10',
      },
      animation: {
        pulse: 'animate-pulse',
        wave: 'animate-bounce',
        none: '',
      },
    },
    compoundVariants: [
      // Avatar sizes
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
      // Button sizes
      {
        variant: 'button',
        size: 'sm',
        class: 'w-16 h-8',
      },
      {
        variant: 'button',
        size: 'md',
        class: 'w-20 h-10',
      },
      {
        variant: 'button',
        size: 'lg',
        class: 'w-24 h-12',
      },
    ],
    defaultVariants: {
      variant: 'rectangular',
      size: 'md',
      animation: 'pulse',
    },
  }
);

interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string | number;
  height?: string | number;
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height,
  className,
  variant = 'rectangular',
  size = 'md',
  animation = 'pulse',
  style,
  ...props
}) => {
  const combinedStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
    ...style,
  };

  return (
    <div 
      className={cn(skeletonVariants({ variant, size, animation }), className)}
      style={combinedStyle}
      {...props}
    />
  );
};

export default Skeleton;