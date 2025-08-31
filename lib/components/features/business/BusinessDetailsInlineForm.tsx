'use client';

import React, { useState, useEffect } from 'react';
import { Save, Edit3, X } from 'lucide-react';
import { Business, ParkingInfo, ServiceAreaDetails, AvailabilityPolicy } from '../../../../types';
import { Alert } from '../../../components';
import { useAsync } from '../../../hooks';
import { supabase } from '../../../utils/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../ui/atoms';
import { messages } from '../../../constants/messages';
import {
  BasicInformationSection,
  LocationContactSection,
  BusinessDetailsSection,
  AccessibilityExperienceSection,
  ServiceAreaOperationsSection,
  RecognitionSocialSection,
} from './sections';

interface BusinessDetailsInlineFormProps {
  business?: Business;
  onSave?: (business: Business) => void;
}

interface FormState extends Omit<Business, 'id' | 'created_at' | 'updated_at' | 'awards' | 'certifications'> {
  name: string;
  address_city: string;
  address_state: string;
  service_area?: string;
  featured_items?: string[];
  parking_info?: string;
  // Enhanced form fields
  payment_methods?: string[];
  accessibility_features?: string[];
  languages_spoken?: string[];
  awards?: string[];
  certifications?: string[];
  enhanced_parking_info?: ParkingInfo;
  service_area_details?: ServiceAreaDetails;
  availability_policy?: AvailabilityPolicy;
}

