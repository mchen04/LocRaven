'use client';

import React, { useState } from 'react';
import { Clock, Calendar, FileText } from 'lucide-react';
import { formatDateTime } from '../utils/dateFormatters';
import { useFormProcessing } from '../hooks/useFormProcessing';
import ProcessingIndicator from './ui/molecules/ProcessingIndicator';
import FormError from './ui/molecules/FormError';

interface EnhancedUpdateFormProps {
  onSubmit?: (data: UpdateFormData) => void;
  onError?: (error: string) => void;
  isProcessing?: boolean;
}

export interface UpdateFormData {
  description: string;
  goLiveAt: Date | null;
  expiresAt: Date | null;
}

const EnhancedUpdateForm: React.FC<EnhancedUpdateFormProps> = ({ 
  onSubmit, 
  onError, 
  isProcessing = false 
}) => {
  const [description, setDescription] = useState('');
  const [goLiveAt, setGoLiveAt] = useState<string>(
    new Date().toISOString().slice(0, 16) // Default to now
  );
  const [expiresAt, setExpiresAt] = useState<string>('');
  
  const { error: formError, setError } = useFormProcessing({
    onError,
    resetOnSuccess: false
  });

  // Smart expiration suggestions based on content
  const getExpirationSuggestions = (content: string) => {
    const lowerContent = content.toLowerCase();
    const now = new Date();
    
    if (lowerContent.includes('weekend') || lowerContent.includes('saturday') || lowerContent.includes('sunday')) {
      const nextSunday = new Date(now);
      nextSunday.setDate(now.getDate() + (7 - now.getDay()) % 7);
      nextSunday.setHours(23, 59, 0, 0);
      return nextSunday.toISOString().slice(0, 16);
    }
    
    if (lowerContent.includes('today') || lowerContent.includes('tonight')) {
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 0, 0);
      return endOfDay.toISOString().slice(0, 16);
    }
    
    if (lowerContent.includes('week') && !lowerContent.includes('weekend')) {
      const oneWeek = new Date(now);
      oneWeek.setDate(now.getDate() + 7);
      return oneWeek.toISOString().slice(0, 16);
    }
    
    if (lowerContent.includes('month')) {
      const oneMonth = new Date(now);
      oneMonth.setMonth(now.getMonth() + 1);
      return oneMonth.toISOString().slice(0, 16);
    }
    
    // Default: no expiration for permanent updates like "new service"
    return '';
  };

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!description.trim()) {
      newErrors.description = 'Please describe your business update';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Please provide more detail (at least 10 characters)';
    }
    
    if (goLiveAt && expiresAt) {
      const goLive = new Date(goLiveAt);
      const expires = new Date(expiresAt);
      
      if (expires <= goLive) {
        newErrors.expiresAt = 'Expiration must be after go-live time';
      }
    }
    
    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix the errors above');
      return;
    }
    
    const formData: UpdateFormData = {
      description: description.trim(),
      goLiveAt: goLiveAt ? new Date(goLiveAt) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null
    };
    
    onSubmit?.(formData);
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    
    // Auto-suggest expiration if not already set
    if (!expiresAt && value.length > 20) {
      const suggestion = getExpirationSuggestions(value);
      if (suggestion) {
        setExpiresAt(suggestion);
      }
    }
  };


  return (
    <div className="enhanced-update-form">
      <div className="form-header">
        <h2>What&apos;s your business update?</h2>
        <p>Describe your update in detail - the more information you provide, the better our AI can optimize it for discovery.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="update-form">
        {/* Description Field */}
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            <FileText size={20} />
            <span>Business Update Description</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="Example: We're offering 20% off all professional consulting services this weekend! Perfect for small businesses looking to improve their operations. Call 555-123-4567 to schedule or email info@example.com. Limited time offer - book by Sunday!"
            className={`form-textarea ${fieldErrors.description ? 'error' : ''}`}
            rows={6}
            disabled={isProcessing}
          />
          <FormError error={fieldErrors.description} />
          <div className="form-helper">
            <span className="char-count">{description.length} characters</span>
            <small>Include details like pricing, contact info, timing, and what makes this special</small>
          </div>
        </div>

        {/* Timing Fields */}
        <div className="timing-fields">
          <div className="form-group">
            <label htmlFor="goLiveAt" className="form-label">
              <Calendar size={20} />
              <span>Go Live</span>
            </label>
            <input
              type="datetime-local"
              id="goLiveAt"
              value={goLiveAt}
              onChange={(e) => setGoLiveAt(e.target.value)}
              className="form-input"
              disabled={isProcessing}
            />
            <small className="form-helper">
              When should this update become visible? (Default: now)
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="expiresAt" className="form-label">
              <Clock size={20} />
              <span>Expires</span>
            </label>
            <input
              type="datetime-local"
              id="expiresAt"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className={`form-input ${fieldErrors.expiresAt ? 'error' : ''}`}
              disabled={isProcessing}
            />
            <FormError error={fieldErrors.expiresAt} />
            <small className="form-helper">
              When should this update expire? (Leave empty for permanent)
              {expiresAt && ` • Expires ${formatDateTime(expiresAt)}`}
            </small>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="btn-generate"
          disabled={isProcessing || !description.trim()}
        >
          {isProcessing ? (
            <>
              <div className="spinner" />
              Processing...
            </>
          ) : (
            <>
              ⚡ Generate AI-Optimized Preview
            </>
          )}
        </button>

        {/* Processing Indicator */}
        <ProcessingIndicator
          isVisible={isProcessing}
          message="🤖 AI is analyzing your update and creating optimized content..."
          submessage="This usually takes 30-60 seconds"
          variant="card"
        />
        
        {/* Form Error */}
        <FormError error={formError} variant="card" />
      </form>
    </div>
  );
};

export default EnhancedUpdateForm;