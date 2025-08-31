'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, BarChart3, Eye } from 'lucide-react';

// Mock analytics data
const analyticsData = [
  {
    metric: 'Page Views',
    value: 1247,
    change: +12.5,
    period: 'vs last month'
  },
  {
    metric: 'AI Mentions',
    value: 89,
    change: +23.1,
    period: 'vs last month'  
  },
  {
    metric: 'Click-through Rate',
    value: 3.4,
    change: -2.1,
    period: 'vs last month',
    suffix: '%'
  },
  {
    metric: 'Avg. Session Duration',
    value: 142,
    change: +8.7,
    period: 'vs last month',
    suffix: 's'
  }
];

const topPages = [
  { title: 'Fresh Fish Tacos Special', views: 342, aiMentions: 24 },
  { title: 'Valentine\'s Day Menu', views: 289, aiMentions: 18 },
  { title: 'Weekend Brunch Hours', views: 187, aiMentions: 12 },
  { title: 'New Gluten-Free Options', views: 156, aiMentions: 8 }
];

export function AnalyticsChart() {
  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {analyticsData.map((metric) => (
          <Card key={metric.metric}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <Badge variant={metric.change > 0 ? 'default' : 'destructive'}>
                  {metric.change > 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(metric.change)}%
                </Badge>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">
                  {metric.value.toLocaleString()}{metric.suffix || ''}
                </div>
                <p className="text-sm text-muted-foreground">{metric.metric}</p>
                <p className="text-xs text-muted-foreground mt-1">{metric.period}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Performing Pages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Top Performing Pages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPages.map((page, index) => (
              <div key={page.title} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{page.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {page.views} views • {page.aiMentions} AI mentions
                    </p>
                  </div>
                </div>
                <Badge variant="outline">
                  {page.aiMentions} mentions
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Interactive chart coming soon</p>
              <p className="text-sm text-muted-foreground">Will show AI mentions and page views over time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}