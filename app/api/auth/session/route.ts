import { createClient } from '@/lib/utils/supabase/server';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      return NextResponse.json({ data: null, error }, { status: 401 });
    }
    
    return NextResponse.json({ data, error: null });
  } catch (err) {
    // Session API error - returning 500 response
    console.error('Session API error:', err);
    return NextResponse.json(
      { data: null, error: 'Failed to get session' }, 
      { status: 500 }
    );
  }
}