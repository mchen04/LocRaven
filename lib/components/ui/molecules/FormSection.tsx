import React from 'react';
import { colors, spacing, typography, radius } from '../../../theme/tokens';

export interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  className = '',
  collapsible = false,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

  const containerStyles: React.CSSProperties = {
    marginBottom: spacing[8],
  };

  const headerStyles: React.CSSProperties = {
    marginBottom: spacing[6],
  };

  const titleStyles: React.CSSProperties = {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: collapsible ? 'pointer' : 'default',
  };

  const descriptionStyles: React.CSSProperties = {
    fontSize: typography.fontSize.sm,
    color: colors.text.muted,
    marginTop: spacing[2],
    lineHeight: typography.lineHeight.relaxed,
  };

  const contentStyles: React.CSSProperties = {
    display: isExpanded ? 'block' : 'none',
  };

  const toggleButtonStyles: React.CSSProperties = {
    backgroundColor: 'transparent',
    border: 'none',
    color: colors.text.muted,
    cursor: 'pointer',
    padding: spacing[1],
    borderRadius: radius.base,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: typography.fontSize.lg,
    transition: 'all 0.2s ease',
  };

  const dividerStyles: React.CSSProperties = {
    width: '100%',
    height: '1px',
    backgroundColor: colors.border.primary,
    border: 'none',
    margin: `${spacing[6]} 0`,
  };

  return (
    <div style={containerStyles} className={className}>
      <div style={headerStyles}>
        {collapsible ? (
          <button
            type="button"
            style={titleStyles}
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-controls={`section-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
          >
            <span>{title}</span>
            <span
              style={{
                ...toggleButtonStyles,
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.gray[100];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              ▼
            </span>
          </button>
        ) : (
          <h3 style={titleStyles}>
            {title}
          </h3>
        )}
        
        {description && (
          <p style={descriptionStyles}>
            {description}
          </p>
        )}
      </div>

      <div
        id={`section-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
        style={contentStyles}
      >
        {children}
      </div>

      <hr style={dividerStyles} />
    </div>
  );
};

export default FormSection;