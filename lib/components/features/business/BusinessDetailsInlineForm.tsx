'use client';

import React, { useState, useEffect } from 'react';
import { Save, Edit3, X } from 'lucide-react';
import { Business, ParkingInfo, ServiceAreaDetails, AvailabilityPolicy } from '../../../../types';
import { config } from '../../../utils';
import { Alert } from '../../../components';
import { useAsync } from '../../../hooks';
import { supabase } from '../../../utils/supabase';
import { useAuth } from '../../../contexts/AuthContext';

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
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [serviceInput, setServiceInput] = useState('');
  const [featuredItemInput, setFeaturedItemInput] = useState('');
  const [awardInput, setAwardInput] = useState('');
  const [certificationInput, setCertificationInput] = useState('');
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

  useEffect(() => {
    if (user?.email && !business) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, [user?.email, business]);

  const handleInputChange = (field: keyof FormState, value: string | string[] | number | undefined) => {
    // Auto-format website URLs by prepending https:// if missing
    if (field === 'website' && typeof value === 'string' && value.trim()) {
      const trimmedValue = value.trim();
      if (!trimmedValue.startsWith('http://') && !trimmedValue.startsWith('https://')) {
        value = `https://${trimmedValue}`;
      }
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    let formattedValue = value.trim();
    
    // Auto-format social media URLs based on platform
    if (formattedValue && !formattedValue.startsWith('http://') && !formattedValue.startsWith('https://')) {
      // Remove @ symbol if present
      if (formattedValue.startsWith('@')) {
        formattedValue = formattedValue.slice(1);
      }
      
      // Add platform-specific URL prefix
      switch (platform) {
        case 'instagram':
          formattedValue = `https://instagram.com/${formattedValue}`;
          break;
        case 'facebook':
          formattedValue = `https://facebook.com/${formattedValue}`;
          break;
        case 'twitter':
          formattedValue = `https://twitter.com/${formattedValue}`;
          break;
        case 'linkedin':
          formattedValue = `https://linkedin.com/company/${formattedValue}`;
          break;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      social_media: {
        ...prev.social_media,
        [platform]: formattedValue
      }
    }));
  };

  const handleTagToggle = (tagValue: string) => {
    const currentTags = formData.static_tags || [];
    const isSelected = currentTags.includes(tagValue);
    
    if (isSelected) {
      setFormData(prev => ({
        ...prev,
        static_tags: currentTags.filter(tag => tag !== tagValue)
      }));
    } else if (currentTags.length < 5) {
      setFormData(prev => ({
        ...prev,
        static_tags: [...currentTags, tagValue]
      }));
    }
  };

  // Handler for multi-select arrays (payment methods, accessibility features)
  const handleArrayToggle = (field: keyof FormState, value: string) => {
    const currentArray = (formData[field] as string[]) || [];
    const isSelected = currentArray.includes(value);
    
    if (isSelected) {
      setFormData(prev => ({
        ...prev,
        [field]: currentArray.filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: [...currentArray, value]
      }));
    }
  };

  // Removed unused handleLanguageChange function

  // Handler for parking info structure
  const handleParkingChange = (field: keyof ParkingInfo, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      enhanced_parking_info: {
        ...prev.enhanced_parking_info,
        [field]: value
      } as ParkingInfo
    }));
  };

  // Handler for service area details
  const handleServiceAreaChange = (field: keyof ServiceAreaDetails, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      service_area_details: {
        ...prev.service_area_details,
        [field]: value
      } as ServiceAreaDetails
    }));
  };

  // Handler for availability policy
  const handleAvailabilityChange = (field: keyof AvailabilityPolicy, value: string) => {
    setFormData(prev => ({
      ...prev,
      availability_policy: {
        ...prev.availability_policy,
        [field]: value
      } as AvailabilityPolicy
    }));
  };

  // Handler for adding specialties
  const handleAddSpecialty = () => {
    if (specialtyInput.trim()) {
      const currentSpecialties = Array.isArray(formData.specialties) ? formData.specialties : [];
      setFormData(prev => ({
        ...prev,
        specialties: [...currentSpecialties, specialtyInput.trim()]
      }));
      setSpecialtyInput('');
    }
  };

  // Handler for removing specialties
  const handleRemoveSpecialty = (index: number) => {
    const currentSpecialties = Array.isArray(formData.specialties) ? formData.specialties : [];
    setFormData(prev => ({
      ...prev,
      specialties: currentSpecialties.filter((_, i) => i !== index)
    }));
  };

  // Handler for adding services
  const handleAddService = () => {
    if (serviceInput.trim()) {
      const currentServices = Array.isArray(formData.services) ? formData.services : [];
      setFormData(prev => ({
        ...prev,
        services: [...currentServices, serviceInput.trim()]
      }));
      setServiceInput('');
    }
  };

  // Handler for removing services
  const handleRemoveService = (index: number) => {
    const currentServices = Array.isArray(formData.services) ? formData.services : [];
    setFormData(prev => ({
      ...prev,
      services: currentServices.filter((_, i) => i !== index)
    }));
  };

  // Handler for adding featured items
  const handleAddFeaturedItem = () => {
    if (featuredItemInput.trim()) {
      const currentItems = Array.isArray(formData.featured_items) ? formData.featured_items : [];
      setFormData(prev => ({
        ...prev,
        featured_items: [...currentItems, featuredItemInput.trim()]
      }));
      setFeaturedItemInput('');
    }
  };

  // Handler for removing featured items
  const handleRemoveFeaturedItem = (index: number) => {
    const currentItems = Array.isArray(formData.featured_items) ? formData.featured_items : [];
    setFormData(prev => ({
      ...prev,
      featured_items: currentItems.filter((_, i) => i !== index)
    }));
  };

  // Handler for adding awards (as strings for form simplicity)
  const handleAddAward = () => {
    if (awardInput.trim()) {
      setFormData(prev => ({
        ...prev,
        awards: [...(prev.awards || []), awardInput.trim()]
      }));
      setAwardInput('');
    }
  };

  // Handler for removing awards
  const handleRemoveAward = (index: number) => {
    setFormData(prev => ({
      ...prev,
      awards: (prev.awards || []).filter((_, i) => i !== index)
    }));
  };

  // Handler for adding certifications (as strings for form simplicity)
  const handleAddCertification = () => {
    if (certificationInput.trim()) {
      setFormData(prev => ({
        ...prev,
        certifications: [...(prev.certifications || []), certificationInput.trim()]
      }));
      setCertificationInput('');
    }
  };

  // Handler for removing certifications
  const handleRemoveCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: (prev.certifications || []).filter((_, i) => i !== index)
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
    if (formData.established_year && (formData.established_year < 1000 || formData.established_year > new Date().getFullYear())) {
      return 'Established year must be between 1000 and current year';
    }
    return null;
  };

  const handleSave = async () => {
    const validationError = validateForm();
    if (validationError) {
      setAlert({ type: 'error', message: validationError });
      return;
    }

    await execute(async () => {
      const saveData = {
        ...formData,
        phone_country_code: formData.phone_country_code?.includes('-') 
          ? formData.phone_country_code.split('-')[0] 
          : formData.phone_country_code,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        // Ensure arrays are properly formatted for JSONB columns
        specialties: Array.isArray(formData.specialties) ? formData.specialties : [],
        services: Array.isArray(formData.services) ? formData.services : [],
        awards: Array.isArray(formData.awards) ? formData.awards : [],
        certifications: Array.isArray(formData.certifications) ? formData.certifications : [],
        social_media: formData.social_media || {},
        // Ensure static_tags is properly handled as array (prevent string serialization)
        static_tags: Array.isArray(formData.static_tags) ? formData.static_tags : 
                     typeof formData.static_tags === 'string' ? [formData.static_tags] : [],
        
        // Enhanced form fields for 100% template coverage
        payment_methods: Array.isArray(formData.payment_methods) ? formData.payment_methods : [],
        accessibility_features: Array.isArray(formData.accessibility_features) ? formData.accessibility_features : [],
        languages_spoken: Array.isArray(formData.languages_spoken) ? formData.languages_spoken : [],
        enhanced_parking_info: formData.enhanced_parking_info || { types: [] },
        service_area_details: formData.service_area_details || { primary_city: formData.address_city || '' },
        availability_policy: formData.availability_policy || { type: 'contact-for-availability' }
      };

      let result;
      if (business?.id) {
        // Update existing business
        result = await supabase
          .from('businesses')
          .update(saveData)
          .eq('id', business.id)
          .select()
          .single();
      } else {
        // Create new business
        result = await supabase
          .from('businesses')
          .insert(saveData)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      setAlert({ type: 'success', message: 'Business profile saved successfully!' });
      setIsEditing(false);
      
      // Invalidate cache for geographic business profile page
      if (result.data?.id) {
        try {
          await fetch('/api/revalidate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'business-update',
              businessId: result.data.id
            })
          });
          console.log('Geographic route cache invalidated for business:', result.data.slug);
        } catch (cacheError) {
          console.warn('Cache invalidation failed (non-critical):', cacheError);
          // Don't throw - cache invalidation failure shouldn't break the form
        }
      }
      
      if (onSave && result.data) {
        onSave(result.data);
      }
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original business data
    if (business) {
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
            <>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="btn-secondary"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="btn-primary"
              >
                <Save size={16} />
                {loading ? 'Saving...' : 'Save'}
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="btn-secondary"
            >
              <Edit3 size={16} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="form-content">
        {/* Section 1: Basic Information */}
        <div className="form-section-header">
          <h3>Basic Information</h3>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Business Name <span className="required">*</span>
            </label>
            {isEditing ? (
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter business name"
                required
              />
            ) : (
              <div className="form-display">{formData.name || 'Not specified'}</div>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">Email</label>
            {isEditing ? (
              <input
                type="email"
                className="form-input"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="business@example.com"
              />
            ) : (
              <div className="form-display">{formData.email || 'Not specified'}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Website</label>
            {isEditing ? (
              <input
                type="url"
                className="form-input"
                value={formData.website || ''}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="locraven.com"
              />
            ) : (
              <div className="form-display">
                {formData.website ? (
                  <a href={formData.website} target="_blank" rel="noopener noreferrer">
                    {formData.website}
                  </a>
                ) : (
                  'Not specified'
                )}
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Location & Contact */}
        <div className="form-section-header">
          <h3>Location & Contact</h3>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              City <span className="required">*</span>
            </label>
            {isEditing ? (
              <input
                type="text"
                className="form-input"
                value={formData.address_city}
                onChange={(e) => handleInputChange('address_city', e.target.value)}
                placeholder="Enter city"
                required
              />
            ) : (
              <div className="form-display">{formData.address_city || 'Not specified'}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              State <span className="required">*</span>
            </label>
            {isEditing ? (
              <select
                className="form-input"
                value={formData.address_state || ''}
                onChange={(e) => handleInputChange('address_state', e.target.value)}
                required
              >
                <option value="">Select state...</option>
                {config.states.map(state => (
                  <option key={state.code} value={state.code}>{state.name}</option>
                ))}
              </select>
            ) : (
              <div className="form-display">
                {formData.address_state ? 
                  config.states.find(s => s.code === formData.address_state)?.name || formData.address_state
                  : 'Not specified'
                }
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Street Address</label>
            {isEditing ? (
              <input
                type="text"
                className="form-input"
                value={formData.address_street || ''}
                onChange={(e) => handleInputChange('address_street', e.target.value)}
                placeholder="123 Main St"
              />
            ) : (
              <div className="form-display">{formData.address_street || 'Not specified'}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">ZIP Code</label>
            {isEditing ? (
              <input
                type="text"
                className="form-input"
                value={formData.zip_code || ''}
                onChange={(e) => handleInputChange('zip_code', e.target.value)}
                placeholder="12345"
              />
            ) : (
              <div className="form-display">{formData.zip_code || 'Not specified'}</div>
            )}
          </div>
        </div>

        {/* Row 3: Contact */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Phone</label>
            {isEditing ? (
              <div className="phone-input-group">
                <select
                  className="form-input country-select"
                  value={formData.phone_country_code || '+1'}
                  onChange={(e) => handleInputChange('phone_country_code', e.target.value)}
                >
                  {config.countryCodes.map(code => (
                    <option key={code.value} value={code.value}>{code.label}</option>
                  ))}
                </select>
                <input
                  type="tel"
                  className="form-input"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="1234567890"
                />
              </div>
            ) : (
              <div className="form-display">
                {formData.phone ? 
                  `${formData.phone_country_code || '+1'} ${formData.phone}` 
                  : 'Not specified'
                }
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Primary Category</label>
            {isEditing ? (
              <select
                className="form-input"
                value={formData.primary_category || ''}
                onChange={(e) => handleInputChange('primary_category', e.target.value)}
              >
                <option value="">Select category...</option>
                {config.primaryCategories.map(category => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>
            ) : (
              <div className="form-display">
                {formData.primary_category ? 
                  config.primaryCategories.find(c => c.value === formData.primary_category)?.label || formData.primary_category
                  : 'Not specified'
                }
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Hours</label>
            {isEditing ? (
              <input
                type="text"
                className="form-input"
                value={formData.hours || ''}
                onChange={(e) => handleInputChange('hours', e.target.value)}
                placeholder="Mon-Fri 9am-5pm, Sat 10am-3pm"
              />
            ) : (
              <div className="form-display">{formData.hours || 'Not specified'}</div>
            )}
          </div>

        </div>

        {/* Section 3: Business Details */}
        <div className="form-section-header">
          <h3>Business Details</h3>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Price Range</label>
            {isEditing ? (
              <select
                className="form-input"
                value={formData.price_positioning || ''}
                onChange={(e) => handleInputChange('price_positioning', e.target.value)}
              >
                <option value="">Select range...</option>
                <option value="budget">Budget ($)</option>
                <option value="mid-range">Mid-range ($$)</option>
                <option value="premium">Premium ($$$)</option>
                <option value="luxury">Luxury ($$$$)</option>
              </select>
            ) : (
              <div className="form-display">
                {formData.price_positioning ? 
                  formData.price_positioning.charAt(0).toUpperCase() + formData.price_positioning.slice(1)
                  : 'Not specified'
                }
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Established Year</label>
            {isEditing ? (
              <input
                type="number"
                className="form-input"
                value={formData.established_year || ''}
                onChange={(e) => handleInputChange('established_year', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="2020"
                min="1000"
                max={new Date().getFullYear()}
              />
            ) : (
              <div className="form-display">{formData.established_year || 'Not specified'}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Specialties</label>
            {isEditing ? (
              <div className="tag-input-container">
                <div className="tag-input-field">
                  <input
                    type="text"
                    className="form-input"
                    value={specialtyInput}
                    onChange={(e) => setSpecialtyInput(e.target.value)}
                    placeholder="Enter a specialty (e.g., organic ingredients)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSpecialty();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn-add-tag"
                    onClick={handleAddSpecialty}
                    disabled={!specialtyInput.trim()}
                  >
                    Add
                  </button>
                </div>
                <div className="tag-list">
                  {Array.isArray(formData.specialties) && formData.specialties.map((specialty, index) => (
                    <div key={index} className="tag-item">
                      <span className="tag-text">{specialty}</span>
                      <button
                        type="button"
                        className="tag-remove"
                        onClick={() => handleRemoveSpecialty(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <p className="form-help-text small">Press Enter or click Add to add each specialty</p>
              </div>
            ) : (
              <div className="form-display">
                {Array.isArray(formData.specialties) && formData.specialties.length > 0
                  ? formData.specialties.join(', ')
                  : 'Not specified'
                }
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Services</label>
            {isEditing ? (
              <div className="tag-input-container">
                <div className="tag-input-field">
                  <input
                    type="text"
                    className="form-input"
                    value={serviceInput}
                    onChange={(e) => setServiceInput(e.target.value)}
                    placeholder="Enter a service (e.g., custom cakes)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddService();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn-add-tag"
                    onClick={handleAddService}
                    disabled={!serviceInput.trim()}
                  >
                    Add
                  </button>
                </div>
                <div className="tag-list">
                  {Array.isArray(formData.services) && formData.services.map((service, index) => (
                    <div key={index} className="tag-item">
                      <span className="tag-text">{service}</span>
                      <button
                        type="button"
                        className="tag-remove"
                        onClick={() => handleRemoveService(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <p className="form-help-text small">Press Enter or click Add to add each service</p>
              </div>
            ) : (
              <div className="form-display">
                {Array.isArray(formData.services) && formData.services.length > 0
                  ? formData.services.join(', ')
                  : 'Not specified'
                }
              </div>
            )}
          </div>
        </div>

        {/* Row 5: Description (full width) */}
        <div className="form-row">
          <div className="form-group full-width">
            <label className="form-label">Business Description</label>
            {isEditing ? (
              <textarea
                className="form-textarea"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your business, services, and what makes you unique..."
                rows={3}
              />
            ) : (
              <div className="form-display description">
                {formData.description || 'Not specified'}
              </div>
            )}
          </div>
        </div>

        {/* Row 6: Social Media */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Instagram</label>
            {isEditing ? (
              <div className="social-input-group">
                <span className="social-prefix">instagram.com/</span>
                <input
                  type="text"
                  className="form-input social-input"
                  value={formData.social_media?.instagram?.replace('https://instagram.com/', '') || ''}
                  onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                  placeholder="username"
                />
              </div>
            ) : (
              <div className="form-display">
                {formData.social_media?.instagram ? (
                  <a href={formData.social_media.instagram} target="_blank" rel="noopener noreferrer">
                    {formData.social_media.instagram}
                  </a>
                ) : (
                  'Not specified'
                )}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Facebook</label>
            {isEditing ? (
              <div className="social-input-group">
                <span className="social-prefix">facebook.com/</span>
                <input
                  type="text"
                  className="form-input social-input"
                  value={formData.social_media?.facebook?.replace('https://facebook.com/', '') || ''}
                  onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                  placeholder="page"
                />
              </div>
            ) : (
              <div className="form-display">
                {formData.social_media?.facebook ? (
                  <a href={formData.social_media.facebook} target="_blank" rel="noopener noreferrer">
                    {formData.social_media.facebook}
                  </a>
                ) : (
                  'Not specified'
                )}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Twitter</label>
            {isEditing ? (
              <div className="social-input-group">
                <span className="social-prefix">twitter.com/</span>
                <input
                  type="text"
                  className="form-input social-input"
                  value={formData.social_media?.twitter?.replace('https://twitter.com/', '') || ''}
                  onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                  placeholder="username"
                />
              </div>
            ) : (
              <div className="form-display">
                {formData.social_media?.twitter ? (
                  <a href={formData.social_media.twitter} target="_blank" rel="noopener noreferrer">
                    {formData.social_media.twitter}
                  </a>
                ) : (
                  'Not specified'
                )}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">LinkedIn</label>
            {isEditing ? (
              <div className="social-input-group">
                <span className="social-prefix">linkedin.com/company/</span>
                <input
                  type="text"
                  className="form-input social-input"
                  value={formData.social_media?.linkedin?.replace('https://linkedin.com/company/', '') || ''}
                  onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                  placeholder="company"
                />
              </div>
            ) : (
              <div className="form-display">
                {formData.social_media?.linkedin ? (
                  <a href={formData.social_media.linkedin} target="_blank" rel="noopener noreferrer">
                    {formData.social_media.linkedin}
                  </a>
                ) : (
                  'Not specified'
                )}
              </div>
            )}
          </div>
        </div>

        {/* Row 6: AI Optimization Fields */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Featured Items</label>
            {isEditing ? (
              <div className="tag-input-container">
                <div className="tag-input-field">
                  <input
                    type="text"
                    className="form-input"
                    value={featuredItemInput}
                    onChange={(e) => setFeaturedItemInput(e.target.value)}
                    placeholder="Enter a featured item (e.g., signature pizza)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeaturedItem();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn-add-tag"
                    onClick={handleAddFeaturedItem}
                    disabled={!featuredItemInput.trim()}
                  >
                    Add
                  </button>
                </div>
                <div className="tag-list">
                  {Array.isArray(formData.featured_items) && formData.featured_items.map((item, index) => (
                    <div key={index} className="tag-item">
                      <span className="tag-text">{item}</span>
                      <button
                        type="button"
                        className="tag-remove"
                        onClick={() => handleRemoveFeaturedItem(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <p className="form-help-text small">Press Enter or click Add to add each featured item</p>
              </div>
            ) : (
              <div className="form-display">
                {Array.isArray(formData.featured_items) && formData.featured_items.length > 0
                  ? formData.featured_items.join(', ')
                  : 'Not specified'
                }
              </div>
            )}
          </div>


        </div>

        {/* Row 7: Business Features (always visible) */}
        <div className="form-row">
          <div className="form-group full-width">
            <label className="form-label">Business Features</label>
            {isEditing ? (
              <>
                <p className="form-help-text">
                  Select up to 5 features that best describe your business type and service delivery.
                  Selected: {(formData.static_tags || []).length}/5
                </p>
                <div className="tag-selector">
                  {config.staticTags.map(tag => {
                    const isSelected = (formData.static_tags || []).includes(tag.value);
                    const canSelect = (formData.static_tags || []).length < 5 || isSelected;
                    
                    return (
                      <div
                        key={tag.value}
                        className={`tag-option ${isSelected ? 'selected' : ''}`}
                        onClick={() => canSelect && handleTagToggle(tag.value)}
                        style={{ 
                          opacity: canSelect ? 1 : 0.3,
                          cursor: canSelect ? 'pointer' : 'not-allowed'
                        }}
                      >
                        {tag.label}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="form-display">
                {formData.static_tags && formData.static_tags.length > 0 ? 
                  formData.static_tags
                    .map(tagValue => config.staticTags.find(tag => tag.value === tagValue)?.label || tagValue)
                    .join(', ')
                  : 'Not specified'
                }
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Accessibility & Experience */}
        <div className="form-section-header">
          <h3>Accessibility & Experience</h3>
        </div>
        <div className="form-row">
          <div className="form-group full-width">
            <label className="form-label">Payment Methods</label>
            {isEditing ? (
              <>
                <p className="form-help-text">Select all payment methods you accept</p>
                <div className="checkbox-grid">
                  {config.paymentMethods.map(method => {
                    const isSelected = (formData.payment_methods || []).includes(method.value);
                    return (
                      <label key={method.value} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleArrayToggle('payment_methods', method.value)}
                        />
                        <span className="checkbox-label">{method.label}</span>
                      </label>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="form-display">
                {formData.payment_methods && formData.payment_methods.length > 0 ? 
                  formData.payment_methods
                    .map(methodValue => config.paymentMethods.find(method => method.value === methodValue)?.label || methodValue)
                    .join(', ')
                  : 'Not specified'
                }
              </div>
            )}
          </div>
        </div>

        {/* Row 9: Enhanced Accessibility Features */}
        <div className="form-row">
          <div className="form-group full-width">
            <label className="form-label">Accessibility Features</label>
            {isEditing ? (
              <>
                <p className="form-help-text">Select all accessibility features available at your business</p>
                <div className="checkbox-grid two-column">
                  {config.accessibilityFeatures.map(feature => {
                    const isSelected = (formData.accessibility_features || []).includes(feature.value);
                    return (
                      <label key={feature.value} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleArrayToggle('accessibility_features', feature.value)}
                        />
                        <span className="checkbox-label">{feature.label}</span>
                      </label>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="form-display">
                {formData.accessibility_features && formData.accessibility_features.length > 0 ? 
                  formData.accessibility_features
                    .map(featureValue => config.accessibilityFeatures.find(feature => feature.value === featureValue)?.label || featureValue)
                    .join(', ')
                  : 'Not specified'
                }
              </div>
            )}
          </div>
        </div>

        {/* Row 10: Languages Spoken */}
        <div className="form-row">
          <div className="form-group full-width">
            <label className="form-label">Languages Spoken</label>
            {isEditing ? (
              <>
                <p className="form-help-text">Select languages your staff can communicate in</p>
                <div className="language-grid">
                  {config.languages.slice(0, 12).map(language => {
                    const isSelected = (formData.languages_spoken || []).includes(language);
                    return (
                      <label key={language} className="checkbox-item language-item">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleArrayToggle('languages_spoken', language)}
                        />
                        <span className="checkbox-label">{language}</span>
                      </label>
                    );
                  })}
                </div>
                {config.languages.length > 12 && (
                  <details className="additional-languages">
                    <summary className="form-help-text">More languages...</summary>
                    <div className="language-grid">
                      {config.languages.slice(12).map(language => {
                        const isSelected = (formData.languages_spoken || []).includes(language);
                        return (
                          <label key={language} className="checkbox-item language-item">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleArrayToggle('languages_spoken', language)}
                            />
                            <span className="checkbox-label">{language}</span>
                          </label>
                        );
                      })}
                    </div>
                  </details>
                )}
              </>
            ) : (
              <div className="form-display">
                {formData.languages_spoken && formData.languages_spoken.length > 0 ? 
                  formData.languages_spoken.join(', ')
                  : 'Not specified'
                }
              </div>
            )}
          </div>
        </div>

        {/* Section 5: Service Area & Operations */}
        <div className="form-section-header">
          <h3>Service Area & Operations</h3>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Coverage Radius (miles)</label>
            {isEditing ? (
              <input
                type="number"
                className="form-input"
                value={formData.service_area_details?.coverage_radius || ''}
                onChange={(e) => handleServiceAreaChange('coverage_radius', parseInt(e.target.value) || 0)}
                placeholder="25"
                min="1"
                max="500"
              />
            ) : (
              <div className="form-display">
                {formData.service_area_details?.coverage_radius ? 
                  `${formData.service_area_details.coverage_radius} miles`
                  : 'Not specified'
                }
              </div>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Additional Cities</label>
            {isEditing ? (
              <input
                type="text"
                className="form-input"
                value={(formData.service_area_details?.additional_cities || []).join(', ')}
                onChange={(e) => handleServiceAreaChange('additional_cities', e.target.value.split(',').map(city => city.trim()))}
                placeholder="Oakland, Berkeley, San Jose"
              />
            ) : (
              <div className="form-display">
                {formData.service_area_details?.additional_cities && formData.service_area_details.additional_cities.length > 0 ? 
                  formData.service_area_details.additional_cities.join(', ')
                  : 'Not specified'
                }
              </div>
            )}
          </div>
        </div>

        {/* Row 12: Enhanced Parking Information */}
        <div className="form-row">
          <div className="form-group full-width">
            <label className="form-label">Parking Information</label>
            {isEditing ? (
              <>
                <p className="form-help-text">Select available parking options</p>
                <div className="checkbox-grid">
                  {config.parkingTypes.map(type => {
                    const isSelected = (formData.enhanced_parking_info?.types || []).includes(type.value);
                    return (
                      <label key={type.value} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            const currentTypes = formData.enhanced_parking_info?.types || [];
                            const newTypes = isSelected 
                              ? currentTypes.filter(t => t !== type.value)
                              : [...currentTypes, type.value];
                            handleParkingChange('types', newTypes);
                          }}
                        />
                        <span className="checkbox-label">{type.label}</span>
                      </label>
                    );
                  })}
                </div>
                <textarea
                  className="form-textarea"
                  value={formData.enhanced_parking_info?.notes || ''}
                  onChange={(e) => handleParkingChange('notes', e.target.value)}
                  placeholder="Additional parking details..."
                  rows={2}
                />
              </>
            ) : (
              <div className="form-display">
                {formData.enhanced_parking_info?.types && formData.enhanced_parking_info.types.length > 0 ? (
                  <>
                    {formData.enhanced_parking_info.types
                      .map(typeValue => config.parkingTypes.find(type => type.value === typeValue)?.label || typeValue)
                      .join(', ')}
                    {formData.enhanced_parking_info.notes && (
                      <div className="form-notes">{formData.enhanced_parking_info.notes}</div>
                    )}
                  </>
                ) : 'Not specified'}
              </div>
            )}
          </div>
        </div>

        {/* Row 13: Enhanced Availability Policy */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Availability Policy</label>
            {isEditing ? (
              <select
                className="form-select"
                value={formData.availability_policy?.type || 'contact-for-availability'}
                onChange={(e) => handleAvailabilityChange('type', e.target.value)}
              >
                {config.availabilityPolicies.map(policy => (
                  <option key={policy.value} value={policy.value}>
                    {policy.label}
                  </option>
                ))}
              </select>
            ) : (
              <div className="form-display">
                {formData.availability_policy?.type ? 
                  config.availabilityPolicies.find(policy => policy.value === formData.availability_policy?.type)?.label || formData.availability_policy.type
                  : 'Contact for availability'
                }
              </div>
            )}
          </div>
          {formData.availability_policy?.type === 'custom' && (
            <div className="form-group">
              <label className="form-label">Custom Availability Details</label>
              {isEditing ? (
                <input
                  type="text"
                  className="form-input"
                  value={formData.availability_policy?.custom_text || ''}
                  onChange={(e) => handleAvailabilityChange('custom_text', e.target.value)}
                  placeholder="Describe your availability policy..."
                />
              ) : (
                <div className="form-display">
                  {formData.availability_policy?.custom_text || 'Not specified'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section 6: Recognition & Social Media */}
        <div className="form-section-header">
          <h3>Recognition & Social Media</h3>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Awards</label>
            {isEditing ? (
              <div className="tag-input-container">
                <div className="tag-input-field">
                  <input
                    type="text"
                    className="form-input"
                    value={awardInput}
                    onChange={(e) => setAwardInput(e.target.value)}
                    placeholder="Enter an award (e.g., Best Local Business 2024)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddAward();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn-add-tag"
                    onClick={handleAddAward}
                    disabled={!awardInput.trim()}
                  >
                    Add
                  </button>
                </div>
                <div className="tag-list">
                  {Array.isArray(formData.awards) && formData.awards.map((award, index) => (
                    <div key={index} className="tag-item">
                      <span className="tag-text">{award}</span>
                      <button
                        type="button"
                        className="tag-remove"
                        onClick={() => handleRemoveAward(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <p className="form-help-text small">Press Enter or click Add to add each award</p>
              </div>
            ) : (
              <div className="form-display">
                {formData.awards && formData.awards.length > 0 ? 
                  formData.awards.join(', ')
                  : 'Not specified'
                }
              </div>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Certifications</label>
            {isEditing ? (
              <div className="tag-input-container">
                <div className="tag-input-field">
                  <input
                    type="text"
                    className="form-input"
                    value={certificationInput}
                    onChange={(e) => setCertificationInput(e.target.value)}
                    placeholder="Enter a certification (e.g., Certified Organic)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCertification();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn-add-tag"
                    onClick={handleAddCertification}
                    disabled={!certificationInput.trim()}
                  >
                    Add
                  </button>
                </div>
                <div className="tag-list">
                  {Array.isArray(formData.certifications) && formData.certifications.map((certification, index) => (
                    <div key={index} className="tag-item">
                      <span className="tag-text">{certification}</span>
                      <button
                        type="button"
                        className="tag-remove"
                        onClick={() => handleRemoveCertification(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <p className="form-help-text small">Press Enter or click Add to add each certification</p>
              </div>
            ) : (
              <div className="form-display">
                {formData.certifications && formData.certifications.length > 0 ? 
                  formData.certifications.join(', ')
                  : 'Not specified'
                }
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailsInlineForm;