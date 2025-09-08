import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import type { TransformedGeneratedPage } from '@/utils/page-transformers';

interface DeleteConfirmationProps {
  page?: TransformedGeneratedPage;
  pages?: TransformedGeneratedPage[];
  onConfirm: () => void;
  isDeleting?: boolean;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DeleteConfirmation({
  page,
  pages,
  onConfirm,
  isDeleting = false,
  trigger,
  open,
  onOpenChange
}: DeleteConfirmationProps) {
  const isMultiple = pages && pages.length > 1;
  const isSingle = page && !pages;
  const count = pages?.length || 0;
  
  const title = isMultiple 
    ? `Delete ${count} pages?`
    : `Delete "${page?.title || 'page'}"?`;
    
  const description = isMultiple
    ? `Are you sure you want to delete these ${count} pages? This action cannot be undone and will permanently remove the pages from both preview and live sites.`
    : `Are you sure you want to delete this page? This action cannot be undone and will permanently remove "${page?.title}" from both preview and live sites.`;

  const defaultTrigger = (
    <Button 
      variant="destructive" 
      size="sm"
      disabled={isDeleting}
    >
      {isDeleting ? 'Deleting...' : (isMultiple ? `Delete ${count}` : 'Delete')}
    </Button>
  );

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && (
        <AlertDialogTrigger asChild>
          {trigger}
        </AlertDialogTrigger>
      )}
      {!trigger && !open && (
        <AlertDialogTrigger asChild>
          {defaultTrigger}
        </AlertDialogTrigger>
      )}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {/* Show page details for confirmation */}
        {isSingle && page && (
          <div className="rounded-md bg-muted p-3 text-sm">
            <div className="font-medium">{page.title}</div>
            <div className="text-muted-foreground">
              {page.slug} • {page.published ? 'Published' : 'Draft'}
            </div>
          </div>
        )}
        
        {isMultiple && pages && (
          <div className="rounded-md bg-muted p-3 text-sm max-h-32 overflow-y-auto">
            <div className="font-medium mb-2">Pages to delete:</div>
            {pages.slice(0, 5).map((p, _index) => (
              <div key={p.id} className="text-muted-foreground">
                • {p.title}
              </div>
            ))}
            {pages.length > 5 && (
              <div className="text-muted-foreground">
                ... and {pages.length - 5} more
              </div>
            )}
          </div>
        )}
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting...' : (isMultiple ? `Delete ${count} Pages` : 'Delete Page')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Convenience component for single page deletion
interface DeletePageConfirmationProps {
  page: TransformedGeneratedPage;
  onConfirm: () => void;
  isDeleting?: boolean;
  trigger?: React.ReactNode;
}

export function DeletePageConfirmation({ page, onConfirm, isDeleting, trigger }: DeletePageConfirmationProps) {
  return (
    <DeleteConfirmation
      page={page}
      onConfirm={onConfirm}
      isDeleting={isDeleting}
      trigger={trigger}
    />
  );
}

// Convenience component for multiple page deletion
interface DeletePagesConfirmationProps {
  pages: TransformedGeneratedPage[];
  onConfirm: () => void;
  isDeleting?: boolean;
  trigger?: React.ReactNode;
}

export function DeletePagesConfirmation({ pages, onConfirm, isDeleting, trigger }: DeletePagesConfirmationProps) {
  return (
    <DeleteConfirmation
      pages={pages}
      onConfirm={onConfirm}
      isDeleting={isDeleting}
      trigger={trigger}
    />
  );
}