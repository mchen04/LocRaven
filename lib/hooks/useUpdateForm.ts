'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNotification } from '@/components/providers/notification-provider';
import { useBusiness } from '@/components/providers/business-provider';

const updateFormSchema = z.object({
  updateText: z.string().min(10, 'Update must be at least 10 characters'),
  dates: z.object({
    expirationDate: z.string().optional(),
  }).optional(),
  keywords: z.string().optional(),
});

type UpdateFormData = z.infer<typeof updateFormSchema>;

// Hook interface as specified in REBUILD_TODO.md
export function useUpdateForm() {
  const [processing, setProcessing] = useState(false);
  const { showSuccess, showError } = useNotification();
  const { business } = useBusiness();
  
  const form = useForm<UpdateFormData>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      updateText: '',
      dates: {
        expirationDate: '',
      },
      keywords: '',
    },
  });

  const validation = {
    errors: form.formState.errors,
    isValid: form.formState.isValid,
    isDirty: form.formState.isDirty,
  };

  const submit = useCallback(async (data: UpdateFormData) => {
    if (!business?.id) {
      showError('Business profile required to create updates');
      return { success: false, error: 'No business profile' };
    }

    try {
      setProcessing(true);
      
      // TODO: Implement actual API call to create update
      // For now, simulate the API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showSuccess('Update created successfully! Your business is now more discoverable by AI.');
      form.reset();
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create update';
      showError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setProcessing(false);
    }
  }, [business?.id, showSuccess, showError, form]);

  const dates = {
    expirationDate: form.watch('dates.expirationDate'),
    setExpirationDate: (date: string) => form.setValue('dates.expirationDate', date),
  };

  return {
    updateText: form.watch('updateText'),
    dates,
    processing,
    validation,
    submit: form.handleSubmit(submit),
    form, // Expose form for direct access if needed
  };
}