/**
 * Custom image loader for Cloudflare Images
 * 
 * This loader integrates with Cloudflare's image optimization service
 * to provide automatic image resizing, format conversion, and quality optimization.
 * 
 * Replaces Next.js built-in image optimization to maintain compatibility
 * with Cloudflare Pages free plan while still providing image optimization benefits.
 * 
 * @see https://developers.cloudflare.com/images/transform-images
 */

export default function cloudflareLoader({ src, width, quality }) {
  // Use Cloudflare's image optimization parameters
  const params = [
    `width=${width}`,
    `quality=${quality || 75}`,
    'format=auto' // Automatically serve WebP/AVIF when supported
  ];

  // For local images (starting with /), use Cloudflare's CDN transformation
  if (src.startsWith('/')) {
    return `https://locraven.com/cdn-cgi/image/${params.join(',')}${src}`;
  }
  
  // For external images, return as-is (they should already be optimized)
  return src;
}