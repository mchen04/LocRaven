// Required for Cloudflare Pages deployment
export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Log web vitals in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Web Vitals:', body);
    }

    // In production, you can:
    // 1. Store metrics in your database
    // 2. Forward to analytics service (Google Analytics, etc.)
    // 3. Log for monitoring
    
    // For now, just acknowledge receipt
    return Response.json({ 
      success: true, 
      message: 'Analytics data received',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Analytics API error:', error);
    
    return Response.json(
      { 
        success: false, 
        error: 'Failed to process analytics data' 
      },
      { status: 400 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return Response.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}