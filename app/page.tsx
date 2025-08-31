import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Welcome to LocRaven
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            AI-Discoverable Business Updates in 60 Seconds
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/login">
              <Button size="lg">
                Get Started
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" size="lg">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Updates</CardTitle>
                <CardDescription>
                  Generate professional business updates using advanced AI technology
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>SEO Optimized</CardTitle>
                <CardDescription>
                  Boost your local search presence with AI-optimized content
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quick Setup</CardTitle>
                <CardDescription>
                  Get started in under 60 seconds with our streamlined onboarding
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Track performance and engagement with detailed analytics
                </CardDescription>
              </CardHeader>
            </Card>
          </dl>
        </div>
      </div>
    </div>
  )
}