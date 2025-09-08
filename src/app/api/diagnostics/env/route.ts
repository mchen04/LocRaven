import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('[/api/diagnostics/env] Environment diagnostics endpoint called');
  
  try {
    // Check all environment variables we need
    const envDiagnostics = {
      timestamp: new Date().toISOString(),
      runtime: 'unknown',
      processEnv: {
        // Stripe variables
        STRIPE_SECRET_KEY: {
          available: !!process.env.STRIPE_SECRET_KEY,
          length: process.env.STRIPE_SECRET_KEY?.length || 0,
          prefix: process.env.STRIPE_SECRET_KEY?.substring(0, 7) || 'undefined'
        },
        STRIPE_WEBHOOK_SECRET: {
          available: !!process.env.STRIPE_WEBHOOK_SECRET,
          length: process.env.STRIPE_WEBHOOK_SECRET?.length || 0
        },
        
        // Supabase variables  
        SUPABASE_SERVICE_ROLE_KEY: {
          available: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
          length: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
          prefix: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 7) || 'undefined'
        },
        NEXT_PUBLIC_SUPABASE_URL: {
          available: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          value: process.env.NEXT_PUBLIC_SUPABASE_URL || 'undefined'
        },
        NEXT_PUBLIC_SUPABASE_ANON_KEY: {
          available: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          length: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
          prefix: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 7) || 'undefined'
        },

        // App URLs
        NEXT_PUBLIC_APP_URL: {
          available: !!process.env.NEXT_PUBLIC_APP_URL,
          value: process.env.NEXT_PUBLIC_APP_URL || 'undefined'
        },
        NEXT_PUBLIC_LANDING_URL: {
          available: !!process.env.NEXT_PUBLIC_LANDING_URL,
          value: process.env.NEXT_PUBLIC_LANDING_URL || 'undefined'
        }
      },
      allEnvKeys: Object.keys(process.env).filter(key => 
        key.startsWith('NEXT_PUBLIC_') || 
        key.startsWith('STRIPE_') || 
        key.startsWith('SUPABASE_')
      ),
      totalEnvVars: Object.keys(process.env).length
    };

    // Detect runtime environment
    if (typeof EdgeRuntime !== 'undefined') {
      envDiagnostics.runtime = 'edge';
    } else if (typeof window === 'undefined') {
      envDiagnostics.runtime = 'nodejs';
    } else {
      envDiagnostics.runtime = 'browser';
    }

    console.log('[/api/diagnostics/env] Environment diagnostics:', JSON.stringify(envDiagnostics, null, 2));

    return NextResponse.json(envDiagnostics, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    console.error('[/api/diagnostics/env] Error:', error);
    
    return NextResponse.json(
      {
        error: 'Diagnostics failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}