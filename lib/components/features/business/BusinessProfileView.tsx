'use client';

import { Business } from '../../../../types';
import { useBusiness } from '../../../contexts/BusinessContext';
import BusinessDetailsInlineForm from './BusinessDetailsInlineForm';
import './BusinessDetailsInlineForm.css';

interface BusinessProfileViewProps {
  business?: Business | null;
}

const BusinessProfileView: React.FC<BusinessProfileViewProps> = ({ business: propBusiness }) => {
  const { business: contextBusiness, updateBusinessProfile, createBusinessProfile } = useBusiness();
  
  // Use business from props or context
  const business = propBusiness !== undefined ? propBusiness : contextBusiness;

  const handleSave = async (savedBusiness: Business) => {
    try {
      let result;
      if (business?.id) {
        // Update existing business
        result = await updateBusinessProfile(savedBusiness);
      } else {
        // Create new business
        result = await createBusinessProfile(savedBusiness);
      }
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to save profile');
      }
      
      return result;
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="business-profile-view">
      <BusinessDetailsInlineForm
        business={business || undefined}
        onSave={handleSave}
      />
    </div>
  );
};

export default BusinessProfileView;