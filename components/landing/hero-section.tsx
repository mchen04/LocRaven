'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Beta announcement */}
          <Badge variant="secondary" className="mb-6">
            <Sparkles className="mr-1 h-3 w-3" />
            Private beta launching February 2025
          </Badge>
          
          {/* Main headline */}
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
            Get discovered by{' '}
            <span className="text-primary">AI in 60 seconds</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Stop waiting months for SEO. LocRaven gets your business found by ChatGPT, Claude, and Perplexity instantly.
          </p>
          
          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" asChild className="text-lg px-8">
              <Link href="/login">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              No credit card required • 2-minute setup
            </p>
          </div>
          
          {/* AI platforms */}
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground">Optimized for discovery on</p>
            <div className="flex items-center gap-8">
              <Badge variant="outline" className="text-sm">ChatGPT</Badge>
              <Badge variant="outline" className="text-sm">Claude</Badge>  
              <Badge variant="outline" className="text-sm">Perplexity</Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}