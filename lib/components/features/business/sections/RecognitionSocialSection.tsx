'use client';

import React from 'react';
import { BusinessSection } from '../../../ui/organisms';
import { recognitionSocialFields } from '../sectionConfigs';
import { Business } from '../../../../../types';

interface RecognitionSocialSectionProps {
  formData: Partial<Business & {
    awards?: string[];
    certifications?: string[];
    social_media?: Record<string, string>;
  }>;
  isEditing: boolean;
  onFieldChange: (field: keyof Business, value: string | number | undefined) => void;
  onArrayFieldChange?: (field: string, values: string[]) => void;
  onSocialMediaChange?: (platform: string, value: string) => void;
}

const RecognitionSocialSection: React.FC<RecognitionSocialSectionProps> = ({
  formData,
  isEditing,
  onFieldChange,
  onArrayFieldChange,
}) => {
  return (
    <BusinessSection
      title="Recognition & Social Media"
      description="Awards, certifications, and social media presence"
      formData={formData}
      isEditing={isEditing}
      onFieldChange={onFieldChange}
      onArrayFieldChange={onArrayFieldChange}
      fields={recognitionSocialFields}
      variant="default"
    />
  );
};

export default RecognitionSocialSection;