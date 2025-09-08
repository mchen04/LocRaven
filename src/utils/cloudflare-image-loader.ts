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

interface CloudflareImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | 'jpeg' | 'png';
  fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad';
  gravity?: 'auto' | 'side' | 'center' | 'top' | 'bottom' | 'left' | 'right';
  blur?: number;
  sharpen?: number;
}

function normalizeSrc(src: string): string {
  return src.startsWith('/') ? src : `/${src}`;
}

function buildTransformParams(options: CloudflareImageOptions): string {
  const params: string[] = [];
  
  if (options.width) params.push(`width=${options.width}`);
  if (options.height) params.push(`height=${options.height}`);
  if (options.quality) params.push(`quality=${options.quality}`);
  if (options.format) params.push(`format=${options.format}`);
  if (options.fit) params.push(`fit=${options.fit}`);
  if (options.gravity) params.push(`gravity=${options.gravity}`);
  if (options.blur) params.push(`blur=${options.blur}`);
  if (options.sharpen) params.push(`sharpen=${options.sharpen}`);
  
  return params.join(',');
}

export default function cloudflareLoader({ src, width, quality }: ImageLoaderProps): string {
  // Development: serve images directly without transformation
  if (process.env.NODE_ENV === 'development') {
    return src;
  }
  
  try {
    // Production: use enhanced Cloudflare Images transformations
    const options: CloudflareImageOptions = {
      width,
      quality: quality || 85,
      format: 'auto', // Auto-detect best format (WebP/AVIF)
      fit: 'scale-down', // Prevent upscaling
    };
    
    const paramsString = buildTransformParams(options);
    return `/cdn-cgi/image/${paramsString}${normalizeSrc(src)}`;
  } catch (error) {
    console.error('Cloudflare image transformation error:', error);
    // Fallback to original source on error
    return src;
  }
}

// Enhanced loader with custom options
export function cloudflareLoaderWithOptions(src: string, options: CloudflareImageOptions): string {
  if (process.env.NODE_ENV === 'development') {
    return src;
  }
  
  try {
    const paramsString = buildTransformParams(options);
    return `/cdn-cgi/image/${paramsString}${normalizeSrc(src)}`;
  } catch (error) {
    console.error('Cloudflare image transformation error:', error);
    return src;
  }
}