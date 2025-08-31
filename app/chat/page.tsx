'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

// Force dynamic rendering for this page since it requires authentication
export const dynamic = 'force-dynamic';

export default function ChatPage() {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    window.location.href = '/login';
    return null;
  }

  return (
    <div className="min-h-screen p-6 bg-muted/50">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <MessageCircle className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">AI Chat Interface</CardTitle>
          <p className="text-muted-foreground">
            Chat with AI about your business updates and optimization strategies
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Chat functionality coming soon! This will allow you to interact with AI assistants 
              to optimize your business content and strategy.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}