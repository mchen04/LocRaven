import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import type { TransformedGeneratedPage } from '@/utils/page-transformers';

import { PageSelector } from './PageSelector';

interface PageCardProps {
  page: TransformedGeneratedPage;
  onPublish?: (page: TransformedGeneratedPage) => void;
  onDelete?: (page: TransformedGeneratedPage) => void;
  isPublishing?: boolean;
  isDeleting?: boolean;
  showActions?: boolean;
  // Selection props
  isSelected?: boolean;
  onSelectionChange?: (pageId: string, selected: boolean) => void;
  showSelector?: boolean;
}

export function PageCard({
  page,
  onPublish,
  onDelete,
  isPublishing = false,
  isDeleting = false,
  showActions = true,
  isSelected = false,
  onSelectionChange,
  showSelector = false
}: PageCardProps) {
  const { toast } = useToast();

  const handlePreviewClick = (e: React.MouseEvent) => {
    if (!page.hasValidFilePath) {
      e.preventDefault();
      toast({
        title: "Preview not available",
        description: "This page has an invalid file path",
        variant: "destructive"
      });
    }
  };

  const handleLiveUrlClick = (e: React.MouseEvent) => {
    if (!page.hasValidFilePath) {
      e.preventDefault();
      toast({
        title: "Page not available",
        description: "This page has an invalid file path",
        variant: "destructive"
      });
    }
  };

  return (
    <div className='rounded-md bg-zinc-800 p-4'>
      <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between'>
        <div className='flex-1 mb-4 lg:mb-0'>
          {/* Page Title and Status */}
          <div className='flex items-center gap-3 mb-2 flex-wrap'>
            {showSelector && onSelectionChange && (
              <PageSelector
                page={page}
                isSelected={isSelected}
                onSelectionChange={onSelectionChange}
                disabled={isPublishing || isDeleting}
              />
            )}
            <h3 className='font-medium text-white text-lg'>{page.title}</h3>
            <div className='flex items-center gap-2'>
              <Badge
                variant={page.published ? 'default' : 'secondary'}
                className='text-xs'
              >
                {page.published ? 'Published' : 'Draft'}
              </Badge>
              {page.intent_type && (
                <Badge variant='outline' className='text-xs'>
                  {page.intent_type}
                </Badge>
              )}
              {!page.hasValidFilePath && (
                <Badge variant='destructive' className='text-xs'>
                  Invalid Path
                </Badge>
              )}
            </div>
          </div>
          
          {/* Page Slug */}
          <div className='mb-3'>
            <p className='text-sm text-zinc-400 break-all'>
              {page.slug ? `Slug: ${page.slug}` : 'No slug available'}
            </p>
          </div>
          
          {/* Page Metadata */}
          <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-zinc-400'>
            <span>Type: {page.page_type || 'Unknown'}</span>
            <span>Created: {new Date(page.created_at).toLocaleDateString()}</span>
            {page.published_at && (
              <span>Published: {new Date(page.published_at).toLocaleDateString()}</span>
            )}
            {page.expires_at && (
              <span>Expires: {new Date(page.expires_at).toLocaleDateString()}</span>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        {showActions && (
          <div className='flex flex-wrap gap-2 lg:ml-4 lg:flex-col'>
            {!page.published ? (
              <>
                {/* Preview Button */}
                <Button 
                  size='sm' 
                  variant='secondary' 
                  asChild
                  disabled={!page.hasValidFilePath}
                  className='flex-1 sm:flex-none text-xs sm:text-sm'
                >
                  <a 
                    href={page.previewUrl || '#'} 
                    target='_blank' 
                    rel='noopener noreferrer'
                    onClick={handlePreviewClick}
                  >
                    Preview
                  </a>
                </Button>
                
                {/* Publish Button */}
                {onPublish && (
                  <Button
                    size='sm'
                    onClick={() => onPublish(page)}
                    disabled={isPublishing || !page.hasValidFilePath}
                    className='flex-1 sm:flex-none text-xs sm:text-sm'
                  >
                    {isPublishing ? 'Publishing...' : 'Publish'}
                  </Button>
                )}
              </>
            ) : (
              /* View Live Button */
              <Button 
                size='sm' 
                variant='outline' 
                asChild
                disabled={!page.hasValidFilePath}
                className='flex-1 sm:flex-none text-xs sm:text-sm'
              >
                <a 
                  href={page.liveUrl || '#'} 
                  target='_blank' 
                  rel='noopener noreferrer'
                  onClick={handleLiveUrlClick}
                >
                  View Live
                </a>
              </Button>
            )}
            
            {/* Delete Button */}
            {onDelete && (
              <Button
                size='sm'
                variant='destructive'
                onClick={() => onDelete(page)}
                disabled={isDeleting}
                className='flex-1 sm:flex-none text-xs sm:text-sm'
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}