'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  TrendingUp, 
  FileText, 
  Eye, 
  Calendar
} from 'lucide-react';

// Mock data - will be replaced with real hooks
const stats = [
  {
    title: 'Total Pages',
    value: '12',
    icon: FileText,
    trend: '+2 this month',
    color: 'text-blue-600'
  },
  {
    title: 'Active Pages',
    value: '8', 
    icon: Eye,
    trend: '4 expired',
    color: 'text-green-600'
  },
  {
    title: 'Updates Today',
    value: '3',
    icon: Calendar,
    trend: 'Last: 2 hours ago',
    color: 'text-purple-600'
  },
  {
    title: 'AI Discoveries',
    value: '24',
    icon: TrendingUp,
    trend: '+8 this week',
    color: 'text-orange-600'
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <h3 className="ml-2 text-sm font-medium">{stat.title}</h3>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.trend}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="ml-2 h-4 w-20" />
            </div>
            <div className="mt-2">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="mt-1 h-3 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}