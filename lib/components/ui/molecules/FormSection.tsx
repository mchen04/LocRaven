
'use client';

import { ReactNode, HTMLAttributes, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

// Form section variants using class-variance-authority
const formSectionVariants = cva(
  'mb-8'
);

const headerVariants = cva(
  'mb-6'
);

const titleVariants = cva(
  'text-lg font-semibold text-slate-900 m-0 flex items-center justify-between',
  {
    variants: {
      collapsible: {
        true: 'cursor-pointer',
        false: 'cursor-default',
      },
    },
    defaultVariants: {
      collapsible: false,
    },
  }
);

const descriptionVariants = cva(
  'text-sm text-slate-500 mt-2 leading-relaxed'
);

const contentVariants = cva(
  'transition-all duration-200',
  {
    variants: {
      expanded: {
        true: 'block',
        false: 'hidden',
      },
    },
    defaultVariants: {
      expanded: true,
    },
  }
);

const toggleButtonVariants = cva(
  'bg-transparent border-none text-slate-500 cursor-pointer p-1 rounded flex items-center justify-center text-lg transition-all duration-200 hover:bg-gray-100',
  {
    variants: {
      expanded: {
        true: 'rotate-180',
        false: 'rotate-0',
      },
    },
    defaultVariants: {
      expanded: false,
    },
  }
);

const dividerVariants = cva(
  'w-full h-px bg-gray-200 border-none my-6'
);

export interface FormSectionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formSectionVariants> {
  title: string;
  description?: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  className,
  collapsible = false,
  defaultExpanded = true,
  ...props
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div 
      className={cn(formSectionVariants(), className)}
      {...props}
    >
      <div className={cn(headerVariants())}>
        {collapsible ? (
          <button
            type="button"
            className={cn(titleVariants({ collapsible: true }))}
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-controls={`section-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
          >
            <span>{title}</span>
            <span
              className={cn(toggleButtonVariants({ expanded: isExpanded }))}
            >
              ▼
            </span>
          </button>
        ) : (
          <h3 className={cn(titleVariants({ collapsible: false }))}>
            {title}
          </h3>
        )}
        
        {description && (
          <p className={cn(descriptionVariants())}>
            {description}
          </p>
        )}
      </div>

      <div
        id={`section-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
        className={cn(contentVariants({ expanded: isExpanded }))}
      >
        {children}
      </div>

      <hr className={cn(dividerVariants())} />
    </div>
  );
};

export default FormSection;