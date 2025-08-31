import { FieldConfig } from '../../ui/organisms/BusinessSection';
import { config } from '../../../utils/config';

// Basic Information Section Configuration
export const basicInformationFields: FieldConfig[] = [
  {
    key: 'name',
    label: 'Business Name',
    type: 'text',
    required: true,
    placeholder: 'Enter business name'
  },
  {
    key: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    placeholder: 'business@example.com'
  },
  {
    key: 'website',
    label: 'Website',
    type: 'url',
    placeholder: 'https://www.example.com'
  },
  {
    key: 'address_state',
    label: 'State',
    type: 'select',
    required: true,
    options: config.states?.map(state => ({
      value: state.code,
      label: state.name
    })) || []
  },
  {
    key: 'primary_category',
    label: 'Primary Category',
    type: 'select',
    required: true,
    options: config.primaryCategories?.map(category => ({
      value: category.value,
      label: category.label
    })) || []
  }
];

// Contact Information Section Configuration
export const contactInformationFields: FieldConfig[] = [
  {
    key: 'phone',
    label: 'Phone Number',
    type: 'tel',
    placeholder: '(555) 123-4567'
  },
  {
    key: 'phone_country_code',
    label: 'Country Code',
    type: 'text',
    placeholder: '+1'
  },
  {
    key: 'address_street',
    label: 'Street Address',
    type: 'text',
    placeholder: '123 Main St'
  },
  {
    key: 'address_city',
    label: 'City',
    type: 'text',
    required: true,
    placeholder: 'City name'
  },
  {
    key: 'zip_code',
    label: 'ZIP Code',
    type: 'text',
    placeholder: '12345'
  }
];

// Business Details Section Configuration
export const businessDetailsFields: FieldConfig[] = [
  {
    key: 'description',
    label: 'Business Description',
    type: 'textarea',
    placeholder: 'Describe your business...',
    rows: 4,
    helpText: 'A detailed description of your business and services'
  },
  {
    key: 'year_established',
    label: 'Year Established',
    type: 'number',
    placeholder: '2020'
  },
  {
    key: 'number_of_employees',
    label: 'Number of Employees',
    type: 'select',
    options: [
      { value: '1', label: '1' },
      { value: '2-5', label: '2-5' },
      { value: '6-10', label: '6-10' },
      { value: '11-50', label: '11-50' },
      { value: '51-100', label: '51-100' },
      { value: '100+', label: '100+' }
    ]
  },
  {
    key: 'business_hours',
    label: 'Business Hours',
    type: 'textarea',
    placeholder: 'Mon-Fri: 9AM-5PM\nSat: 10AM-3PM\nSun: Closed',
    rows: 3
  }
];

// Services Section Configuration
export const servicesFields: FieldConfig[] = [
  {
    key: 'services_offered',
    label: 'Services Offered',
    type: 'tags',
    placeholder: 'Add services...',
    helpText: 'List the main services your business provides'
  },
  {
    key: 'specialties',
    label: 'Specialties',
    type: 'tags',
    placeholder: 'Add specialties...',
    helpText: 'What makes your business unique?'
  },
  {
    key: 'service_area',
    label: 'Service Area',
    type: 'text',
    placeholder: 'City, State or nationwide',
    helpText: 'Geographic area you serve'
  }
];

// Recognition & Social Section Configuration
export const recognitionSocialFields: FieldConfig[] = [
  {
    key: 'awards',
    label: 'Awards',
    type: 'tags',
    placeholder: 'Add awards...',
    helpText: 'Add awards and recognition (press Enter to add)'
  },
  {
    key: 'certifications',
    label: 'Certifications', 
    type: 'tags',
    placeholder: 'Add certifications...',
    helpText: 'Add professional certifications (press Enter to add)'
  },
  {
    key: 'social_media.instagram',
    label: 'Instagram',
    type: 'text',
    placeholder: 'username',
    helpText: 'Instagram username (without @)',
    startIcon: '@'
  },
  {
    key: 'social_media.facebook',
    label: 'Facebook',
    type: 'text',
    placeholder: 'pagename',
    helpText: 'Facebook page name or username'
  },
  {
    key: 'social_media.twitter',
    label: 'Twitter',
    type: 'text',
    placeholder: 'username',
    helpText: 'Twitter username (without @)',
    startIcon: '@'
  },
  {
    key: 'social_media.linkedin',
    label: 'LinkedIn',
    type: 'text',
    placeholder: 'company-name',
    helpText: 'LinkedIn company page name'
  }
];

