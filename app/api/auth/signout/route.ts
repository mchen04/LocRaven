import { createClient } from '@/lib/utils/supabase/server';
import { NextResponse } from 'next/server';


export async function POST() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }
    
    return NextResponse.json({ error: null });
  } catch (err) {
    // Sign out API error - returning 500 response
    console.error('Sign out API error:', err);
    return NextResponse.json(
      { error: 'Failed to sign out' }, 
      { status: 500 }
    );
  }
}