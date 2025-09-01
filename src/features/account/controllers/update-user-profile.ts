'use server';

import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';

export interface UpdateUserProfileData {
  fullName: string;
}

export async function updateUserProfile(data: UpdateUserProfileData) {
  try {
    const supabase = await createSupabaseServerClient();
    
    const { error } = await supabase.auth.updateUser({
      data: { 
        full_name: data.fullName,
        name: data.fullName
      }
    });

    if (error) {
      console.error('Error updating user profile:', error);
      return { 
        success: false, 
        error: 'Failed to update profile' 
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Update user profile error:', error);
    return { 
      success: false, 
      error: 'An unexpected error occurred' 
    };
  }
}