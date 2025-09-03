'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { upsertBusinessProfile } from '@/features/business/controllers/upsert-business-profile';
import { 
  accessibilityOptions,
  businessProfileSchema, 
  categoryOptions, 
  countryOptions,
  languageOptions,
  paymentMethodOptions,
  phoneCountryCodes,
  pricePositioningOptions} from '@/features/business/types/business-profile-form';
import { BusinessProfile, businessToFormState, formStateToBusinessData } from '@/features/business/types/business-types';
import { Constants } from '@/libs/supabase/types';

interface BusinessProfileTabProps {
  initialData?: BusinessProfile | null;
}

export function BusinessProfileTab({ initialData }: BusinessProfileTabProps) {
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
  const [awards, setAwards] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<string[]>([]);
  
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
  const [activeSection, setActiveSection] = useState('basic');

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
      setAwards((initialData.awards as string[]) || []);
      setCertifications((initialData.certifications as string[]) || []);
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

  // Array input component
  const ArrayInput = ({ 
    label, 
    items, 
    setItems, 
    options, 
    placeholder = "Add item..." 
  }: {
    label: string;
    items: string[];
    setItems: (items: string[]) => void;
    options?: string[];
    placeholder?: string;
  }) => {
    const [inputValue, setInputValue] = useState('');
    
    const handleAdd = () => {
      if (inputValue && !items.includes(inputValue)) {
        setItems([...items, inputValue]);
        setInputValue('');
      }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAdd();
      }
    };

    return (
      <div>
        <label className='mb-2 block text-sm font-medium text-white'>{label}</label>
        <div className='space-y-2'>
          <div className='flex gap-2'>
            {options ? (
              <select
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className='flex-1 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-zinc-600'
              >
                <option value=''>Select {label.toLowerCase()}</option>
                {options.map((option) => (
                  <option key={option} value={option} disabled={items.includes(option)}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className='flex-1 bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600'
                placeholder={placeholder}
              />
            )}
            <Button 
              type='button' 
              onClick={handleAdd} 
              className='px-4'
              disabled={!inputValue || items.includes(inputValue)}
            >
              Add
            </Button>
          </div>
          <div className='flex flex-wrap gap-2'>
            {items.map((item, index) => (
              <span
                key={index}
                className='inline-flex items-center gap-1 bg-zinc-700 text-white px-2 py-1 rounded text-sm'
              >
                {item}
                <button
                  type='button'
                  onClick={() => removeFromArray(items, setItems, item)}
                  className='text-zinc-400 hover:text-white'
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='space-y-6'>
      {/* Section Navigation */}
      <div className='border-b border-zinc-700'>
        <nav className='flex space-x-8'>
          {[
            { id: 'basic', label: 'Basic Information' },
            { id: 'contact', label: 'Contact & Location' },
            { id: 'details', label: 'Business Details' },
            { id: 'services', label: 'Services & Features' },
            { id: 'social', label: 'Online Presence' },
            { id: 'support', label: 'Customer Support' },
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeSection === section.id
                  ? 'border-white text-white'
                  : 'border-transparent text-zinc-400 hover:text-zinc-300'
              }`}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Basic Information Section */}
      {activeSection === 'basic' && (
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
                    errors.name ? 'border-red-500 focus:border-red-500' : ''
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
                      errors.website ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                    placeholder='https://yourwebsite.com'
                  />
                  {errors.website && <p className='mt-1 text-sm text-red-500'>{errors.website}</p>}
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-white'>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className='w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-zinc-600'
                  >
                    <option value=''>Select category</option>
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className='grid grid-cols-3 gap-4'>
                <div>
                  <label className='mb-2 block text-sm font-medium text-white'>Established Year</label>
                  <Input
                    type='number'
                    value={establishedYear}
                    onChange={(e) => setEstablishedYear(e.target.value)}
                    className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600'
                    placeholder='2020'
                    min='1800'
                    max={new Date().getFullYear()}
                  />
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-white'>Price Level</label>
                  <select
                    value={pricePositioning}
                    onChange={(e) => setPricePositioning(e.target.value)}
                    className='w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-zinc-600'
                  >
                    <option value=''>Select pricing</option>
                    {pricePositioningOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-white'>Service Area</label>
                  <Input
                    value={serviceArea}
                    onChange={(e) => setServiceArea(e.target.value)}
                    className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600'
                    placeholder='Bay Area, CA'
                  />
                </div>
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium text-white'>Business Hours</label>
                <textarea
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className='min-h-20 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-400 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600'
                  placeholder='Monday-Friday: 9 AM - 6 PM&#10;Saturday: 10 AM - 4 PM&#10;Sunday: Closed'
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Contact & Location Section */}
      {activeSection === 'contact' && (
        <div className='space-y-6'>
          <Card title='Contact Information'>
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='mb-2 block text-sm font-medium text-white'>Phone Number</label>
                  <div className='flex gap-2'>
                    <select
                      value={phoneCountryCode}
                      onChange={(e) => setPhoneCountryCode(e.target.value)}
                      className='w-28 rounded-md border border-zinc-700 bg-zinc-800 px-2 py-2 text-white'
                    >
                      {phoneCountryCodes.map((code) => (
                        <option key={code.value} value={code.value}>
                          {code.label}
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

              <ArrayInput
                label='Languages Spoken'
                items={languagesSpoken}
                setItems={setLanguagesSpoken}
                options={languageOptions}
              />
            </div>
          </Card>

          <Card title='Business Address'>
            <div className='space-y-4'>
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

              <div>
                <label className='mb-2 block text-sm font-medium text-white'>Parking Information</label>
                <textarea
                  value={parkingInfo}
                  onChange={(e) => setParkingInfo(e.target.value)}
                  className='min-h-16 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-400 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600'
                  placeholder='Free parking available, street parking, valet service, etc.'
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Business Details Section */}
      {activeSection === 'details' && (
        <div className='space-y-6'>
          <Card title='What You Offer'>
            <div className='space-y-4'>
              <ArrayInput
                label='Business Specialties'
                items={specialties}
                setItems={setSpecialties}
                placeholder='e.g., AI Optimization, Local SEO, Web Development'
              />

              <ArrayInput
                label='Services Offered'
                items={services}
                setItems={setServices}
                placeholder='e.g., Website Creation, SEO Optimization'
              />
            </div>
          </Card>

          <Card title='Business Characteristics'>
            <div className='space-y-4'>
              <ArrayInput
                label='Business Tags (Max 5)'
                items={staticTags}
                setItems={(items) => items.length <= 5 ? setStaticTags(items) : null}
                options={Constants.public.Enums.static_tag.slice(0, 20)}
              />
              {staticTags.length >= 5 && (
                <p className='text-sm text-amber-400'>Maximum 5 tags allowed</p>
              )}

              <ArrayInput
                label='Awards & Recognition'
                items={awards}
                setItems={setAwards}
                placeholder='e.g., Best Local Business 2024'
              />

              <ArrayInput
                label='Certifications'
                items={certifications}
                setItems={setCertifications}
                placeholder='e.g., Google Partner, BBB Accredited'
              />
            </div>
          </Card>
        </div>
      )}

      {/* Services & Features Section */}
      {activeSection === 'services' && (
        <div className='space-y-6'>
          <Card title='Customer Experience'>
            <div className='space-y-4'>
              <ArrayInput
                label='Payment Methods'
                items={paymentMethods}
                setItems={setPaymentMethods}
                options={paymentMethodOptions}
              />

              <ArrayInput
                label='Accessibility Features'
                items={accessibilityFeatures}
                setItems={setAccessibilityFeatures}
                options={accessibilityOptions}
              />
            </div>
          </Card>
        </div>
      )}

      {/* Online Presence Section */}
      {activeSection === 'social' && (
        <div className='space-y-6'>
          <Card title='Social Media & Online Presence'>
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='mb-2 block text-sm font-medium text-white'>Facebook</label>
                  <Input
                    type='url'
                    value={socialMedia.facebook}
                    onChange={(e) => setSocialMedia({...socialMedia, facebook: e.target.value})}
                    className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600'
                    placeholder='https://facebook.com/yourpage'
                  />
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-white'>Twitter</label>
                  <Input
                    type='url'
                    value={socialMedia.twitter}
                    onChange={(e) => setSocialMedia({...socialMedia, twitter: e.target.value})}
                    className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600'
                    placeholder='https://twitter.com/yourhandle'
                  />
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-white'>Instagram</label>
                  <Input
                    type='url'
                    value={socialMedia.instagram}
                    onChange={(e) => setSocialMedia({...socialMedia, instagram: e.target.value})}
                    className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600'
                    placeholder='https://instagram.com/yourhandle'
                  />
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-white'>LinkedIn</label>
                  <Input
                    type='url'
                    value={socialMedia.linkedin}
                    onChange={(e) => setSocialMedia({...socialMedia, linkedin: e.target.value})}
                    className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600'
                    placeholder='https://linkedin.com/company/yourcompany'
                  />
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-white'>YouTube</label>
                  <Input
                    type='url'
                    value={socialMedia.youtube}
                    onChange={(e) => setSocialMedia({...socialMedia, youtube: e.target.value})}
                    className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600'
                    placeholder='https://youtube.com/yourchannel'
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Customer Support Section */}
      {activeSection === 'support' && (
        <div className='space-y-6'>
          <Card title='Frequently Asked Questions'>
            <div className='space-y-4'>
              {businessFaqs.map((faq, index) => (
                <div key={index} className='p-4 bg-zinc-800 rounded-md'>
                  <div className='space-y-3'>
                    <div>
                      <label className='mb-2 block text-sm font-medium text-white'>Question</label>
                      <Input
                        value={faq.question}
                        onChange={(e) => updateFaq(index, 'question', e.target.value)}
                        className='bg-zinc-700 border-zinc-600 text-white focus:border-zinc-500'
                        placeholder='What is your question?'
                      />
                    </div>
                    <div>
                      <label className='mb-2 block text-sm font-medium text-white'>Answer</label>
                      <textarea
                        value={faq.answer}
                        onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                        className='min-h-16 w-full rounded-md border border-zinc-600 bg-zinc-700 px-3 py-2 text-white placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500'
                        placeholder='Provide a helpful answer...'
                      />
                    </div>
                    <div className='flex justify-end'>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => removeFaq(index)}
                        className='text-red-400 border-red-400 hover:bg-red-400 hover:text-white'
                      >
                        Remove FAQ
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button type='button' onClick={addFaq} variant='outline' className='w-full'>
                Add FAQ
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Save Button - Always Visible */}
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