'use client';

import React from 'react';

interface BasicInformationSectionProps {
  formData: {
    name: string;
    primary_category?: string;
    description?: string;
  };
  isEditing: boolean;
  onFieldChange: (field: string, value: string) => void;
}

const BasicInformationSection: React.FC<BasicInformationSectionProps> = ({
  formData,
  isEditing,
  onFieldChange
}) => {
  return (
    <div className="form-section-header">
      <h3>Basic Information</h3>
      <div className="form-content">
        {/* Business Name */}
        <div className="form-group">
          <label className="form-label">
            Business Name <span className="required">*</span>
          </label>
          {isEditing ? (
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => onFieldChange('name', e.target.value)}
              placeholder="Enter your business name"
              required
            />
          ) : (
            <div className="form-display">
              {formData.name || 'Not set'}
            </div>
          )}
        </div>

        {/* Primary Category */}
        <div className="form-group">
          <label className="form-label">Primary Category</label>
          {isEditing ? (
            <select
              className="form-input"
              value={formData.primary_category || ''}
              onChange={(e) => onFieldChange('primary_category', e.target.value)}
            >
              <option value="">Select category</option>
              <option value="restaurant">Restaurant</option>
              <option value="retail">Retail</option>
              <option value="service">Professional Service</option>
              <option value="healthcare">Healthcare</option>
              <option value="automotive">Automotive</option>
              <option value="beauty">Beauty & Wellness</option>
              <option value="fitness">Fitness & Recreation</option>
              <option value="education">Education</option>
              <option value="entertainment">Entertainment</option>
              <option value="real-estate">Real Estate</option>
              <option value="other">Other</option>
            </select>
          ) : (
            <div className="form-display">
              {formData.primary_category || 'Not set'}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="form-group full-width">
          <label className="form-label">Business Description</label>
          <p className="form-help-text">
            Brief description of your business, products, or services
          </p>
          {isEditing ? (
            <textarea
              className="form-textarea"
              value={formData.description || ''}
              onChange={(e) => onFieldChange('description', e.target.value)}
              placeholder="Describe your business..."
              rows={4}
            />
          ) : (
            <div className="form-display description">
              {formData.description || 'Not set'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicInformationSection;