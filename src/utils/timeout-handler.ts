/**
 * ⚡ CLOUDFLARE WORKERS TIMEOUT UTILITIES
 * Prevents CPU time limit exceeded errors through timeout handling and circuit breakers
 */

export class TimeoutError extends Error {
  constructor(operation: string, timeout: number) {
    super(`Operation '${operation}' timed out after ${timeout}ms (CF Workers protection)`);
    this.name = 'TimeoutError';
  }
}

/**
 * Wraps a promise with timeout handling for CF Workers
 * @param promise The promise to wrap
 * @param timeoutMs Timeout in milliseconds (default: 25s for CF Workers safety)
 * @param operation Operation name for error reporting
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 25000, // 25s - well under CF Workers 30s CPU limit
  operation: string = 'API call'
): Promise<T> {
  let timeoutId: NodeJS.Timeout | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new TimeoutError(operation, timeoutMs));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    if (timeoutId) clearTimeout(timeoutId);
    return result;
  } catch (error) {
    if (timeoutId) clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Circuit breaker for repeated API failures
 * Prevents cascading failures in CF Workers environment
 */
class CircuitBreaker {
  private failures = 0;
  private lastFailTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private readonly maxFailures = 3,
    private readonly resetTimeout = 60000 // 1 minute
  ) {}

  async execute<T>(
    operation: () => Promise<T>,
    operationName: string = 'operation'
  ): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailTime > this.resetTimeout) {
        this.state = 'half-open';
        this.failures = 0;
      } else {
        throw new Error(`Circuit breaker OPEN for ${operationName} - too many failures`);
      }
    }

    try {
      const result = await withTimeout(operation(), 25000, operationName);
      
      if (this.state === 'half-open') {
        this.state = 'closed';
        this.failures = 0;
      }
      
      return result;
    } catch (error) {
      this.failures++;
      this.lastFailTime = Date.now();

      if (this.failures >= this.maxFailures) {
        this.state = 'open';
      }

      throw error;
    }
  }

  getState() {
    return {
      state: this.state,
      failures: this.failures,
      lastFailTime: this.lastFailTime
    };
  }
}

// Global circuit breakers for common external services
export const stripeCircuitBreaker = new CircuitBreaker(3, 60000);
export const supabaseCircuitBreaker = new CircuitBreaker(5, 30000);

/**
 * Retry mechanism with exponential backoff
 * Suitable for CF Workers transient failures
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 2,
  baseDelay: number = 1000,
  operationName: string = 'operation'
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await withTimeout(operation(), 20000, `${operationName} (attempt ${attempt + 1})`);
    } catch (error) {
      lastError = error as Error;

      // Don't retry on timeout or circuit breaker errors
      if (error instanceof TimeoutError || error.message.includes('Circuit breaker')) {
        throw error;
      }

      // Don't retry on final attempt
      if (attempt === maxRetries) {
        break;
      }

      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, Math.min(delay, 5000)));
    }
  }

  throw lastError!;
}