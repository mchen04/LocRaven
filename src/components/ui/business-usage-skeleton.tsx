import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton loader for business usage info section
 * Matches the layout and dimensions of the actual usage display
 */
export function BusinessUsageSkeleton() {
  return (
    <div className='flex items-center justify-between rounded-md bg-zinc-900 p-4'>
      <div className='space-y-2'>
        <Skeleton className='h-5 w-48 bg-zinc-800' />
        <Skeleton className='h-4 w-32 bg-zinc-800' />
      </div>
      <div className='space-y-2 text-right'>
        <Skeleton className='h-4 w-24 bg-zinc-800' />
        <Skeleton className='h-6 w-16 bg-zinc-800' />
      </div>
    </div>
  );
}