'use client';

import { useState, KeyboardEvent } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';
import { messages } from '../../../constants/messages';
import { Button, Input } from '../atoms';

// Tag input variants using class-variance-authority
const tagInputVariants = cva(
  'w-full'
);

const inputContainerVariants = cva(
  'flex gap-2 items-center mb-3'
);

const tagsContainerVariants = cva(
  'flex flex-wrap gap-2 min-h-8'
);

const tagVariants = cva(
  'inline-flex items-center gap-1 bg-indigo-400 text-white px-3 py-1 rounded-full text-sm font-medium'
);

const removeButtonVariants = cva(
  'bg-transparent border-none text-white cursor-pointer p-0 m-0 flex items-center justify-center w-4 h-4 rounded-full text-sm leading-none transition-colors duration-200 hover:bg-white hover:bg-opacity-20'
);

const helpTextVariants = cva(
  'text-slate-500 text-xs mt-1'
);

export interface TagInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof tagInputVariants> {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  maxItems?: number;
  allowDuplicates?: boolean;
  disabled?: boolean;
}

const TagInput: React.FC<TagInputProps> = ({
  value = [],
  onChange,
  placeholder = messages.placeholders.searchQuery,
  maxTags,
  maxItems,
  allowDuplicates = false,
  disabled = false,
  className,
  ...props
}) => {
  const [inputValue, setInputValue] = useState('');

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
    <div 
      className={cn(tagInputVariants(), className)}
      {...props}
    >
      <div className={cn(inputContainerVariants())}>
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
      
      <div className={cn(tagsContainerVariants())}>
        {value.map((tag, index) => (
          <div key={index} className={cn(tagVariants())}>
            <span>{tag}</span>
            {!disabled && (
              <button
                type="button"
                className={cn(removeButtonVariants())}
                onClick={() => removeTag(index)}
                aria-label={`Remove ${tag}`}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
      
      {(maxItems || maxTags) && (
        <div className={cn(helpTextVariants())}>
          {value.length}/{maxItems || maxTags} tags used
          {!allowDuplicates && ' • No duplicates allowed'}
        </div>
      )}
    </div>
  );
};

export default TagInput;