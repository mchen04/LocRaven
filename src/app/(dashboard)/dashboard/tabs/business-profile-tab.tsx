'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BusinessProfileTabProps {}

export function BusinessProfileTab({}: BusinessProfileTabProps) {
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [category, setCategory] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    // TODO: Implement save profile API call
    setTimeout(() => {
      setIsSaving(false);
      // TODO: Show success toast
    }, 1000);
  };

  return (
    <div className='space-y-6'>
      <Card title='Business Information'>
        <div className='space-y-4'>
          <div>
            <label htmlFor='business-name' className='mb-2 block text-sm font-medium text-white'>
              Business Name
            </label>
            <Input
              id='business-name'
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600'
              placeholder='Enter your business name'
            />
          </div>

          <div>
            <label htmlFor='business-description' className='mb-2 block text-sm font-medium text-white'>
              Business Description
            </label>
            <textarea
              id='business-description'
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
              className='min-h-24 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-400 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600'
              placeholder='Describe your business and what you offer...'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label htmlFor='website' className='mb-2 block text-sm font-medium text-white'>
                Website
              </label>
              <Input
                id='website'
                type='url'
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600'
                placeholder='https://yourwebsite.com'
              />
            </div>
            <div>
              <label htmlFor='phone-number' className='mb-2 block text-sm font-medium text-white'>
                Phone Number
              </label>
              <Input
                id='phone-number'
                type='tel'
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600'
                placeholder='(555) 123-4567'
              />
            </div>
          </div>

          <div>
            <label htmlFor='category' className='mb-2 block text-sm font-medium text-white'>
              Business Category
            </label>
            <select
              id='category'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className='w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600'
            >
              <option value=''>Select a category</option>
              <option value='restaurant'>Restaurant</option>
              <option value='retail'>Retail</option>
              <option value='services'>Services</option>
              <option value='healthcare'>Healthcare</option>
              <option value='automotive'>Automotive</option>
              <option value='beauty'>Beauty & Wellness</option>
              <option value='fitness'>Fitness</option>
              <option value='education'>Education</option>
              <option value='other'>Other</option>
            </select>
          </div>
        </div>
      </Card>

      <Card title='Business Address'>
        <div className='space-y-4'>
          <div>
            <label htmlFor='address' className='mb-2 block text-sm font-medium text-white'>
              Street Address
            </label>
            <Input
              id='address'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600'
              placeholder='123 Main Street'
            />
          </div>

          <div className='grid grid-cols-3 gap-4'>
            <div>
              <label htmlFor='city' className='mb-2 block text-sm font-medium text-white'>
                City
              </label>
              <Input
                id='city'
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600'
                placeholder='San Francisco'
              />
            </div>
            <div>
              <label htmlFor='state' className='mb-2 block text-sm font-medium text-white'>
                State
              </label>
              <Input
                id='state'
                value={state}
                onChange={(e) => setState(e.target.value)}
                className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600'
                placeholder='CA'
              />
            </div>
            <div>
              <label htmlFor='zip-code' className='mb-2 block text-sm font-medium text-white'>
                ZIP Code
              </label>
              <Input
                id='zip-code'
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600'
                placeholder='94102'
              />
            </div>
          </div>
        </div>
      </Card>

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