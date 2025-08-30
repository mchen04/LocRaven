import React from 'react';
import { FormSection, FormField, TagInput } from '../../../ui/molecules';
import { Input } from '../../../ui/atoms';
import { messages } from '../../../../constants/messages';
import { Business } from '../../../../../types';

interface RecognitionSocialSectionProps {
  formData: Partial<Business & {
    awards?: string[];
    certifications?: string[];
    social_media?: Record<string, string>;
  }>;
  isEditing: boolean;
  onArrayFieldChange: (field: string, values: string[]) => void;
  onSocialMediaChange: (platform: string, value: string) => void;
}

const RecognitionSocialSection: React.FC<RecognitionSocialSectionProps> = ({
  formData,
  isEditing,
  onArrayFieldChange,
  onSocialMediaChange,
}) => {
  if (!isEditing) {
    return (
      <FormSection
        title="Recognition & Social Media"
        description="Awards, certifications, and social media presence"
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <FormField label="Awards">
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--gray-50)', borderRadius: '0.375rem', border: '1px solid var(--border-primary)', minHeight: '3rem' }}>
              {formData.awards && Array.isArray(formData.awards) && formData.awards.length > 0
                ? formData.awards.join(', ')
                : 'None specified'
              }
            </div>
          </FormField>

          <FormField label="Certifications">
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--gray-50)', borderRadius: '0.375rem', border: '1px solid var(--border-primary)', minHeight: '3rem' }}>
              {formData.certifications && Array.isArray(formData.certifications) && formData.certifications.length > 0
                ? formData.certifications.join(', ')
                : 'None specified'
              }
            </div>
          </FormField>

          <FormField label="Instagram">
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--gray-50)', borderRadius: '0.375rem', border: '1px solid var(--border-primary)' }}>
              {formData.social_media?.instagram ? (
                <a href={`https://instagram.com/${formData.social_media.instagram}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>
                  @{formData.social_media.instagram}
                </a>
              ) : (
                'Not specified'
              )}
            </div>
          </FormField>

          <FormField label="Facebook">
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--gray-50)', borderRadius: '0.375rem', border: '1px solid var(--border-primary)' }}>
              {formData.social_media?.facebook ? (
                <a href={`https://facebook.com/${formData.social_media.facebook}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>
                  {formData.social_media.facebook}
                </a>
              ) : (
                'Not specified'
              )}
            </div>
          </FormField>

          <FormField label="Twitter">
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--gray-50)', borderRadius: '0.375rem', border: '1px solid var(--border-primary)' }}>
              {formData.social_media?.twitter ? (
                <a href={`https://twitter.com/${formData.social_media.twitter}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>
                  @{formData.social_media.twitter}
                </a>
              ) : (
                'Not specified'
              )}
            </div>
          </FormField>

          <FormField label="LinkedIn">
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--gray-50)', borderRadius: '0.375rem', border: '1px solid var(--border-primary)' }}>
              {formData.social_media?.linkedin ? (
                <a href={`https://linkedin.com/company/${formData.social_media.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>
                  {formData.social_media.linkedin}
                </a>
              ) : (
                'Not specified'
              )}
            </div>
          </FormField>
        </div>
      </FormSection>
    );
  }

  return (
    <FormSection
      title="Recognition & Social Media"
      description="Awards, certifications, and social media presence"
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <FormField label="Awards" helpText="Add awards and recognition (press Enter to add)">
          <TagInput
            value={formData.awards || []}
            onChange={(items: string[]) => onArrayFieldChange('awards', items)}
            placeholder={messages.placeholders.award}
            maxItems={8}
          />
        </FormField>

        <FormField label="Certifications" helpText="Add professional certifications (press Enter to add)">
          <TagInput
            value={formData.certifications || []}
            onChange={(items: string[]) => onArrayFieldChange('certifications', items)}
            placeholder={messages.placeholders.certification}
            maxItems={8}
          />
        </FormField>

        <FormField label="Instagram" helpText="Instagram username (without @)">
          <Input
            type="text"
            value={formData.social_media?.instagram || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSocialMediaChange('instagram', e.target.value)}
            placeholder="username"
            startIcon={<span style={{ color: 'var(--text-muted)' }}>@</span>}
          />
        </FormField>

        <FormField label="Facebook" helpText="Facebook page name or username">
          <Input
            type="text"
            value={formData.social_media?.facebook || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSocialMediaChange('facebook', e.target.value)}
            placeholder="pagename"
          />
        </FormField>

        <FormField label="Twitter" helpText="Twitter username (without @)">
          <Input
            type="text"
            value={formData.social_media?.twitter || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSocialMediaChange('twitter', e.target.value)}
            placeholder="username"
            startIcon={<span style={{ color: 'var(--text-muted)' }}>@</span>}
          />
        </FormField>

        <FormField label="LinkedIn" helpText="LinkedIn company page name">
          <Input
            type="text"
            value={formData.social_media?.linkedin || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSocialMediaChange('linkedin', e.target.value)}
            placeholder="company-name"
          />
        </FormField>
      </div>
    </FormSection>
  );
};

export default RecognitionSocialSection;