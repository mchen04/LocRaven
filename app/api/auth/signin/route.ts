import { createClient } from '@/lib/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
  try {
    const { provider, redirectTo } = await request.json();
    const supabase = await createClient();
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo
      }
    });
    
    if (error) {
      return NextResponse.json({ data: null, error }, { status: 400 });
    }
    
    return NextResponse.json({ data, error: null });
  } catch (error) {
    console.error('Sign in API error:', error);
    return NextResponse.json(
      { data: null, error: 'Failed to sign in' }, 
      { status: 500 }
    );
  }
}