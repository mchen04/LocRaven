'use client';

import React, { useState, KeyboardEvent } from 'react';
import { colors, spacing, radius, typography } from '../../../theme/tokens';
import { messages } from '../../../constants/messages';
import { Button, Input } from '../atoms';

export interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  maxItems?: number;
  allowDuplicates?: boolean;
  disabled?: boolean;
  className?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  value = [],
  onChange,
  placeholder = messages.placeholders.searchQuery,
  maxTags,
  maxItems,
  allowDuplicates = false,
  disabled = false,
  className = '',
}) => {
  const [inputValue, setInputValue] = useState('');

  const containerStyles: React.CSSProperties = {
    width: '100%',
  };

  const inputContainerStyles: React.CSSProperties = {
    display: 'flex',
    gap: spacing[2],
    alignItems: 'center',
    marginBottom: spacing[3],
  };

  const tagsContainerStyles: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing[2],
    minHeight: spacing[8], // Ensure space even when empty
  };

  const tagStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing[1],
    backgroundColor: colors.primary.light,
    color: colors.white,
    padding: `${spacing[1]} ${spacing[3]}`,
    borderRadius: radius.full,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  };

  const removeButtonStyles: React.CSSProperties = {
    backgroundColor: 'transparent',
    border: 'none',
    color: colors.white,
    cursor: 'pointer',
    padding: '0',
    margin: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: spacing[4],
    height: spacing[4],
    borderRadius: radius.full,
    fontSize: typography.fontSize.sm,
    lineHeight: '1',
  };

  const helpTextStyles: React.CSSProperties = {
    color: colors.text.muted,
    fontSize: typography.fontSize.xs,
    marginTop: spacing[1],
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    
    if (!trimmedValue) return;
    
    // Check for duplicates
    if (!allowDuplicates && value.includes(trimmedValue)) {
      return;
    }
    
    // Check max tags limit
    const limit = maxItems || maxTags;
    if (limit && value.length >= limit) {
      return;
    }
    
    onChange([...value, trimmedValue]);
    setInputValue('');
  };

  const removeTag = (index: number) => {
    const newTags = value.filter((_, i) => i !== index);
    onChange(newTags);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const canAddTag = () => {
    const trimmedValue = inputValue.trim();
    return (
      trimmedValue && 
      (allowDuplicates || !value.includes(trimmedValue)) &&
      (!(maxItems || maxTags) || value.length < (maxItems || maxTags || 0)) &&
      !disabled
    );
  };

  return (
    <div style={containerStyles} className={className}>
      <div style={inputContainerStyles}>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          fullWidth={true}
        />
        <Button
          variant="primary"
          size="md"
          onClick={addTag}
          disabled={!canAddTag()}
        >
          Add
        </Button>
      </div>
      
      <div style={tagsContainerStyles}>
        {value.map((tag, index) => (
          <div key={index} style={tagStyles}>
            <span>{tag}</span>
            {!disabled && (
              <button
                type="button"
                style={removeButtonStyles}
                onClick={() => removeTag(index)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                aria-label={`Remove ${tag}`}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
      
      {(maxItems || maxTags) && (
        <div style={helpTextStyles}>
          {value.length}/{maxItems || maxTags} tags used
          {!allowDuplicates && ' • No duplicates allowed'}
        </div>
      )}
    </div>
  );
};

export default TagInput;