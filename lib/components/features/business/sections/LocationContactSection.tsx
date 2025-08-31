'use client';

import React from 'react';
import { BusinessSection } from '../../../ui/organisms';
import { contactInformationFields } from '../sectionConfigs';
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
  return (
    <BusinessSection
      title="Location & Contact"
      description="Address details and contact information"
      formData={formData}
      isEditing={isEditing}
      onFieldChange={onFieldChange}
      fields={contactInformationFields}
      variant="default"
    />
  );
};

export default LocationContactSection;