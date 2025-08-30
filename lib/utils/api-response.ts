import { NextResponse } from 'next/server';

// Standard API response types
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  error: null;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  data: null;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// Success response helper
export function apiSuccess<T>(data: T, status = 200): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    error: null
  }, { status });
}

// Error response helper
export function apiError(error: string, status = 400): NextResponse<ApiErrorResponse> {
  return NextResponse.json({
    success: false,
    error,
    data: null
  }, { status });
}

// Common error responses
export const apiErrors = {
  unauthorized: () => apiError('Unauthorized', 401),
  forbidden: () => apiError('Forbidden', 403),
  notFound: () => apiError('Not found', 404),
  methodNotAllowed: () => apiError('Method not allowed', 405),
  internalError: (message = 'Internal server error') => apiError(message, 500),
  badRequest: (message = 'Bad request') => apiError(message, 400),
  validation: (message = 'Validation failed') => apiError(message, 422)
};

// Higher-order function to wrap API handlers with error handling
export function withErrorHandler(
  handler: () => Promise<NextResponse<any>>
) {
  return async (): Promise<NextResponse<any>> => {
    try {
      return await handler();
    } catch (error) {
      console.error('API Error:', error);
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return apiErrors.internalError(message);
    }
  };
}

// CORS headers helper
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Add CORS headers to response
export function withCors<T>(response: NextResponse<T>): NextResponse<T> {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}