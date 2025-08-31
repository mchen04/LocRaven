'use client';


import { BusinessSection } from '../../../ui/organisms';
import { contactInformationFields } from '../sectionConfigs';
import { Business } from '../../../../../types';

interface ContactInformationSectionProps {
  formData: Partial<Business>;
  isEditing: boolean;
  onFieldChange: (field: keyof Business, value: string | number | undefined) => void;
}

const ContactInformationSection: React.FC<ContactInformationSectionProps> = ({
  formData,
  isEditing,
  onFieldChange
}) => {
  return (
    <BusinessSection
      title="Location & Contact"
      description="Contact information and business location"
      formData={formData}
      isEditing={isEditing}
      onFieldChange={onFieldChange}
      fields={contactInformationFields}
      variant="default"
    />
  );
};

export default ContactInformationSection;