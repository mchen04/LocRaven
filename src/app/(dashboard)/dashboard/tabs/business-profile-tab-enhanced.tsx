'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { upsertBusinessProfile } from '@/features/business/controllers/upsert-business-profile';
import { 
  businessProfileSchema, 
  categoryOptions, 
  pricePositioningOptions,
  paymentMethodOptions,
  languageOptions,
  accessibilityOptions,
  countryOptions,
  phoneCountryCodes
} from '@/features/business/types/business-profile-form';
import { BusinessProfile, businessToFormState, formStateToBusinessData } from '@/features/business/types/business-types';
import { Constants } from '@/libs/supabase/types';

interface BusinessProfileTabProps {
  initialData?: BusinessProfile | null;
}

export function BusinessProfileTabEnhanced({ initialData }: BusinessProfileTabProps) {
  const { toast } = useToast();
  
  // Basic Information
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('+1');
  
  // Address
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('US');
  
  // Business Details
  const [category, setCategory] = useState('');
  const [establishedYear, setEstablishedYear] = useState('');
  const [hours, setHours] = useState('');
  const [parkingInfo, setParkingInfo] = useState('');
  const [pricePositioning, setPricePositioning] = useState('');
  const [serviceArea, setServiceArea] = useState('');
  
  // Arrays
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<string[]>(['Cash', 'Credit Card']);
  const [languagesSpoken, setLanguagesSpoken] = useState<string[]>(['English']);
  const [accessibilityFeatures, setAccessibilityFeatures] = useState<string[]>([]);
  const [staticTags, setStaticTags] = useState<string[]>([]);
  
  // Social Media
  const [socialMedia, setSocialMedia] = useState({
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    youtube: '',
  });
  
  // FAQs
  const [businessFaqs, setBusinessFaqs] = useState<Array<{ question: string; answer: string }>>([]);
  
  // Form State
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('basic');

  // Load initial data
  useEffect(() => {
    if (initialData) {
      const formData = businessToFormState(initialData);
      setBusinessName(formData.businessName || '');
      setBusinessDescription(formData.businessDescription || '');
      setWebsite(formData.website || '');
      setPhoneNumber(formData.phoneNumber || '');
      setPhoneCountryCode(formData.phoneCountryCode || '+1');
      setAddress(formData.address || '');
      setCity(formData.city || '');
      setState(formData.state || '');
      setZipCode(formData.zipCode || '');
      setCountry(formData.country || 'US');
      setCategory(formData.category || '');
      setEstablishedYear(formData.establishedYear || '');
      setHours(formData.hours || '');
      setParkingInfo(formData.parkingInfo || '');
      setPricePositioning(formData.pricePositioning || '');
      setServiceArea(formData.serviceArea || '');
      setSpecialties(formData.specialties || []);
      setServices(formData.services || []);
      setPaymentMethods(formData.paymentMethods || ['Cash', 'Credit Card']);
      setLanguagesSpoken(formData.languagesSpoken || ['English']);
      setAccessibilityFeatures(formData.accessibilityFeatures || []);
      setStaticTags(formData.staticTags || []);
      setSocialMedia(formData.socialMedia || {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        youtube: '',
      });
      setBusinessFaqs(formData.businessFaqs || []);
    }
  }, [initialData]);

  const validateForm = () => {
    const formData = {
      name: businessName,
      description: businessDescription,
      website,
      phone: phoneNumber,
      phone_country_code: phoneCountryCode,
      address_street: address,
      address_city: city,
      address_state: state,
      zip_code: zipCode,
      country,
      primary_category: category,
      established_year: establishedYear ? parseInt(establishedYear) : undefined,
      hours,
      parking_info: parkingInfo,
      price_positioning: pricePositioning,
      service_area: serviceArea,
      static_tags: staticTags,
      specialties,
      services,
      payment_methods: paymentMethods,
      languages_spoken: languagesSpoken,
      accessibility_features: accessibilityFeatures,
      social_media: socialMedia,
      business_faqs: businessFaqs,
    };

    const result = businessProfileSchema.safeParse(formData);
    
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        newErrors[field] = issue.message;
      });
      setErrors(newErrors);
      return false;
    }
    
    setErrors({});
    return true;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors below and try again.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    
    const formState = {
      businessName,
      businessDescription,
      website,
      phoneNumber,
      phoneCountryCode,
      address,
      city,
      state,
      zipCode,
      country,
      category,
      establishedYear,
      hours,
      parkingInfo,
      pricePositioning,
      serviceArea,
      specialties,
      services,
      paymentMethods,
      languagesSpoken,
      accessibilityFeatures,
      staticTags,
      socialMedia,
      businessFaqs,
      isSaving: true,
      errors: {},
    };

    const businessData = formStateToBusinessData(formState);

    try {
      const result = await upsertBusinessProfile(businessData);
      
      if (result.success) {
        toast({
          title: 'Success!',
          description: 'Business profile saved successfully.',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to save business profile.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Helper functions for array management
  const addToArray = (arr: string[], setArr: (arr: string[]) => void, value: string) => {
    if (value && !arr.includes(value)) {
      setArr([...arr, value]);
    }
  };

  const removeFromArray = (arr: string[], setArr: (arr: string[]) => void, value: string) => {
    setArr(arr.filter(item => item !== value));
  };

  const addFaq = () => {
    setBusinessFaqs([...businessFaqs, { question: '', answer: '' }]);
  };

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = businessFaqs.map((faq, i) => 
      i === index ? { ...faq, [field]: value } : faq
    );
    setBusinessFaqs(updated);
  };

  const removeFaq = (index: number) => {
    setBusinessFaqs(businessFaqs.filter((_, i) => i !== index));
  };

  return (
    <div className='space-y-6'>
      {/* Tab Navigation */}
      <div className='border-b border-zinc-700'>
        <nav className='flex space-x-8'>
          {[
            { id: 'basic', label: 'Basic Information' },
            { id: 'details', label: 'Business Details' },
            { id: 'services', label: 'Services & Features' },
            { id: 'social', label: 'Social & Contact' },
            { id: 'faqs', label: 'FAQs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-white text-white'
                  : 'border-transparent text-zinc-400 hover:text-zinc-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Basic Information Tab */}
      {activeTab === 'basic' && (
        <div className='space-y-6'>
          <Card title='Business Information'>
            <div className='space-y-4'>
              <div>
                <label className='mb-2 block text-sm font-medium text-white'>
                  Business Name *
                </label>
                <Input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className={`bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600 ${
                    errors.name ? 'border-red-500' : ''
                  }`}
                  placeholder='Enter your business name'
                />
                {errors.name && <p className='mt-1 text-sm text-red-500'>{errors.name}</p>}
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium text-white'>
                  Business Description
                </label>
                <textarea
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  className='min-h-24 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-400 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600'
                  placeholder='Describe your business and what you offer...'
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='mb-2 block text-sm font-medium text-white'>Website</label>
                  <Input
                    type='url'
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className={`bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600 ${
                      errors.website ? 'border-red-500' : ''
                    }`}
                    placeholder='https://yourwebsite.com'
                  />
                  {errors.website && <p className='mt-1 text-sm text-red-500'>{errors.website}</p>}
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-white'>
                    Category & Year
                  </label>
                  <div className='flex gap-2'>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className='flex-1 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-zinc-600'
                    >
                      <option value=''>Select category</option>
                      {categoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <Input
                      type='number'
                      value={establishedYear}
                      onChange={(e) => setEstablishedYear(e.target.value)}
                      className='w-24 bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600'
                      placeholder='2020'
                      min='1800'
                      max={new Date().getFullYear()}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card title='Contact & Location'>
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='mb-2 block text-sm font-medium text-white'>Phone Number</label>
                  <div className='flex gap-2'>
                    <select
                      value={phoneCountryCode}
                      onChange={(e) => setPhoneCountryCode(e.target.value)}
                      className='w-24 rounded-md border border-zinc-700 bg-zinc-800 px-2 py-2 text-white'
                    >
                      {phoneCountryCodes.map((code) => (
                        <option key={code.value} value={code.value}>
                          {code.value}
                        </option>
                      ))}
                    </select>
                    <Input
                      type='tel'
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className={`flex-1 bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600 ${
                        errors.phone ? 'border-red-500' : ''
                      }`}
                      placeholder='5551234567'
                    />
                  </div>
                  {errors.phone && <p className='mt-1 text-sm text-red-500'>{errors.phone}</p>}
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-white'>Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className='w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white'
                  >
                    {countryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium text-white'>Street Address</label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600'
                  placeholder='123 Main Street'
                />
              </div>

              <div className='grid grid-cols-3 gap-4'>
                <div>
                  <label className='mb-2 block text-sm font-medium text-white'>City</label>
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600'
                    placeholder='San Francisco'
                  />
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-white'>State</label>
                  <Input
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600'
                    placeholder='CA'
                  />
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-white'>ZIP Code</label>
                  <Input
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600'
                    placeholder='94102'
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Save Button */}
      <div className='flex justify-end'>
        <Button onClick={handleSaveProfile} disabled={isSaving} className='px-8'>
          {isSaving ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </div>
  );
}

// Reuse the Card component pattern
function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className='w-full rounded-md bg-zinc-900'>
      <div className='p-4'>
        <h2 className='mb-4 text-xl font-semibold text-white'>{title}</h2>
        <div>{children}</div>
      </div>
    </div>
  );
}