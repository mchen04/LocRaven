import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import type { TransformedGeneratedPage } from '@/utils/page-transformers';

interface PageActionsProps {
  page: TransformedGeneratedPage;
  onPublish?: (page: TransformedGeneratedPage) => void;
  onDelete?: (page: TransformedGeneratedPage) => void;
  isPublishing?: boolean;
  isDeleting?: boolean;
  showPreview?: boolean;
  showPublish?: boolean;
  showDelete?: boolean;
  layout?: 'horizontal' | 'vertical';
  size?: 'sm' | 'default' | 'lg';
}

export function PageActions({
  page,
  onPublish,
  onDelete,
  isPublishing = false,
  isDeleting = false,
  showPreview = true,
  showPublish = true,
  showDelete = true,
  layout = 'horizontal',
  size = 'sm'
}: PageActionsProps) {
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

  const containerClasses = layout === 'vertical' 
    ? 'flex flex-col gap-2' 
    : 'flex flex-wrap gap-2';

  const buttonClasses = layout === 'vertical' 
    ? 'w-full text-xs sm:text-sm' 
    : 'flex-1 sm:flex-none text-xs sm:text-sm';

  return (
    <div className={containerClasses}>
      {!page.published ? (
        <>
          {/* Preview Button */}
          {showPreview && (
            <Button 
              size={size}
              variant='secondary' 
              asChild
              disabled={!page.hasValidFilePath}
              className={buttonClasses}
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
          )}
          
          {/* Publish Button */}
          {showPublish && onPublish && (
            <Button
              size={size}
              onClick={() => onPublish(page)}
              disabled={isPublishing || !page.hasValidFilePath}
              className={buttonClasses}
            >
              {isPublishing ? 'Publishing...' : 'Publish'}
            </Button>
          )}
        </>
      ) : (
        /* View Live Button */
        <Button 
          size={size}
          variant='outline' 
          asChild
          disabled={!page.hasValidFilePath}
          className={buttonClasses}
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
      {showDelete && onDelete && (
        <Button
          size={size}
          variant='destructive'
          onClick={() => onDelete(page)}
          disabled={isDeleting}
          className={buttonClasses}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      )}
    </div>
  );
}

// Convenience component for common use cases
export function PageActionsCompact(props: Omit<PageActionsProps, 'layout' | 'size'>) {
  return <PageActions {...props} layout="horizontal" size="sm" />;
}

export function PageActionsStacked(props: Omit<PageActionsProps, 'layout' | 'size'>) {
  return <PageActions {...props} layout="vertical" size="sm" />;
}

export function PageActionsLarge(props: Omit<PageActionsProps, 'layout' | 'size'>) {
  return <PageActions {...props} layout="horizontal" size="default" />;
}