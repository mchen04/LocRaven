import React from 'react';
import { Card } from './ui/atoms';

interface StatCardData {
  label: string;
  value: number;
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

interface StatsCardsProps {
  totalPages: number;
  updatesToday: number;
  activePages: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({ totalPages, updatesToday, activePages }) => {
  const stats: StatCardData[] = [
    {
      label: 'Total Pages',
      value: totalPages,
      color: 'primary',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      label: 'Updates Today',
      value: updatesToday,
      color: 'success',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      label: 'Active Pages',
      value: activePages,
      color: 'secondary',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      primary: 'text-primary-600 bg-primary-50',
      secondary: 'text-secondary-600 bg-secondary-50', 
      success: 'text-success-600 bg-success-50',
      warning: 'text-warning-600 bg-warning-50',
      danger: 'text-danger-600 bg-danger-50'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.primary;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card 
          key={index}
          variant="default" 
          padding="md"
          className="hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {stat.value.toLocaleString()}
              </p>
            </div>
            {stat.icon && (
              <div className={`flex-shrink-0 p-3 rounded-full ${getColorClasses(stat.color || 'primary')}`}>
                {stat.icon}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;