const BusinessDetailsInlineForm: React.FC<BusinessDetailsInlineFormProps> = ({ business, onSave }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState<FormState>({
    name: '',
    address_city: '',
    address_state: '',
    email: user?.email || '',
    slug: '',
    address_street: '',
    zip_code: '',
    country: 'US',
    phone: '',
    phone_country_code: '+1',
    website: '',
    primary_category: '',
    description: '',
    static_tags: [],
    specialties: [],
    services: [],
    hours: '',
    price_positioning: undefined,
    social_media: {},
    established_year: undefined,
    // Enhanced form fields with defaults
    payment_methods: [],
    accessibility_features: [],
    languages_spoken: [],
    enhanced_parking_info: { types: [] },
    service_area_details: { primary_city: '' },
    availability_policy: { type: 'contact-for-availability' },
    ...business,
    // Convert Award[] to string[] for form compatibility
    awards: business?.awards ? business.awards.map(a => typeof a === 'string' ? a : a.name) : [],
    // Convert Certification[] to string[] for form compatibility
    certifications: business?.certifications ? business.certifications.map(c => typeof c === 'string' ? c : c.name) : []
  });

  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const { loading, execute } = useAsync();

  useEffect(() => {
    if (business) {
      // Convert old format to new format for enhanced fields
      const enhancedBusiness = {
        ...business,
        // Convert availability_policy from string to object if needed
        availability_policy: typeof business.availability_policy === 'string' 
          ? { type: business.availability_policy }
          : business.availability_policy || { type: 'contact-for-availability' },
        // Ensure static_tags is an array
        static_tags: Array.isArray(business.static_tags) ? business.static_tags : [],
        // Ensure enhanced fields have proper defaults
        enhanced_parking_info: business.enhanced_parking_info || { types: [] },
        service_area_details: business.service_area_details || { primary_city: business.address_city || '' },
        payment_methods: Array.isArray(business.payment_methods) ? business.payment_methods : [],
        accessibility_features: Array.isArray(business.accessibility_features) ? business.accessibility_features : [],
        languages_spoken: Array.isArray(business.languages_spoken) ? business.languages_spoken : [],
        // Convert Award[] to string[] for form compatibility
        awards: business.awards ? business.awards.map(a => typeof a === 'string' ? a : a.name) : [],
        // Convert Certification[] to string[] for form compatibility
        certifications: business.certifications ? business.certifications.map(c => typeof c === 'string' ? c : c.name) : []
      };
      
      setFormData(prev => ({ ...prev, ...enhancedBusiness }));
    }
  }, [business]);

  // Generic field change handler
  const handleFieldChange = (field: keyof Business, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Array field change handler
  const handleArrayFieldChange = (field: string, values: string[]) => {
    setFormData(prev => ({ ...prev, [field]: values }));
  };

  // Social media change handler
  const handleSocialMediaChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      social_media: {
        ...prev.social_media,
        [platform]: value
      }
    }));
  };

  // Nested field change handler (for enhanced fields)
  const handleNestedFieldChange = (parentField: string, field: string, value: string | string[] | number | undefined) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...(prev[parentField as keyof FormState] as object),
        [field]: value
      }
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) return 'Business name is required';
    if (!formData.address_city.trim()) return 'City is required';
    if (!formData.address_state?.trim()) return 'State is required';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Please enter a valid email address';
    }
    if (formData.phone && !/^[0-9]{10,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      return 'Please enter a valid phone number (10-15 digits)';
    }
    if (formData.static_tags && formData.static_tags.length > 5) {
      return 'Maximum 5 business features allowed';
    }
    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      return 'Website must start with http:// or https://';
    }
    return null;
  };

  const handleSave = async () => {
    const validationError = validateForm();
    if (validationError) {
      setAlert({ type: 'error', message: validationError });
      return;
    }

    const result = await execute(async () => {
      const businessData = {
        ...formData,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'),
        // Convert string arrays back to proper formats for database
        awards: formData.awards?.map(award => ({ name: award, year: new Date().getFullYear() })),
        certifications: formData.certifications?.map(cert => ({ name: cert, issuer: 'Unknown', year: new Date().getFullYear() }))
      };

      if (business?.id) {
        const { data, error } = await supabase
          .from('businesses')
          .update(businessData)
          .eq('id', business.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('businesses')
          .insert([businessData])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    });

    if (result) {
      setAlert({ type: 'success', message: messages.success.businessProfileSaved });
      setIsEditing(false);
      onSave?.(result as Business);
    } else {
      setAlert({ type: 'error', message: 'Failed to save business profile. Please try again.' });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setAlert(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAlert(null);
    if (business) {
      // Reset to original business data
      const resetBusiness = {
        ...business,
        awards: business.awards ? business.awards.map(a => typeof a === 'string' ? a : a.name) : [],
        certifications: business.certifications ? business.certifications.map(c => typeof c === 'string' ? c : c.name) : []
      };
      setFormData(prev => ({ ...prev, ...resetBusiness }));
    }
  };

  return (
    <div className="business-details-inline-form">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="form-header">
        <div className="form-actions">
          {isEditing ? (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                onClick={handleCancel}
                disabled={loading}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading}
                variant="primary"
                loading={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleEdit}
              variant="secondary"
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="form-content" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <BasicInformationSection
          formData={formData as any}
          isEditing={isEditing}
          onFieldChange={handleFieldChange}
        />

        <LocationContactSection
          formData={formData as any}
          isEditing={isEditing}
          onFieldChange={handleFieldChange}
        />

        <BusinessDetailsSection
          formData={formData as any}
          isEditing={isEditing}
          onFieldChange={handleFieldChange}
          onArrayFieldChange={handleArrayFieldChange}
        />

        <AccessibilityExperienceSection
          formData={formData as any}
          isEditing={isEditing}
          onFieldChange={handleFieldChange}
          onArrayFieldChange={handleArrayFieldChange}
        />

        <ServiceAreaOperationsSection
          formData={formData as any}
          isEditing={isEditing}
          onFieldChange={(field: string, value: string | number | undefined) => handleFieldChange(field as keyof Business, value)}
          onNestedFieldChange={handleNestedFieldChange}
          onArrayFieldChange={handleArrayFieldChange}
        />

        <RecognitionSocialSection
          formData={formData as any}
          isEditing={isEditing}
          onFieldChange={handleFieldChange}
          onArrayFieldChange={handleArrayFieldChange}
          onSocialMediaChange={handleSocialMediaChange}
        />
      </div>
    </div>
  );
};

export default BusinessDetailsInlineForm;