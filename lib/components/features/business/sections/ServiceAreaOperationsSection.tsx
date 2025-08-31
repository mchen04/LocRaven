
import { FormSection, FormField, Select, CheckboxGroup, TagInput } from '../../../ui/molecules';
import { Input } from '../../../ui/atoms';
import { config } from '../../../../utils/config';
import { messages } from '../../../../constants/messages';
import { Business, ParkingInfo, ServiceAreaDetails, AvailabilityPolicy } from '../../../../../types';

interface ServiceAreaOperationsSectionProps {
  formData: Partial<Business & {
    enhanced_parking_info?: ParkingInfo;
    service_area_details?: ServiceAreaDetails;
    availability_policy?: AvailabilityPolicy;
    featured_items?: string[];
  }>;
  isEditing: boolean;
  onFieldChange: (field: string, value: string | number | undefined) => void;
  onNestedFieldChange: (parentField: string, field: string, value: string | string[] | number | undefined) => void;
  onArrayFieldChange: (field: string, values: string[]) => void;
}

const ServiceAreaOperationsSection: React.FC<ServiceAreaOperationsSectionProps> = ({
  formData,
  isEditing,
  onFieldChange,
  onNestedFieldChange,
  onArrayFieldChange,
}) => {
  const parkingTypeOptions = config.parkingTypes.map(type => ({
    value: type.value,
    label: type.label,
  }));

  const availabilityOptions = config.availabilityPolicies.map(policy => ({
    value: policy.value,
    label: policy.label,
  }));

  if (!isEditing) {
    return (
      <FormSection
        title="Service Area & Operations"
        description="Service areas, parking, and operational details"
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <FormField label="Service Area">
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--gray-50)', borderRadius: '0.375rem', border: '1px solid var(--border-primary)' }}>
              {formData.service_area || 'Not specified'}
            </div>
          </FormField>

          <FormField label="Primary Service City">
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--gray-50)', borderRadius: '0.375rem', border: '1px solid var(--border-primary)' }}>
              {formData.service_area_details?.primary_city || 'Not specified'}
            </div>
          </FormField>

          <FormField label="Service Radius (miles)">
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--gray-50)', borderRadius: '0.375rem', border: '1px solid var(--border-primary)' }}>
              {formData.service_area_details?.coverage_radius || 'Not specified'}
            </div>
          </FormField>

          <FormField label="Parking Types">
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--gray-50)', borderRadius: '0.375rem', border: '1px solid var(--border-primary)', minHeight: '3rem' }}>
              {formData.enhanced_parking_info?.types && Array.isArray(formData.enhanced_parking_info.types) && formData.enhanced_parking_info.types.length > 0
                ? formData.enhanced_parking_info.types.map(type => 
                    config.parkingTypes.find(p => p.value === type)?.label || type
                  ).join(', ')
                : 'None specified'
              }
            </div>
          </FormField>

          <FormField label="Parking Notes">
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--gray-50)', borderRadius: '0.375rem', border: '1px solid var(--border-primary)', minHeight: '3rem' }}>
              {formData.enhanced_parking_info?.notes || 'None specified'}
            </div>
          </FormField>

          <FormField label="Availability Policy">
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--gray-50)', borderRadius: '0.375rem', border: '1px solid var(--border-primary)' }}>
              {formData.availability_policy?.type ? 
                config.availabilityPolicies.find(p => p.value === formData.availability_policy?.type)?.label || formData.availability_policy.type
                : 'Contact for availability'
              }
            </div>
          </FormField>

          <FormField label="Featured Items">
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--gray-50)', borderRadius: '0.375rem', border: '1px solid var(--border-primary)', minHeight: '3rem' }}>
              {formData.featured_items && Array.isArray(formData.featured_items) && formData.featured_items.length > 0
                ? formData.featured_items.join(', ')
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
      title="Service Area & Operations"
      description="Service areas, parking, and operational details"
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <FormField label="Service Area" helpText="Describe your general service area">
          <Input
            type="text"
            value={formData.service_area || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange('service_area', e.target.value)}
            placeholder="e.g., Downtown area, Surrounding suburbs"
          />
        </FormField>

        <FormField label="Primary Service City">
          <Input
            type="text"
            value={formData.service_area_details?.primary_city || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onNestedFieldChange('service_area_details', 'primary_city', e.target.value)}
            placeholder="Main city you serve"
          />
        </FormField>

        <FormField label="Service Radius (miles)">
          <Input
            type="number"
            value={formData.service_area_details?.coverage_radius || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onNestedFieldChange('service_area_details', 'coverage_radius', parseInt(e.target.value) || undefined)}
            placeholder="How far do you travel?"
            min="1"
            max="500"
          />
        </FormField>

        <FormField label="Parking Types" helpText="Select available parking options">
          <CheckboxGroup
            options={parkingTypeOptions}
            value={formData.enhanced_parking_info?.types || []}
            onChange={(values) => onNestedFieldChange('enhanced_parking_info', 'types', values)}
            columns={2}
          />
        </FormField>

        <FormField label="Parking Notes" helpText="Additional parking information">
          <textarea
            value={formData.enhanced_parking_info?.notes || ''}
            onChange={(e) => onNestedFieldChange('enhanced_parking_info', 'notes', e.target.value)}
            placeholder="Parking details, restrictions, costs, etc."
            rows={3}
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

        <FormField label="Availability Policy">
          <Select
            options={availabilityOptions}
            value={formData.availability_policy?.type || 'contact-for-availability'}
            onChange={(e) => onNestedFieldChange('availability_policy', 'type', e.target.value)}
            placeholder="Select availability policy..."
          />
        </FormField>

        <FormField label="Featured Items" helpText="Add your featured products or services">
          <TagInput
            value={formData.featured_items || []}
            onChange={(items: string[]) => onArrayFieldChange('featured_items', items)}
            placeholder="Add featured items (press Enter)"
            maxItems={10}
          />
        </FormField>
      </div>
    </FormSection>
  );
};

export default ServiceAreaOperationsSection;