import React from 'react';
import { FormSection, FormField, FormFieldDisplay, Select, TagInput } from '../../../ui/molecules';
import { Input } from '../../../ui/atoms';
import { config } from '../../../../utils/config';
import { messages } from '../../../../constants/messages';
import { Business } from '../../../../../types';

interface BusinessDetailsSectionProps {
  formData: Partial<Business>;
  isEditing: boolean;
  onFieldChange: (field: keyof Business, value: string | number | undefined) => void;
  onArrayFieldChange: (field: keyof Business, values: string[]) => void;
}

const BusinessDetailsSection: React.FC<BusinessDetailsSectionProps> = ({
  formData,
  isEditing,
  onFieldChange,
  onArrayFieldChange,
}) => {
  const priceOptions = [
    { value: '1', label: '$' },
    { value: '2', label: '$$' },
    { value: '3', label: '$$$' },
    { value: '4', label: '$$$$' },
  ];

  if (!isEditing) {
    return (
      <FormSection
        title="Business Details"
        description="Categories, services, and business characteristics"
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <FormField label="Price Positioning">
            <FormFieldDisplay>
              {formData.price_positioning ? 
                priceOptions.find(p => p.value === String(formData.price_positioning))?.label || formData.price_positioning
                : null
              }
            </FormFieldDisplay>
          </FormField>

          <FormField label="Established Year">
            <FormFieldDisplay>
              {formData.established_year}
            </FormFieldDisplay>
          </FormField>

          <FormField label="Specialties">
            <FormFieldDisplay minHeight="md">
              {formData.specialties && Array.isArray(formData.specialties) && formData.specialties.length > 0
                ? formData.specialties.join(', ')
                : 'None specified'
              }
            </FormFieldDisplay>
          </FormField>

          <FormField label="Services">
            <FormFieldDisplay minHeight="md">
              {formData.services && Array.isArray(formData.services) && formData.services.length > 0
                ? formData.services.join(', ')
                : 'None specified'
              }
            </FormFieldDisplay>
          </FormField>
        </div>

        <FormField label="Business Description">
          <FormFieldDisplay minHeight="lg">
            {formData.description}
          </FormFieldDisplay>
        </FormField>
      </FormSection>
    );
  }

  return (
    <FormSection
      title="Business Details"
      description="Categories, services, and business characteristics"
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <FormField label="Price Positioning">
          <Select
            options={priceOptions}
            value={String(formData.price_positioning || '')}
            onChange={(e) => onFieldChange('price_positioning', parseInt(e.target.value) || undefined)}
            placeholder="Select price range..."
          />
        </FormField>

        <FormField label="Established Year">
          <Input
            type="number"
            value={formData.established_year || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange('established_year', parseInt(e.target.value) || undefined)}
            placeholder="e.g., 2020"
            min="1800"
            max={new Date().getFullYear()}
          />
        </FormField>

        <FormField label="Specialties" helpText="Add your business specialties (press Enter to add)">
          <TagInput
            value={formData.specialties || []}
            onChange={(items) => onArrayFieldChange('specialties', items)}
            placeholder={messages.placeholders.specialty}
            maxItems={10}
          />
        </FormField>

        <FormField label="Services" helpText="Add your services (press Enter to add)">
          <TagInput
            value={formData.services || []}
            onChange={(items) => onArrayFieldChange('services', items)}
            placeholder={messages.placeholders.service}
            maxItems={15}
          />
        </FormField>
      </div>

      <FormField label="Business Description" helpText="Describe your business, what you do, and what makes you unique">
        <textarea
          value={formData.description || ''}
          onChange={(e) => onFieldChange('description', e.target.value)}
          placeholder={messages.placeholders.description}
          rows={4}
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

export default BusinessDetailsSection;