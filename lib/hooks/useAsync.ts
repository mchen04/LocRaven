'use client';

import { useState, useCallback } from 'react';

interface UseAsyncReturn<T> {
  loading: boolean;
  error: string | null;
  execute: (fn: () => Promise<T>) => Promise<T | null>;
  reset: () => void;
}

export const useAsync = <T = unknown>(): UseAsyncReturn<T> => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (fn: () => Promise<T>): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await fn();
      return result;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    reset
  };
};