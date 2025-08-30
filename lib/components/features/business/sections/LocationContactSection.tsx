import React from 'react';
import { FormSection, FormField, Select } from '../../../ui/molecules';
import { Input } from '../../../ui/atoms';
import { config } from '../../../../utils/config';
import { messages } from '../../../../constants/messages';
import { Business } from '../../../../../types';

interface LocationContactSectionProps {
  formData: Partial<Business>;
  isEditing: boolean;
  onFieldChange: (field: keyof Business, value: string | number | undefined) => void;
}

const LocationContactSection: React.FC<LocationContactSectionProps> = ({
  formData,
  isEditing,
  onFieldChange,
}) => {
  const stateOptions = config.states.map(state => ({
    value: state.code,
    label: state.name,
  }));

  const countryCodeOptions = config.countryCodes.map(code => ({
    value: code.value,
    label: code.label,
  }));

  if (!isEditing) {
    return (
      <FormSection
        title="Location & Contact"
        description="Address details and contact information"
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <FormField label="Street Address">
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--gray-50)', borderRadius: '0.375rem', border: '1px solid var(--border-primary)' }}>
              {formData.address_street || 'Not specified'}
            </div>
          </FormField>

          <FormField label="ZIP Code">
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--gray-50)', borderRadius: '0.375rem', border: '1px solid var(--border-primary)' }}>
              {formData.zip_code || 'Not specified'}
            </div>
          </FormField>

          <FormField label="Country">
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--gray-50)', borderRadius: '0.375rem', border: '1px solid var(--border-primary)' }}>
              {formData.country ? 
                config.countryCodes.find(c => c.value === formData.country)?.label || formData.country
                : 'Not specified'
              }
            </div>
          </FormField>

          <FormField label="Phone">
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--gray-50)', borderRadius: '0.375rem', border: '1px solid var(--border-primary)' }}>
              {formData.phone ? `${formData.phone_country_code || '+1'} ${formData.phone}` : 'Not specified'}
            </div>
          </FormField>

          <FormField label="Hours">
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--gray-50)', borderRadius: '0.375rem', border: '1px solid var(--border-primary)', minHeight: '4rem' }}>
              {formData.hours || 'Not specified'}
            </div>
          </FormField>
        </div>
      </FormSection>
    );
  }

  return (
    <FormSection
      title="Location & Contact"
      description="Address details and contact information"
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <FormField label="Street Address">
          <Input
            type="text"
            value={formData.address_street || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange('address_street', e.target.value)}
            placeholder={messages.placeholders.address}
          />
        </FormField>

        <FormField label="ZIP Code">
          <Input
            type="text"
            value={formData.zip_code || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange('zip_code', e.target.value)}
            placeholder={messages.placeholders.zipCode}
          />
        </FormField>

        <FormField label="Country">
          <Select
            options={countryCodeOptions}
            value={formData.country || 'US'}
            onChange={(e) => onFieldChange('country', e.target.value)}
            placeholder="Select country..."
          />
        </FormField>

        <FormField label="Phone Country Code">
          <Select
            options={config.countryCodes.map(code => ({
              value: code.value.startsWith('+') ? code.value : `+${code.value}`,
              label: `${code.label} (${code.value.startsWith('+') ? code.value : `+${code.value}`})`,
            }))}
            value={formData.phone_country_code || '+1'}
            onChange={(e) => onFieldChange('phone_country_code', e.target.value)}
            placeholder="Select country code..."
          />
        </FormField>

        <FormField label="Phone">
          <Input
            type="tel"
            value={formData.phone || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange('phone', e.target.value)}
            placeholder={messages.placeholders.phone}
          />
        </FormField>
      </div>

      <FormField label="Business Hours" helpText="Describe your operating hours and schedule">
        <textarea
          value={formData.hours || ''}
          onChange={(e) => onFieldChange('hours', e.target.value)}
          placeholder={messages.placeholders.hours}
          rows={3}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid var(--border-primary)',
            borderRadius: '0.375rem',
            fontSize: '1rem',
            lineHeight: '1.5',
            resize: 'vertical',
            transition: 'border-color 0.2s ease',
            fontFamily: 'inherit',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary)';
            e.currentTarget.style.boxShadow = '0 0 0 3px var(--primary)1A';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-primary)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      </FormField>
    </FormSection>
  );
};

export default LocationContactSection;