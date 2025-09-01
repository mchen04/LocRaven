'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SettingsTabProps {}

export function SettingsTab({}: SettingsTabProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    // TODO: Implement save profile API call
    setTimeout(() => {
      setIsSaving(false);
      // TODO: Show success toast
    }, 1000);
  };

  const handleDeleteAccount = async () => {
    // TODO: Show confirmation dialog
    // TODO: Implement delete account API call
  };

  return (
    <div className='space-y-6'>
      <Card title='Profile Information'>
        <div className='space-y-4'>
          <div>
            <label htmlFor='name' className='mb-2 block text-sm font-medium text-white'>
              Full Name
            </label>
            <Input
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600'
              placeholder='Enter your full name'
            />
          </div>

          <div>
            <label htmlFor='email' className='mb-2 block text-sm font-medium text-white'>
              Email Address
            </label>
            <Input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600'
              placeholder='Enter your email address'
              disabled
            />
            <p className='mt-1 text-sm text-zinc-400'>Email is managed by Google</p>
          </div>

          <div className='flex justify-end'>
            <Button onClick={handleSaveProfile} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Card>

      <Card title='Danger Zone'>
        <div className='space-y-4'>
          <div className='rounded-md border border-red-800 bg-red-900/20 p-4'>
            <h3 className='text-lg font-medium text-red-400 mb-2'>Delete Account</h3>
            <p className='text-sm text-red-300 mb-4'>
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button
              variant='destructive'
              onClick={handleDeleteAccount}
              className='bg-red-600 hover:bg-red-700'
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Card>
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