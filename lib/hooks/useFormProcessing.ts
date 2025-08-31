import { useState, useCallback } from 'react';

export interface FormProcessingOptions<TResult = any> {
  onSuccess?: (result: TResult) => void;
  onError?: (error: string) => void;
  resetOnSuccess?: boolean;
}

export interface FormProcessingResult<TData> {
  isProcessing: boolean;
  error: string | null;
  submitForm: (formData: TData, processor: (data: TData) => Promise<any>) => Promise<void>;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

/**
 * Custom hook for managing form processing state
 * Consolidates loading, error, and success handling patterns
 */
export function useFormProcessing<TData = any, TResult = any>(
  options: FormProcessingOptions<TResult> = {}
): FormProcessingResult<TData> {
  const {
    onSuccess,
    onError,
    resetOnSuccess = true
  } = options;

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setIsProcessing(false);
    setError(null);
  }, []);

  const submitForm = useCallback(async (
    formData: TData,
    processor: (data: TData) => Promise<TResult>
  ): Promise<void> => {
    // Clear any previous errors
    setError(null);
    setIsProcessing(true);

    try {
      const result = await processor(formData);
      
      if (resetOnSuccess) {
        setIsProcessing(false);
      }
      
      onSuccess?.(result);
    } catch (err: any) {
      const errorMessage = err?.message || err?.error || 'An unexpected error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      if (!resetOnSuccess) {
        setIsProcessing(false);
      }
    }
  }, [onSuccess, onError, resetOnSuccess]);

  return {
    isProcessing,
    error,
    submitForm,
    setError,
    clearError,
    reset
  };
}

/**
 * Specialized hook for async operations with loading states
 */
export function useAsyncOperation<TResult = any>(
  options: FormProcessingOptions<TResult> = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (
    operation: () => Promise<TResult>
  ): Promise<TResult | null> => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await operation();
      options.onSuccess?.(result);
      return result;
    } catch (err: any) {
      const errorMessage = err?.message || err?.error || 'Operation failed';
      setError(errorMessage);
      options.onError?.(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    execute,
    setError,
    reset
  };
}

/**
 * Hook for managing multiple loading states (useful for components with multiple async actions)
 */
export function useMultipleLoadingStates() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: loading
    }));
  }, []);

  const isLoading = useCallback((key: string): boolean => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  const isAnyLoading = useCallback((): boolean => {
    return Object.values(loadingStates).some(Boolean);
  }, [loadingStates]);

  const resetLoading = useCallback((key?: string) => {
    if (key) {
      setLoadingStates(prev => ({
        ...prev,
        [key]: false
      }));
    } else {
      setLoadingStates({});
    }
  }, []);

  return {
    setLoading,
    isLoading,
    isAnyLoading,
    resetLoading,
    loadingStates
  };
}