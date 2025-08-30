import React from 'react';
import { colors, spacing, typography } from '../../../theme/tokens';

export interface CheckboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface CheckboxGroupProps {
  options: CheckboxOption[];
  value: string[];
  onChange: (values: string[]) => void;
  disabled?: boolean;
  maxSelections?: number;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  options,
  value = [],
  onChange,
  disabled = false,
  maxSelections,
  columns = 2,
  className = '',
}) => {
  const containerStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: spacing[4],
  };

  const checkboxItemStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
  };

  const checkboxStyles: React.CSSProperties = {
    width: spacing[4],
    height: spacing[4],
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  const labelStyles: React.CSSProperties = {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
  };

  const handleChange = (optionValue: string) => {
    if (disabled) return;

    const isSelected = value.includes(optionValue);
    
    if (isSelected) {
      // Remove from selection
      onChange(value.filter(v => v !== optionValue));
    } else {
      // Add to selection (if not at max limit)
      if (!maxSelections || value.length < maxSelections) {
        onChange([...value, optionValue]);
      }
    }
  };

  const isOptionDisabled = (option: CheckboxOption) => {
    if (disabled || option.disabled) return true;
    
    // If max selections reached and this option is not selected
    if (maxSelections && value.length >= maxSelections && !value.includes(option.value)) {
      return true;
    }
    
    return false;
  };

  return (
    <div style={containerStyles} className={className}>
      {options.map((option) => {
        const isSelected = value.includes(option.value);
        const isDisabled = isOptionDisabled(option);
        
        return (
          <label
            key={option.value}
            style={{
              ...checkboxItemStyles,
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              opacity: isDisabled ? 0.6 : 1,
            }}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleChange(option.value)}
              disabled={isDisabled}
              style={checkboxStyles}
            />
            <span
              style={{
                ...labelStyles,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                color: isDisabled ? colors.text.muted : colors.text.primary,
              }}
            >
              {option.label}
            </span>
          </label>
        );
      })}
    </div>
  );
};

export default CheckboxGroup;