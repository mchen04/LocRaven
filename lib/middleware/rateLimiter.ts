import { NextRequest, NextResponse } from 'next/server'

/**
 * Simple rate limiter for Next.js API routes
 * Uses in-memory storage (suitable for serverless)
 */

// In-memory rate limit store (resets on deployment)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

interface RateLimitOptions {
  maxRequests: number
  windowMs: number
  message?: string
}

/**
 * Rate limiting middleware for API routes
 */
export function createRateLimiter(options: RateLimitOptions) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    try {
      // Get client identifier (IP address)
      const clientId = request.headers.get('x-forwarded-for') || 
                      request.headers.get('cf-connecting-ip') || 
                      'unknown'
      
      const now = Date.now()
      
      // Clean expired entries
      for (const [key, value] of rateLimitStore.entries()) {
        if (value.resetTime < now) {
          rateLimitStore.delete(key)
        }
      }
      
      // Check current rate limit
      const current = rateLimitStore.get(clientId)
      
      if (!current || current.resetTime < now) {
        // New or expired window
        rateLimitStore.set(clientId, {
          count: 1,
          resetTime: now + options.windowMs
        })
        return null // Allow request
      }
      
      if (current.count >= options.maxRequests) {
        // Rate limit exceeded
        return NextResponse.json({
          error: 'Rate limit exceeded',
          message: options.message || `Too many requests. Limit: ${options.maxRequests} per ${Math.floor(options.windowMs / 1000)} seconds.`,
          retryAfter: Math.ceil((current.resetTime - now) / 1000)
        }, { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((current.resetTime - now) / 1000)),
            'X-RateLimit-Limit': String(options.maxRequests),
            'X-RateLimit-Remaining': String(Math.max(0, options.maxRequests - current.count)),
            'X-RateLimit-Reset': String(current.resetTime)
          }
        })
      }
      
      // Increment counter
      current.count++
      return null // Allow request
      
    } catch (error) {
      console.error('Rate limiter error:', error)
      // Fail open - allow request if rate limiting fails
      return null
    }
  }
}

// Pre-configured rate limiters for different use cases
export const apiRateLimiter = createRateLimiter({
  maxRequests: 60,
  windowMs: 60 * 1000, // 1 minute
  message: 'API rate limit exceeded. Please slow down your requests.'
})

export const adminRateLimiter = createRateLimiter({
  maxRequests: 20,
  windowMs: 60 * 1000, // 1 minute  
  message: 'Admin API rate limit exceeded.'
})

export const publicRateLimiter = createRateLimiter({
  maxRequests: 300,
  windowMs: 60 * 1000, // 1 minute
  message: 'Public API rate limit exceeded.'
})