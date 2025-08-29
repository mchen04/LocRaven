'use client';

import React from 'react';

interface ContactInformationSectionProps {
  formData: {
    phone?: string;
    phone_country_code?: string;
    email?: string;
    website?: string;
    address_street?: string;
    address_city: string;
    address_state: string;
    zip_code?: string;
    country?: string;
  };
  isEditing: boolean;
  onFieldChange: (field: string, value: string) => void;
}

const ContactInformationSection: React.FC<ContactInformationSectionProps> = ({
  formData,
  isEditing,
  onFieldChange
}) => {
  return (
    <div className="form-section-header">
      <h3>Location & Contact</h3>
      <div className="form-content">
        {/* Address */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Street Address</label>
            {isEditing ? (
              <input
                type="text"
                className="form-input"
                value={formData.address_street || ''}
                onChange={(e) => onFieldChange('address_street', e.target.value)}
                placeholder="123 Main St"
              />
            ) : (
              <div className="form-display">
                {formData.address_street || 'Not set'}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">
              City <span className="required">*</span>
            </label>
            {isEditing ? (
              <input
                type="text"
                className="form-input"
                value={formData.address_city}
                onChange={(e) => onFieldChange('address_city', e.target.value)}
                placeholder="City name"
                required
              />
            ) : (
              <div className="form-display">
                {formData.address_city || 'Not set'}
              </div>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              State <span className="required">*</span>
            </label>
            {isEditing ? (
              <input
                type="text"
                className="form-input"
                value={formData.address_state}
                onChange={(e) => onFieldChange('address_state', e.target.value)}
                placeholder="State"
                required
              />
            ) : (
              <div className="form-display">
                {formData.address_state || 'Not set'}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">ZIP Code</label>
            {isEditing ? (
              <input
                type="text"
                className="form-input"
                value={formData.zip_code || ''}
                onChange={(e) => onFieldChange('zip_code', e.target.value)}
                placeholder="12345"
              />
            ) : (
              <div className="form-display">
                {formData.zip_code || 'Not set'}
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            {isEditing ? (
              <div className="phone-input-group">
                <select
                  className="country-select form-input"
                  value={formData.phone_country_code || '+1'}
                  onChange={(e) => onFieldChange('phone_country_code', e.target.value)}
                >
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+49">🇩🇪 +49</option>
                  <option value="+81">🇯🇵 +81</option>
                  <option value="+86">🇨🇳 +86</option>
                </select>
                <input
                  type="tel"
                  className="form-input"
                  value={formData.phone || ''}
                  onChange={(e) => onFieldChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
            ) : (
              <div className="form-display">
                {formData.phone ? `${formData.phone_country_code || '+1'} ${formData.phone}` : 'Not set'}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">Website URL</label>
            {isEditing ? (
              <input
                type="url"
                className="form-input"
                value={formData.website || ''}
                onChange={(e) => onFieldChange('website', e.target.value)}
                placeholder="https://example.com"
              />
            ) : (
              <div className="form-display">
                {formData.website ? (
                  <a href={formData.website} target="_blank" rel="noopener noreferrer">
                    {formData.website}
                  </a>
                ) : (
                  'Not set'
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInformationSection;