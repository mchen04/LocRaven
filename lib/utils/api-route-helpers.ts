import { NextRequest, NextResponse } from 'next/server';
import { createClient } from './supabase/server';
import type { User } from '@supabase/supabase-js';

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  success?: boolean;
}

export interface AuthenticatedApiContext {
  user: User;
  supabase: Awaited<ReturnType<typeof createClient>>;
}

export async function withAuthentication(
  request: NextRequest,
  handler: (context: AuthenticatedApiContext, request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return createErrorResponse('Authentication required', 401);
    }
    
    return await handler({ user, supabase }, request);
  } catch (error) {
    return createErrorResponse('Authentication failed', 500);
  }
}

export function createSuccessResponse<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json({ data, success: true }, { status });
}

export function createErrorResponse(error: string, status: number = 400): NextResponse {
  return NextResponse.json({ error, success: false }, { status });
}

export async function parseRequestBody<T>(request: NextRequest): Promise<T> {
  try {
    return await request.json();
  } catch {
    throw new Error('Invalid JSON in request body');
  }
}

export function validateRequiredFields(
  data: Record<string, unknown>, 
  requiredFields: string[]
): void {
  const missingFields = requiredFields.filter(field => !data[field]);
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
}

export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  errorMessage: string = 'Internal server error'
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error(errorMessage, error);
    throw new Error(errorMessage);
  }
}