// Accessibility & Experience Section Configuration
export const accessibilityExperienceFields: FieldConfig[] = [
  {
    key: 'accessibility_features',
    label: 'Accessibility Features',
    type: 'checkbox-group',
    options: [
      { value: 'wheelchair_accessible', label: 'Wheelchair Accessible' },
      { value: 'hearing_impaired_services', label: 'Hearing Impaired Services' },
      { value: 'visual_impaired_services', label: 'Visual Impaired Services' },
      { value: 'braille_materials', label: 'Braille Materials' },
      { value: 'large_print', label: 'Large Print Options' }
    ]
  },
  {
    key: 'customer_experience',
    label: 'Customer Experience Features',
    type: 'checkbox-group',
    options: [
      { value: 'online_booking', label: 'Online Booking' },
      { value: 'mobile_app', label: 'Mobile App' },
      { value: 'loyalty_program', label: 'Loyalty Program' },
      { value: 'delivery_service', label: 'Delivery Service' },
      { value: 'pickup_service', label: 'Pickup Service' }
    ]
  },
  {
    key: 'payment_methods',
    label: 'Payment Methods Accepted',
    type: 'checkbox-group',
    options: [
      { value: 'cash', label: 'Cash' },
      { value: 'credit_cards', label: 'Credit Cards' },
      { value: 'debit_cards', label: 'Debit Cards' },
      { value: 'mobile_payments', label: 'Mobile Payments' },
      { value: 'checks', label: 'Checks' },
      { value: 'financing', label: 'Financing Available' }
    ]
  }
];

// Service Area & Operations Section Configuration
export const serviceAreaOperationsFields: FieldConfig[] = [
  {
    key: 'service_radius_miles',
    label: 'Service Radius (miles)',
    type: 'number',
    placeholder: '25',
    helpText: 'How far do you travel for services?'
  },
  {
    key: 'emergency_services',
    label: 'Emergency Services Available',
    type: 'checkbox-group',
    options: [
      { value: '24_7_availability', label: '24/7 Availability' },
      { value: 'weekend_service', label: 'Weekend Service' },
      { value: 'holiday_service', label: 'Holiday Service' },
      { value: 'emergency_response', label: 'Emergency Response' }
    ]
  },
  {
    key: 'insurance_accepted',
    label: 'Insurance Accepted',
    type: 'tags',
    placeholder: 'Add insurance providers...',
    helpText: 'List insurance providers you accept'
  },
  {
    key: 'licenses',
    label: 'Licenses & Permits',
    type: 'tags',
    placeholder: 'Add licenses...',
    helpText: 'Professional licenses and permits'
  }
];

// Location & Contact Section Configuration (alternative to ContactInformation)
export const locationContactFields: FieldConfig[] = [
  {
    key: 'address_street',
    label: 'Street Address',
    type: 'text',
    placeholder: '123 Main St'
  },
  {
    key: 'address_city',
    label: 'City',
    type: 'text',
    required: true,
    placeholder: 'City name'
  },
  {
    key: 'address_state',
    label: 'State',
    type: 'select',
    required: true,
    options: config.states?.map(state => ({
      value: state.code,
      label: state.name
    })) || []
  },
  {
    key: 'zip_code',
    label: 'ZIP Code',
    type: 'text',
    placeholder: '12345'
  },
  {
    key: 'phone',
    label: 'Phone Number',
    type: 'tel',
    placeholder: '(555) 123-4567'
  },
  {
    key: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    placeholder: 'business@example.com'
  },
  {
    key: 'website',
    label: 'Website',
    type: 'url',
    placeholder: 'https://www.example.com'
  }
];