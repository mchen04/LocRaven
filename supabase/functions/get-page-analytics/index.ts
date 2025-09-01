import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { 
  createSupabaseClient, 
  errorResponse, 
  successResponse, 
  handleCors, 
  safeJsonParse
} from '../_shared/utils.ts'

interface AnalyticsRequest {
  paths?: string[];           // Specific page paths to analyze
  dateRange?: string;         // "1d", "7d", "30d" or custom
  startDate?: string;         // Custom start date (ISO format)
  endDate?: string;          // Custom end date (ISO format)
  zoneId?: string;           // Cloudflare Zone ID (optional)
}

interface AnalyticsResponse {
  path: string;
  pageViews: number;
  uniqueVisitors: number;
  requests: number;
  bandwidth: number;
  avgResponseTime?: number;
  topCountries?: Array<{country: string, views: number}>;
  dateRange: {
    start: string;
    end: string;
  };
}

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { 
      paths, 
      dateRange = '7d', 
      startDate, 
      endDate,
      zoneId 
    }: AnalyticsRequest = await safeJsonParse(req);

    // Get Cloudflare credentials
    const cloudflareToken = Deno.env.get('CLOUDFLARE_ANALYTICS_TOKEN');
    const defaultZoneId = Deno.env.get('CLOUDFLARE_ZONE_ID');
    
    if (!cloudflareToken) {
      throw new Error('CLOUDFLARE_ANALYTICS_TOKEN not configured');
    }

    const targetZoneId = zoneId || defaultZoneId;
    if (!targetZoneId) {
      throw new Error('Zone ID required (provide zoneId or set CLOUDFLARE_ZONE_ID)');
    }

    // Calculate date range
    const { start, end } = calculateDateRange(dateRange, startDate, endDate);
    
    // If no specific paths provided, get analytics for all published pages
    let analyticsPath = paths;
    if (!analyticsPath || analyticsPath.length === 0) {
      const supabase = createSupabaseClient();
      const { data: publishedPages } = await supabase
        .from('generated_pages')
        .select('file_path')
        .eq('published', true)
        .limit(50); // Limit to prevent large queries
      
      analyticsPath = publishedPages?.map(p => p.file_path) || [];
    }

    if (analyticsPath.length === 0) {
      return successResponse({
        analytics: [],
        message: 'No pages found for analytics',
        dateRange: { start, end }
      });
    }

    // Query Cloudflare GraphQL API for each path
    const analyticsPromises = analyticsPath.map(async (path) => {
      try {
        return await queryCloudflareAnalytics(cloudflareToken, targetZoneId, path, start, end);
      } catch (error) {
        console.error(`Error fetching analytics for ${path}:`, error);
        return {
          path,
          pageViews: 0,
          uniqueVisitors: 0,
          requests: 0,
          bandwidth: 0,
          error: error.message,
          dateRange: { start, end }
        };
      }
    });

    const analyticsResults = await Promise.all(analyticsPromises);

    // Calculate totals
    const totalViews = analyticsResults.reduce((sum, result) => sum + result.pageViews, 0);
    const totalVisitors = analyticsResults.reduce((sum, result) => sum + result.uniqueVisitors, 0);
    const totalRequests = analyticsResults.reduce((sum, result) => sum + result.requests, 0);

    return successResponse({
      analytics: analyticsResults,
      summary: {
        totalPages: analyticsResults.length,
        totalPageViews: totalViews,
        totalUniqueVisitors: totalVisitors,
        totalRequests: totalRequests,
        dateRange: { start, end },
        averageViewsPerPage: totalViews / analyticsResults.length
      },
      queryTime: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in get-page-analytics:', error);
    return errorResponse(error instanceof Error ? error.message : 'Unknown error');
  }
});

async function queryCloudflareAnalytics(
  token: string, 
  zoneId: string, 
  path: string, 
  startDate: string, 
  endDate: string
): Promise<AnalyticsResponse> {
  
  const query = `
    query GetPathAnalytics($zoneTag: string, $filter: ZoneHttpRequests1dGroupsFilter_InputObject) {
      viewer {
        zones(filter: {zoneTag: $zoneTag}) {
          httpRequests1dGroups(
            filter: $filter
            limit: 1000
            orderBy: [datetime_ASC]
          ) {
            sum {
              requests
              pageViews  
              bytes
            }
            uniq {
              uniques
            }
            avg {
              edgeResponseTime
            }
            dimensions {
              datetime
              clientRequestPath
              clientCountryName
            }
          }
        }
      }
    }
  `;

  const variables = {
    zoneTag: zoneId,
    filter: {
      datetime_gte: startDate,
      datetime_lte: endDate,
      clientRequestPath: path
    }
  };

  const response = await fetch('https://api.cloudflare.com/client/v4/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables })
  });

  if (!response.ok) {
    throw new Error(`Cloudflare API error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
  }

  // Process the analytics data
  const groups = result.data?.viewer?.zones?.[0]?.httpRequests1dGroups || [];
  
  const pageViews = groups.reduce((sum, group) => sum + (group.sum?.pageViews || 0), 0);
  const requests = groups.reduce((sum, group) => sum + (group.sum?.requests || 0), 0);
  const bandwidth = groups.reduce((sum, group) => sum + (group.sum?.bytes || 0), 0);
  const uniqueVisitors = groups.reduce((sum, group) => sum + (group.uniq?.uniques || 0), 0);
  
  // Calculate average response time
  const responseTimes = groups.map(g => g.avg?.edgeResponseTime).filter(Boolean);
  const avgResponseTime = responseTimes.length > 0 
    ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length 
    : 0;

  // Get top countries
  const countryMap = new Map();
  groups.forEach(group => {
    const country = group.dimensions?.clientCountryName;
    if (country) {
      countryMap.set(country, (countryMap.get(country) || 0) + (group.sum?.pageViews || 0));
    }
  });

  const topCountries = Array.from(countryMap.entries())
    .map(([country, views]) => ({country, views}))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  return {
    path,
    pageViews,
    uniqueVisitors,
    requests,
    bandwidth,
    avgResponseTime,
    topCountries,
    dateRange: { start: startDate, end: endDate }
  };
}

function calculateDateRange(dateRange: string, startDate?: string, endDate?: string): {start: string, end: string} {
  const now = new Date();
  let start: Date;
  let end = now;

  if (startDate && endDate) {
    return { start: startDate, end: endDate };
  }

  switch (dateRange) {
    case '1d':
      start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case '7d':
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  return {
    start: start.toISOString(),
    end: end.toISOString()
  };
}