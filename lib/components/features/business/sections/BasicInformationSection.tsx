
import { BusinessSection } from '../../../ui/organisms';
import { basicInformationFields } from '../sectionConfigs';
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
  return (
    <BusinessSection
      title="Basic Information"
      description="Core business details and contact information"
      formData={formData}
      isEditing={isEditing}
      onFieldChange={onFieldChange}
      fields={basicInformationFields}
      variant="default"
    />
  );
};

export default BasicInformationSection;