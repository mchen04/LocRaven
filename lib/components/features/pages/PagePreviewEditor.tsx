'use client';

import React, { useState, useEffect } from 'react';
import { Edit2, Check, X, AlertCircle } from 'lucide-react';
import type { WebsiteInfo } from "../../../services/ai/geminiApi";
import Button from '../../ui/atoms/Button';
import { cn } from '../../../utils/cn';
import { themeClasses, themeClass } from '../../../theme/utils';
// Simplified validation interface (no Zustand store needed)
interface FieldValidation {
  field: string;
  isValid: boolean;
  message?: string;
  suggestion?: string;
  severity?: 'error' | 'warning' | 'info';
}
import ExpirationEditor from './ExpirationEditor';

// Simple debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};

interface PagePreviewEditorProps {
  websiteInfo: WebsiteInfo;
  onEdit?: (field: string, value: string) => void;
  validationErrors?: FieldValidation[];
  // Removed unused update tracking props
}

const PagePreviewEditor: React.FC<PagePreviewEditorProps> = ({ 
  websiteInfo, 
  onEdit,
  validationErrors = []
}) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const debouncedEditValue = useDebounce(editValue, 300); // 300ms debounce
  
  // Helper to get current field value
  const getFieldValue = (field: string): string => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      return (websiteInfo as Record<string, any>)[parent]?.[child] || '';
    }
    return (websiteInfo as Record<string, any>)[field] || '';
  };
  
  // Auto-save with debounce when editing
  useEffect(() => {
    if (isEditing && debouncedEditValue !== getFieldValue(isEditing) && onEdit) {
      onEdit(isEditing, debouncedEditValue);
    }
  }, [debouncedEditValue, isEditing, onEdit, getFieldValue]);
  
  const getFieldValidation = (field: string): FieldValidation | undefined => {
    return validationErrors.find(error => error.field === field);
  };

  const handleStartEdit = (field: string, currentValue: string) => {
    setIsEditing(field);
    setEditValue(currentValue || '');
  };

  const handleSaveEdit = () => {
    if (isEditing && onEdit) {
      onEdit(isEditing, editValue);
    }
    setIsEditing(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditValue('');
  };

  const renderEditableField = (label: string, field: string, value: string) => {
    const validation = getFieldValidation(field);
    const hasValidation = validation && (validation.message || validation.suggestion);
    const severityColors = {
      error: '#ef4444',
      warning: '#f59e0b', 
      info: '#3b82f6'
    };
    const severityColor = validation?.severity ? severityColors[validation.severity] : '#374151';
    
    // Simple field style (removed complex update tracking)
    const fieldStyle = { marginBottom: hasValidation ? '0.5rem' : '1rem' };
    
    return (
    <div className="editable-field" style={fieldStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.25rem' }}>
        <label style={{ 
          fontSize: '0.75rem', 
          fontWeight: '500',
          color: hasValidation && !validation?.isValid ? severityColor : '#d1d5db'
        }}>
          {label}:
        </label>
        {hasValidation && !validation?.isValid && (
          <AlertCircle size={12} style={{ color: severityColor }} />
        )}
      </div>
      
      {isEditing === field ? (
        <div className="edit-mode">
          <input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className={`edit-input ${hasValidation && !validation?.isValid ? 'error' : ''}`}
            autoFocus
            style={{
              borderColor: hasValidation && !validation?.isValid ? severityColor : '#374151',
              backgroundColor: hasValidation && !validation?.isValid ? 
                `${severityColor}0D` : '#1f2937',
              color: '#e5e7eb'
            }}
          />
          <Button variant="success" size="sm" onClick={handleSaveEdit}>
            <Check size={14} />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
            <X size={14} />
          </Button>
        </div>
      ) : (
        <div className="view-mode">
          <span style={{
            color: hasValidation && !validation?.isValid ? severityColor : '#374151',
            fontStyle: !value ? 'italic' : 'normal',
            opacity: !value ? 0.6 : 1
          }}>
            {value || 'Not set'}
          </span>
          <Button variant="ghost" size="sm" onClick={() => handleStartEdit(field, value)}>
            <Edit2 size={14} />
          </Button>
        </div>
      )}
      
      {/* Validation Message */}
      {validation?.message && (
        <div className="validation-message" style={{
          color: severityColor,
        }}>
          <span>{validation.message}</span>
        </div>
      )}
      
      {/* Suggestion */}
      {validation?.suggestion && (
        <div className="validation-suggestion" style={{
          color: validation?.severity === 'error' ? severityColor : '#6b7280',
        }}>
          💡 {validation.suggestion}
        </div>
      )}
    </div>
  );
  };

  return (
    <div className="page-preview-editor">
      <div style={{ marginBottom: '1rem' }}>
        <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem', color: '#374151' }}>
          ✏️ Edit Details
        </h4>
        
        {/* Core Fields */}
        {renderEditableField('Business Name', 'businessName', websiteInfo.businessName || '')}
        {renderEditableField('Business Type', 'businessType', websiteInfo.businessType || '')}
        {renderEditableField('Location', 'location', websiteInfo.location || '')}
        {renderEditableField('Update Content', 'updateContent', websiteInfo.updateContent || '')}
        
        {/* Preview Fields */}
        {renderEditableField('Page Title', 'previewData.title', websiteInfo.previewData?.title || '')}
        {renderEditableField('Description', 'previewData.description', websiteInfo.previewData?.description || '')}
        
        {/* Contact Info */}
        {renderEditableField('Phone', 'contactInfo.phone', websiteInfo.contactInfo?.phone || '')}
        {renderEditableField('Email', 'contactInfo.email', websiteInfo.contactInfo?.email || '')}
        
        {/* Expiration Date Editor */}
        <div style={{ marginTop: '1.25rem' }}>
          <h5 style={{ fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
            📅 Expiration & Timing
          </h5>
          <ExpirationEditor
            temporalInfo={websiteInfo.temporalInfo}
            onUpdate={(newTemporalInfo) => {
              if (onEdit) {
                // Update the temporal info as a whole
                Object.keys(newTemporalInfo).forEach(key => {
                  onEdit(`temporalInfo.${key}`, (newTemporalInfo as any)[key]);
                });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PagePreviewEditor;