'use client';

import { Card, CardContent } from '@/components/ui/card';

const stats = [
  {
    number: '112M+',
    label: 'Americans used AI search tools in 2024'
  },
  {
    number: '50%+',
    label: 'Google searches now show AI overviews'
  },
  {
    number: '6-12',
    label: 'Months small businesses wait for SEO results'
  },
  {
    number: '$526B',
    label: 'Digital marketing market growing 13% annually'
  },
  {
    number: '800M',
    label: 'ChatGPT weekly active users in 2025'
  },
  {
    number: '94%',
    label: 'Small businesses lack local SEO strategy'
  }
];

export function StatsGrid() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">The AI Search Revolution</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Traditional SEO is too slow for the AI-powered search era. Here's why businesses need AI discovery now.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <p className="text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}