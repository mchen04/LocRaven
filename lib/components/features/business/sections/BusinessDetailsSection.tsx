import React from 'react';
import { BusinessSection } from '../../../ui/organisms';
import { businessDetailsFields } from '../sectionConfigs';
import { Business } from '../../../../../types';

interface BusinessDetailsSectionProps {
  formData: Partial<Business>;
  isEditing: boolean;
  onFieldChange: (field: keyof Business, value: string | number | undefined) => void;
  onArrayFieldChange?: (field: keyof Business, values: string[]) => void;
}

const BusinessDetailsSection: React.FC<BusinessDetailsSectionProps> = ({
  formData,
  isEditing,
  onFieldChange,
  onArrayFieldChange,
}) => {
  return (
    <BusinessSection
      title="Business Details"
      description="Categories, services, and business characteristics"
      formData={formData}
      isEditing={isEditing}
      onFieldChange={onFieldChange}
      fields={businessDetailsFields}
      variant="default"
    />
  );
};

export default BusinessDetailsSection;