'use server';

import { redirect } from 'next/navigation';

import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';

export async function deleteUserAccount() {
  try {
    const supabase = await createSupabaseServerClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { 
        success: false, 
        error: 'Authentication required' 
      };
    }

    // Delete business data first (if exists)
    if (user.email) {
      await supabase.from('businesses').delete().eq('email', user.email);
    }
    
    // Delete the auth user
    const { error } = await supabase.auth.admin.deleteUser(user.id);

    if (error) {
      console.error('Error deleting user account:', error);
      return { 
        success: false, 
        error: 'Failed to delete account' 
      };
    }

    // Redirect to home after successful deletion
    redirect('/');
  } catch (error) {
    console.error('Delete user account error:', error);
    return { 
      success: false, 
      error: 'An unexpected error occurred' 
    };
  }
}