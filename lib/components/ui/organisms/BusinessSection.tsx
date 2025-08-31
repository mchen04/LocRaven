import React from 'react';
import { FormField, FormSection } from '../molecules';
import { Input, FormDisplay } from '../atoms';
import Select from '../molecules/Select';
import TagInput from '../molecules/TagInput';
import CheckboxGroup from '../molecules/CheckboxGroup';

export interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'email' | 'url' | 'tel' | 'number' | 'textarea' | 'select' | 'multiselect' | 'tags' | 'checkbox-group' | 'display-only';
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    pattern?: RegExp;
    message?: string;
  };
  className?: string;
  rows?: number; // for textarea
  multiline?: boolean;
  startIcon?: string;
}

export interface BusinessSectionProps<T = Record<string, any>> {
  title: string;
  description?: string;
  formData: T;
  isEditing: boolean;
  onFieldChange: (field: keyof T, value: any) => void;
  onArrayFieldChange?: (field: keyof T, values: string[]) => void;
  fields: FieldConfig[];
  variant?: 'default' | 'card' | 'bordered' | 'minimal';
  columns?: 1 | 2 | 3 | 'auto';
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  className?: string;
}

const BusinessSection = <T extends Record<string, any>>({
  title,
  description,
  formData,
  isEditing,
  onFieldChange,
  onArrayFieldChange,
  fields,
  variant = 'default',
  columns = 'auto',
  collapsible = false,
  defaultCollapsed = false,
  className = ''
}: BusinessSectionProps<T>) => {

  // Helper function to get nested values using dot notation
  const getNestedValue = (obj: Record<string, any>, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  // Helper function to set nested values using dot notation
  const setNestedValue = (obj: Record<string, any>, path: string, value: any) => {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      return current[key];
    }, obj);
    target[lastKey] = value;
  };

  const renderField = (field: FieldConfig) => {
    const value = field.key.includes('.') 
      ? getNestedValue(formData, field.key)
      : formData[field.key as keyof T];
    
    if (!isEditing) {
      // Read-only mode
      const displayValue = Array.isArray(value) 
        ? value.join(', ') 
        : typeof value === 'object' && value !== null 
          ? JSON.stringify(value) 
          : String(value || 'Not specified');
        
      return (
        <FormField
          key={field.key}
          label={field.label}
          className={field.className}
        >
          <FormDisplay variant="default">
            {displayValue}
          </FormDisplay>
        </FormField>
      );
    }

    // Edit mode
    const handleFieldChange = (newValue: any) => {
      if (field.key.includes('.')) {
        // Handle nested values - create a copy of formData and update nested property
        const updatedData = { ...formData };
        setNestedValue(updatedData, field.key, newValue);
        onFieldChange('social_media' as keyof T, updatedData.social_media);
      } else {
        onFieldChange(field.key as keyof T, newValue);
      }
    };

    const commonProps = {
      value: typeof value === 'string' || typeof value === 'number' 
        ? String(value) 
        : '',
      onChange: handleFieldChange,
      placeholder: field.placeholder,
      className: field.className,
    };

    let inputElement: React.ReactNode;

    switch (field.type) {
      case 'textarea':
        inputElement = (
          <textarea
            {...commonProps}
            rows={field.rows || 3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
          />
        );
        break;

      case 'select':
        inputElement = (
          <Select
            options={field.options || []}
            value={typeof value === 'string' || typeof value === 'number' ? String(value) : ''}
            onChange={(newValue) => onFieldChange(field.key as keyof T, newValue)}
            placeholder={field.placeholder}
          />
        );
        break;

      case 'multiselect':
        inputElement = (
          <Select
            options={field.options || []}
            value={Array.isArray(value) ? value : []}
            onChange={(newValue) => onFieldChange(field.key as keyof T, newValue)}
            placeholder={field.placeholder}
            multiple
          />
        );
        break;

      case 'tags':
        inputElement = (
          <TagInput
            value={Array.isArray(value) ? value : []}
            onChange={(tags) => {
              if (onArrayFieldChange) {
                onArrayFieldChange(field.key as keyof T, tags);
              } else {
                onFieldChange(field.key as keyof T, tags);
              }
            }}
            placeholder={field.placeholder}
          />
        );
        break;

      case 'checkbox-group':
        inputElement = (
          <CheckboxGroup
            options={field.options || []}
            value={Array.isArray(value) ? value : []}
            onChange={(selected) => onFieldChange(field.key as keyof T, selected)}
          />
        );
        break;

      case 'display-only':
        inputElement = (
          <FormDisplay variant="minimal">
            {Array.isArray(value) 
              ? value.join(', ') 
              : typeof value === 'object' && value !== null 
                ? JSON.stringify(value) 
                : String(value || 'Not specified')}
          </FormDisplay>
        );
        break;

      default:
        inputElement = (
          <Input
            type={field.type}
            startIcon={field.startIcon}
            {...commonProps}
          />
        );
        break;
    }

    return (
      <FormField
        key={field.key}
        label={field.label}
        required={field.required}
        helpText={field.helpText}
        className={field.className}
      >
        {inputElement}
      </FormField>
    );
  };

  return (
    <FormSection
      title={title}
      description={description}
      collapsible={collapsible}
      defaultExpanded={!defaultCollapsed}
      className={className}
    >
      <div className={`grid ${columns === 1 ? 'grid-cols-1' : columns === 2 ? 'grid-cols-1 md:grid-cols-2' : columns === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'} gap-6`}>
        {fields.map(renderField)}
      </div>
    </FormSection>
  );
};

export default BusinessSection;