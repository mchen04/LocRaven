'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useNotification } from '@/components/providers/notification-provider';
import { CalendarDays, Sparkles } from 'lucide-react';

const updateFormSchema = z.object({
  content: z.string().min(10, 'Update must be at least 10 characters'),
  expirationDate: z.string().optional(),
  keywords: z.string().optional(),
});

type UpdateFormData = z.infer<typeof updateFormSchema>;

export function UpdateForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useNotification();
  
  const form = useForm<UpdateFormData>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      content: '',
      expirationDate: '',
      keywords: '',
    },
  });

  const onSubmit = async (data: UpdateFormData) => {
    try {
      setIsSubmitting(true);
      
      // TODO: Implement actual API call to create update
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showSuccess('Update created successfully! Your business is now more discoverable by AI.');
      form.reset();
      
    } catch (error) {
      showError('Failed to create update. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Business Update
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Update content */}
          <div className="space-y-2">
            <Label htmlFor="content">What&apos;s new with your business?</Label>
            <Textarea
              id="content"
              placeholder="e.g., Fresh fish tacos available until 10pm, now serving gluten-free options..."
              className="min-h-[120px]"
              {...form.register('content')}
            />
            {form.formState.errors.content && (
              <p className="text-sm text-destructive">
                {form.formState.errors.content.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Tip: Be specific about timing, availability, or special offers for better AI discovery.
            </p>
          </div>

          {/* Optional expiration date */}
          <div className="space-y-2">
            <Label htmlFor="expirationDate" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Expiration Date (Optional)
            </Label>
            <Input
              id="expirationDate"
              type="date"
              {...form.register('expirationDate')}
            />
            <p className="text-xs text-muted-foreground">
              When should this update stop appearing? Leave blank for permanent updates.
            </p>
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords (Optional)</Label>
            <Input
              id="keywords"
              placeholder="e.g., tacos, gluten-free, seafood, late night"
              {...form.register('keywords')}
            />
            <p className="text-xs text-muted-foreground">
              Comma-separated keywords to help AI assistants find your business.
            </p>
          </div>

          {/* AI optimization preview */}
          {form.watch('content') && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="text-sm font-medium mb-2">AI Optimization Preview</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Local Business</Badge>
                <Badge variant="secondary">Real-time Updates</Badge>
                <Badge variant="secondary">Current Availability</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Our AI will optimize your content for ChatGPT, Claude, and Perplexity discovery.
              </p>
            </div>
          )}

          {/* Submit button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Creating Update...
              </>
            ) : (
              'Create Update & Go Live'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}