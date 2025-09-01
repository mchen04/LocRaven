'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SettingsTabProps {}

export function SettingsTab({}: SettingsTabProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    // TODO: Implement save profile API call
    setTimeout(() => {
      setIsSaving(false);
      // TODO: Show success toast
    }, 1000);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      // TODO: Show error toast
      return;
    }
    
    // TODO: Implement change password API call
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
            />
          </div>

          <div className='flex justify-end'>
            <Button onClick={handleSaveProfile} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Card>

      <Card title='Change Password'>
        <div className='space-y-4'>
          <div>
            <label htmlFor='current-password' className='mb-2 block text-sm font-medium text-white'>
              Current Password
            </label>
            <Input
              id='current-password'
              type='password'
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600'
              placeholder='Enter your current password'
            />
          </div>

          <div>
            <label htmlFor='new-password' className='mb-2 block text-sm font-medium text-white'>
              New Password
            </label>
            <Input
              id='new-password'
              type='password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600'
              placeholder='Enter your new password'
            />
          </div>

          <div>
            <label htmlFor='confirm-password' className='mb-2 block text-sm font-medium text-white'>
              Confirm New Password
            </label>
            <Input
              id='confirm-password'
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='bg-zinc-800 border-zinc-700 text-white focus:border-zinc-600'
              placeholder='Confirm your new password'
            />
          </div>

          <div className='flex justify-end'>
            <Button
              onClick={handleChangePassword}
              disabled={!currentPassword || !newPassword || !confirmPassword}
            >
              Change Password
            </Button>
          </div>
        </div>
      </Card>

      <Card title='Notification Preferences'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <div className='text-sm font-medium text-white'>Email Notifications</div>
              <div className='text-sm text-zinc-400'>
                Receive notifications about your account and updates
              </div>
            </div>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className='sr-only peer'
              />
              <div className="relative w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className='flex items-center justify-between'>
            <div>
              <div className='text-sm font-medium text-white'>Marketing Emails</div>
              <div className='text-sm text-zinc-400'>
                Receive updates about new features and promotions
              </div>
            </div>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                checked={marketingEmails}
                onChange={(e) => setMarketingEmails(e.target.checked)}
                className='sr-only peer'
              />
              <div className="relative w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
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