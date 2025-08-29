import { NextResponse } from 'next/server';
import { createClient } from '@/lib/utils/supabase/server';
import { getUserSubscriptionStatus } from '@/lib/services/stripe';


export async function GET() {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get subscription status
    const status = await getUserSubscriptionStatus(user.email!);
    
    return NextResponse.json({ status });
    
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription status' },
      { status: 500 }
    );
  }
}