'use client';


import { BusinessSection } from '../../../ui/organisms';
import { accessibilityExperienceFields } from '../sectionConfigs';
import { Business } from '../../../../../types';

interface AccessibilityExperienceSectionProps {
  formData: Partial<Business>;
  isEditing: boolean;
  onFieldChange: (field: keyof Business, value: string | number | undefined) => void;
  onArrayFieldChange?: (field: keyof Business, values: string[]) => void;
}

const AccessibilityExperienceSection: React.FC<AccessibilityExperienceSectionProps> = ({
  formData,
  isEditing,
  onFieldChange,
  onArrayFieldChange,
}) => {
  return (
    <BusinessSection
      title="Accessibility & Experience"
      description="Payment options, accessibility features, and languages"
      formData={formData}
      isEditing={isEditing}
      onFieldChange={onFieldChange}
      onArrayFieldChange={onArrayFieldChange}
      fields={accessibilityExperienceFields}
      variant="default"
    />
  );
};

export default AccessibilityExperienceSection;