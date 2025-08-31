'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const founders = [
  {
    name: 'Michael Chen',
    title: 'CTO & Co-Founder',
    education: 'Computer Science @ UC Riverside',
    credentials: [
      'AMD University Program Award Winner',
      'Software Engineer Intern at MOBIVOLT',
      'Founded AI at UCR (50+ members)',
      'AI/ML Development & Systems Engineering'
    ]
  },
  {
    name: 'Justin Tan',
    title: 'CEO & Co-Founder', 
    education: 'Business Economics @ UC San Diego',
    credentials: [
      'Associate Consultant Intern at Mastercard',
      'Associate Consultant Intern at West Monroe',
      'VP External Relations, Business Council UCSD',
      'Product Management & Market Research'
    ]
  }
];

export function FoundersSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Founded by domain experts</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our team combines deep technical AI expertise with business strategy to solve the real challenge of AI discoverability.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {founders.map((founder) => (
            <Card key={founder.name}>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-1">{founder.name}</h3>
                  <p className="text-primary font-medium mb-1">{founder.title}</p>
                  <p className="text-sm text-muted-foreground">{founder.education}</p>
                </div>
                
                <div className="space-y-2">
                  {founder.credentials.map((credential) => (
                    <Badge key={credential} variant="secondary" className="mr-2 mb-2 text-xs">
                      {credential}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}