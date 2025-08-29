import { createClient } from '@/lib/utils/supabase/server';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    // Create Supabase client using request context environment variables
    await createClient();
    
    // Return success indicator that client was created
    return NextResponse.json({ success: true, configured: true });
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to initialize Supabase client' }, 
      { status: 500 }
    );
  }
}