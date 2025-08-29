import { createClient } from '@/lib/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { businessIdSchema, createValidationErrorResponse } from '@/lib/schemas/validation';
import { adminRateLimiter } from '@/lib/middleware/rateLimiter';


export async function DELETE(request: NextRequest) {
  try {
    // Apply rate limiting for admin operations
    const rateLimitResponse = await adminRateLimiter(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
    const requestBody = await request.json();
    
    // Validate input with Zod
    const validation = businessIdSchema.safeParse(requestBody);
    if (!validation.success) {
      return createValidationErrorResponse(validation.error);
    }
    
    const { businessId } = validation.data;
    
    const supabase = await createClient();
    
    // Delete related records in order
    const deleteOperations = [
      supabase.from('updates').delete().eq('business_id', businessId),
      supabase.from('generated_pages').delete().eq('business_id', businessId),
      supabase.from('business_events').delete().eq('business_id', businessId)
    ];
    
    const results = await Promise.all(deleteOperations);
    
    // Check for errors
    const errors = results.filter((result) => result.error);
    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Failed to delete some business data', details: errors }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, error: null });
  } catch (error) {
    console.error('Business delete API error:', error);
    return NextResponse.json(
      { error: 'Failed to delete business' }, 
      { status: 500 }
    );
  }
}