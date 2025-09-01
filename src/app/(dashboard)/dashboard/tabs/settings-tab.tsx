'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';

interface SettingsTabProps {
  userEmail?: string;
  userName?: string;
}

export function SettingsTab({ userEmail, userName }: SettingsTabProps) {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setEmail(userEmail || '');
    setName(userName || '');
  }, [userEmail, userName]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Update user display name in auth.users metadata
      const supabase = await createSupabaseServerClient();
      const { error } = await supabase.auth.updateUser({
        data: { full_name: name }
      });

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to update profile',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Profile updated successfully',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you absolutely sure you want to delete your account? This action cannot be undone and will permanently delete all your business data.'
    );
    
    if (!confirmed) return;

    const doubleConfirm = window.confirm(
      'This will permanently delete your account and all associated business data. Type "DELETE" in the next prompt to confirm.'
    );
    
    if (!doubleConfirm) return;

    const finalConfirm = window.prompt('Type "DELETE" to permanently delete your account:');
    
    if (finalConfirm !== 'DELETE') {
      toast({
        title: 'Deletion Cancelled',
        description: 'Account deletion was cancelled',
      });
      return;
    }

    setIsDeleting(true);
    
    try {
      // Delete user account and all associated data
      const supabase = await createSupabaseServerClient();
      
      // First delete business data
      await supabase.from('businesses').delete().eq('email', email);
      
      // Then delete the auth user
      const { error } = await supabase.auth.admin.deleteUser(
        (await supabase.auth.getUser()).data.user?.id || ''
      );

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete account',
          variant: 'destructive',
        });
      } else {
        // Redirect to home page after deletion
        window.location.href = '/';
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete account',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
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
              className='bg-zinc-700 border-zinc-600 text-zinc-300 cursor-not-allowed'
              disabled
              readOnly
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
              disabled={isDeleting}
              className='bg-red-600 hover:bg-red-700'
            >
              {isDeleting ? 'Deleting...' : 'Delete Account'}
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