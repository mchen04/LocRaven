'use client';

import React from 'react';
import { BusinessSection } from '../../../ui/organisms';
import { servicesFields } from '../sectionConfigs';
import { Business } from '../../../../../types';

interface ServicesSectionProps {
  formData: Partial<Business>;
  isEditing: boolean;
  onFieldChange: (field: keyof Business, value: string | number | undefined) => void;
  onArrayFieldChange?: (field: keyof Business, values: string[]) => void;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({
  formData,
  isEditing,
  onFieldChange,
  onArrayFieldChange,
}) => {
  return (
    <BusinessSection
      title="Services & Offerings"
      description="List the main services or products your business offers"
      formData={formData}
      isEditing={isEditing}
      onFieldChange={onFieldChange}
      onArrayFieldChange={onArrayFieldChange}
      fields={servicesFields}
      variant="default"
    />
  );
};

export default ServicesSection;