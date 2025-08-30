import React from 'react';
import { FormSection, FormField, FormFieldDisplay, Select } from '../../../ui/molecules';
import { Input } from '../../../ui/atoms';
import { config } from '../../../../utils/config';
import { messages } from '../../../../constants/messages';
import { Business } from '../../../../../types';

interface BasicInformationSectionProps {
  formData: Partial<Business>;
  isEditing: boolean;
  onFieldChange: (field: keyof Business, value: string | number | undefined) => void;
}

const BasicInformationSection: React.FC<BasicInformationSectionProps> = ({
  formData,
  isEditing,
  onFieldChange,
}) => {
  const stateOptions = config.states.map(state => ({
    value: state.code,
    label: state.name,
  }));

  const categoryOptions = config.primaryCategories.map(category => ({
    value: category.value,
    label: category.label,
  }));


  if (!isEditing) {
    return (
      <FormSection
        title="Basic Information"
        description="Core business details and contact information"
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <FormField label="Business Name">
            <FormFieldDisplay>
              {formData.name}
            </FormFieldDisplay>
          </FormField>

          <FormField label="Email">
            <FormFieldDisplay>
              {formData.email}
            </FormFieldDisplay>
          </FormField>

          <FormField label="Website">
            <FormFieldDisplay>
              {formData.website ? (
                <a href={formData.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>
                  {formData.website}
                </a>
              ) : (
                'Not specified'
              )}
            </FormFieldDisplay>
          </FormField>

          <FormField label="Primary Category">
            <FormFieldDisplay>
              {formData.primary_category ? 
                config.primaryCategories.find(c => c.value === formData.primary_category)?.label || formData.primary_category
                : null
              }
            </FormFieldDisplay>
          </FormField>

          <FormField label="City">
            <FormFieldDisplay>
              {formData.address_city}
            </FormFieldDisplay>
          </FormField>

          <FormField label="State">
            <FormFieldDisplay>
              {formData.address_state ? 
                config.states.find(s => s.code === formData.address_state)?.name || formData.address_state
                : null
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
      title="Basic Information"
      description="Core business details and contact information"
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <FormField label="Business Name" required>
          <Input
            type="text"
            value={formData.name || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange('name', e.target.value)}
            placeholder={messages.placeholders.businessName}
            required
          />
        </FormField>

        <FormField label="Email">
          <Input
            type="email"
            value={formData.email || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange('email', e.target.value)}
            placeholder={messages.placeholders.email}
          />
        </FormField>

        <FormField label="Website">
          <Input
            type="url"
            value={formData.website || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange('website', e.target.value)}
            placeholder={messages.placeholders.website}
          />
        </FormField>

        <FormField label="Primary Category">
          <Select
            options={categoryOptions}
            value={formData.primary_category || ''}
            onChange={(e) => onFieldChange('primary_category', e.target.value)}
            placeholder="Select category..."
          />
        </FormField>

        <FormField label="City" required>
          <Input
            type="text"
            value={formData.address_city || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange('address_city', e.target.value)}
            placeholder={messages.placeholders.city}
            required
          />
        </FormField>

        <FormField label="State" required>
          <Select
            options={stateOptions}
            value={formData.address_state || ''}
            onChange={(e) => onFieldChange('address_state', e.target.value)}
            placeholder="Select state..."
            required
          />
        </FormField>
      </div>

      <FormField label="Business Description" helpText="Describe your business, services, and what makes you unique">
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

export default BasicInformationSection;