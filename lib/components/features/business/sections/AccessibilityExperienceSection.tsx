import React from 'react';
import { FormSection, FormField, CheckboxGroup, TagInput } from '../../../ui/molecules';
import { config } from '../../../../utils/config';
import { messages } from '../../../../constants/messages';
import { Business } from '../../../../../types';

interface AccessibilityExperienceSectionProps {
  formData: Partial<Business & { 
    payment_methods?: string[];
    accessibility_features?: string[];
    languages_spoken?: string[];
    static_tags?: string[];
  }>;
  isEditing: boolean;
  onArrayFieldChange: (field: string, values: string[]) => void;
}

const AccessibilityExperienceSection: React.FC<AccessibilityExperienceSectionProps> = ({
  formData,
  isEditing,
  onArrayFieldChange,
}) => {
  const paymentMethodOptions = (config.paymentMethods || []).map((method: any) => ({
    value: method.value || method,
    label: method.label || method,
  }));

  const accessibilityOptions = (config.accessibilityFeatures || []).map((feature: any) => ({
    value: feature.value || feature,
    label: feature.label || feature,
  }));

  const languageOptions = (config.languages || []).map((language: string) => ({
    value: language,
    label: language,
  }));

  if (!isEditing) {
    return (
      <FormSection
        title="Accessibility & Experience"
        description="Payment options, accessibility features, and languages"
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <FormField label="Payment Methods">
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--gray-50)', borderRadius: '0.375rem', border: '1px solid var(--border-primary)', minHeight: '3rem' }}>
              {formData.payment_methods && Array.isArray(formData.payment_methods) && formData.payment_methods.length > 0
                ? formData.payment_methods.map((method: any) => 
                    config.paymentMethods.find((p: any) => p.value === method || p === method)?.label || method
                  ).join(', ')
                : 'None specified'
              }
            </div>
          </FormField>

          <FormField label="Accessibility Features">
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--gray-50)', borderRadius: '0.375rem', border: '1px solid var(--border-primary)', minHeight: '3rem' }}>
              {formData.accessibility_features && Array.isArray(formData.accessibility_features) && formData.accessibility_features.length > 0
                ? formData.accessibility_features.map((feature: any) => 
                    config.accessibilityFeatures.find((a: any) => a.value === feature || a === feature)?.label || feature
                  ).join(', ')
                : 'None specified'
              }
            </div>
          </FormField>

          <FormField label="Languages Spoken">
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--gray-50)', borderRadius: '0.375rem', border: '1px solid var(--border-primary)', minHeight: '3rem' }}>
              {formData.languages_spoken && Array.isArray(formData.languages_spoken) && formData.languages_spoken.length > 0
                ? formData.languages_spoken.join(', ')
                : 'None specified'
              }
            </div>
          </FormField>

          <FormField label="Business Features">
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--gray-50)', borderRadius: '0.375rem', border: '1px solid var(--border-primary)', minHeight: '3rem' }}>
              {formData.static_tags && Array.isArray(formData.static_tags) && formData.static_tags.length > 0
                ? formData.static_tags.join(', ')
                : 'None specified'
              }
            </div>
          </FormField>
        </div>
      </FormSection>
    );
  }

  return (
    <FormSection
      title="Accessibility & Experience"
      description="Payment options, accessibility features, and languages"
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <FormField label="Payment Methods" helpText="Select accepted payment methods">
          <CheckboxGroup
            options={paymentMethodOptions}
            value={formData.payment_methods || []}
            onChange={(values) => onArrayFieldChange('payment_methods', values)}
            columns={2}
            maxSelections={10}
          />
        </FormField>

        <FormField label="Accessibility Features" helpText="Select accessibility features available">
          <CheckboxGroup
            options={accessibilityOptions}
            value={formData.accessibility_features || []}
            onChange={(values) => onArrayFieldChange('accessibility_features', values)}
            columns={1}
            maxSelections={8}
          />
        </FormField>

        <FormField label="Languages Spoken" helpText="Select languages spoken at your business">
          <CheckboxGroup
            options={languageOptions}
            value={formData.languages_spoken || []}
            onChange={(values) => onArrayFieldChange('languages_spoken', values)}
            columns={2}
            maxSelections={6}
          />
        </FormField>

        <FormField label="Business Features" helpText="Add key business features and tags (max 5)">
          <TagInput
            value={formData.static_tags || []}
            onChange={(items: string[]) => onArrayFieldChange('static_tags', items)}
            placeholder="Add business features"
            maxItems={5}
          />
        </FormField>
      </div>
    </FormSection>
  );
};

export default AccessibilityExperienceSection;