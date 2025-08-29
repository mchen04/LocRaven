'use client';

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface ServicesSectionProps {
  formData: {
    services?: string[];
    featured_items?: string[];
  };
  isEditing: boolean;
  onFieldChange: (field: string, value: string[] | string) => void;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({
  formData,
  isEditing,
  onFieldChange
}) => {
  const [serviceInput, setServiceInput] = useState('');
  const [featuredItemInput, setFeaturedItemInput] = useState('');

  const handleAddService = () => {
    if (serviceInput.trim()) {
      const currentServices = Array.isArray(formData.services) ? formData.services : [];
      onFieldChange('services', [...currentServices, serviceInput.trim()]);
      setServiceInput('');
    }
  };

  const handleRemoveService = (index: number) => {
    const currentServices = Array.isArray(formData.services) ? formData.services : [];
    onFieldChange('services', currentServices.filter((_, i) => i !== index));
  };

  const handleAddFeaturedItem = () => {
    if (featuredItemInput.trim()) {
      const currentItems = Array.isArray(formData.featured_items) ? formData.featured_items : [];
      onFieldChange('featured_items', [...currentItems, featuredItemInput.trim()]);
      setFeaturedItemInput('');
    }
  };

  const handleRemoveFeaturedItem = (index: number) => {
    const currentItems = Array.isArray(formData.featured_items) ? formData.featured_items : [];
    onFieldChange('featured_items', currentItems.filter((_, i) => i !== index));
  };

  return (
    <div className="form-section-header">
      <h3>Services & Offerings</h3>
      <div className="form-content">
        {/* Services */}
        <div className="form-group full-width">
          <label className="form-label">Services</label>
          <p className="form-help-text">
            List the main services or products your business offers
          </p>
          
          {isEditing && (
            <div className="tag-input-field">
              <input
                type="text"
                className="form-input"
                value={serviceInput}
                onChange={(e) => setServiceInput(e.target.value)}
                placeholder="Add a service (e.g., 'Haircuts', 'Oil Changes')"
                onKeyPress={(e) => e.key === 'Enter' && handleAddService()}
              />
              <button
                type="button"
                className="btn-add-tag"
                onClick={handleAddService}
                disabled={!serviceInput.trim()}
              >
                <Plus size={16} />
                Add
              </button>
            </div>
          )}
          
          <div className="tag-list">
            {(formData.services || []).map((service, index) => (
              <div key={index} className="tag-item">
                <span className="tag-text">{service}</span>
                {isEditing && (
                  <button
                    type="button"
                    className="tag-remove"
                    onClick={() => handleRemoveService(index)}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {(!formData.services || formData.services.length === 0) && (
            <div className="form-display">No services added</div>
          )}
        </div>

        {/* Featured Items */}
        <div className="form-group full-width">
          <label className="form-label">Featured Items/Specialties</label>
          <p className="form-help-text">
            Highlight your most popular items or specialties
          </p>
          
          {isEditing && (
            <div className="tag-input-field">
              <input
                type="text"
                className="form-input"
                value={featuredItemInput}
                onChange={(e) => setFeaturedItemInput(e.target.value)}
                placeholder="Add featured item"
                onKeyPress={(e) => e.key === 'Enter' && handleAddFeaturedItem()}
              />
              <button
                type="button"
                className="btn-add-tag"
                onClick={handleAddFeaturedItem}
                disabled={!featuredItemInput.trim()}
              >
                <Plus size={16} />
                Add
              </button>
            </div>
          )}
          
          <div className="tag-list">
            {(formData.featured_items || []).map((item, index) => (
              <div key={index} className="tag-item">
                <span className="tag-text">{item}</span>
                {isEditing && (
                  <button
                    type="button"
                    className="tag-remove"
                    onClick={() => handleRemoveFeaturedItem(index)}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {(!formData.featured_items || formData.featured_items.length === 0) && (
            <div className="form-display">No featured items added</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;