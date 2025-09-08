'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function Analytics() {
  useReportWebVitals((metric) => {
    // Log Core Web Vitals to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Web Vitals:', metric)
    }

    // Send to analytics service in production
    if (process.env.NODE_ENV === 'production') {
      // You can send metrics to your analytics service here
      // Examples: Google Analytics, Vercel Analytics, etc.
      
      // Example Google Analytics 4 integration:
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', metric.name, {
          value: Math.round(
            metric.name === 'CLS' ? metric.value * 1000 : metric.value
          ),
          event_category: 'Web Vitals',
          event_label: metric.id,
          non_interaction: true,
        })
      }

      // Example custom analytics endpoint:
      fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metric: metric.name,
          value: metric.value,
          id: metric.id,
          label: metric.label,
          url: window.location.href,
          timestamp: Date.now(),
        }),
      }).catch((error) => {
        console.error('Failed to send web vitals:', error)
      })
    }
  })

  return null
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}