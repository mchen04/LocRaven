// @ts-ignore - .open-next/worker.js is generated at build time
import { default as handler } from "./.open-next/worker.js";

// Helper functions for R2 static page serving
function isBusinessPage(pathname: string): boolean {
    // Match geo-discovery business page patterns: /us/ca/dublin/business-name/update-slug
    return /^\/us\/[a-z]{2}\/[^\/]+\//.test(pathname);
}

function isStaticAsset(pathname: string): boolean {
    // Match static assets like sitemap.xml, robots.txt
    return pathname === '/sitemap.xml' || pathname === '/robots.txt';
}

function getR2Key(pathname: string): string {
    // Convert URL pathname to R2 key
    if (pathname === '/sitemap.xml') return 'sitemap/index.html';
    if (pathname === '/robots.txt') return 'robots/index.html';
    
    // For business pages, add /index.html suffix to match R2 structure
    const key = pathname.startsWith('/') ? pathname.substring(1) : pathname;
    return key + '/index.html';
}

export default {
    async fetch(request: Request, env: any, ctx: any) {
        const url = new URL(request.url);
        
        // R2 Static Pages Proxy - Check for geo-discovery business pages first
        if (isBusinessPage(url.pathname) || isStaticAsset(url.pathname)) {
            try {
                const r2Key = getR2Key(url.pathname);
                const object = await env.LOCRAVEN_PAGES_BUCKET.get(r2Key);
                
                if (object !== null) {
                    const headers = new Headers();
                    object.writeHttpMetadata(headers);
                    headers.set("etag", object.httpEtag);
                    headers.set("cache-control", "public, max-age=86400, s-maxage=31536000");
                    
                    return new Response(object.body, {
                        status: 200,
                        headers
                    });
                }
            } catch (error) {
                console.error("R2 fetch error:", error);
                // Fall through to Next.js handler
            }
        }
        
        // Fall back to OpenNext handler for all other requests
        return handler.fetch(request, env, ctx);
    },
};

// Re-export the Durable Object handlers from OpenNext
// @ts-ignore - .open-next/worker.js is generated at build time
export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from "./.open-next/worker.js";