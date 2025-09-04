/**
 * Cloudflare Images custom loader for Next.js
 * 
 * Based on official OpenNext.js Cloudflare documentation
 * Uses FREE Cloudflare Images transformations service
 * 
 * @see https://opennext.js.org/cloudflare/howtos/image
 * @see https://developers.cloudflare.com/images/transform-images
 */

interface ImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

function normalizeSrc(src: string): string {
  return src.startsWith('/') ? src : `/${src}`;
}

export default function cloudflareLoader({ src, width, quality }: ImageLoaderProps): string {
  // Development: serve images directly without transformation
  if (process.env.NODE_ENV === 'development') {
    return src;
  }
  
  // Production: use Cloudflare Images transformations
  const params = [`width=${width}`];
  if (quality) {
    params.push(`quality=${quality}`);
  }
  
  const paramsString = params.join(',');
  return `/cdn-cgi/image/${paramsString}${normalizeSrc(src)}`;
}