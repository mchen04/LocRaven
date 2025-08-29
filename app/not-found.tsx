'use client';

import { Search, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button, Card } from '@/lib/components/ui/atoms';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full text-center" padding="lg">
        <div className="mb-6">
          <Search className="mx-auto h-16 w-16 text-gray-400" />
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Page not found
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have been moved or doesn&apos;t exist.
        </p>
        
        <div className="space-y-3">
          <Link href="/" className="block">
            <Button variant="primary" size="lg" className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Go home
            </Button>
          </Link>
          
          <Button
            variant="outline"
            size="md"
            className="w-full"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back
          </Button>
        </div>
      </Card>
    </div>
  );
}