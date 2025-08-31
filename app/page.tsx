import Link from 'next/link';
import { HeroSection } from '@/components/landing/hero-section';
import { StatsGrid } from '@/components/landing/stats-grid';
import { FoundersSection } from '@/components/landing/founders-section';
import { PricingCards } from '@/components/landing/pricing-cards';
import { Navigation } from '@/components/landing/navigation';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <HeroSection />
      <StatsGrid />
      <FoundersSection />
      <PricingCards />
      
      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-5">
            <div className="md:col-span-1">
              <h3 className="text-lg font-semibold">LocRaven</h3>
              <p className="text-sm text-muted-foreground mt-2">
                AI-discoverable business updates in 60 seconds
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#pricing" className="hover:text-foreground">Pricing</a></li>
                <li><Link href="/login" className="hover:text-foreground">Get Started</Link></li>
                <li><Link href="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#about" className="hover:text-foreground">About</a></li>
                <li><a href="/blog" className="hover:text-foreground">Blog</a></li>
                <li><a href="/careers" className="hover:text-foreground">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/help" className="hover:text-foreground">Help Center</a></li>
                <li><a href="/docs" className="hover:text-foreground">Documentation</a></li>
                <li><a href="/status" className="hover:text-foreground">Status</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/privacy" className="hover:text-foreground">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-foreground">Terms of Service</a></li>
                <li><a href="/security" className="hover:text-foreground">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              © 2025 LocRaven. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}