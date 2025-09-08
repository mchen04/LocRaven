import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { TransformedGeneratedPage } from '@/utils/page-transformers';

interface PageSelectorProps {
  page: TransformedGeneratedPage;
  isSelected: boolean;
  onSelectionChange: (pageId: string, selected: boolean) => void;
  disabled?: boolean;
}

export function PageSelector({ 
  page, 
  isSelected, 
  onSelectionChange, 
  disabled = false 
}: PageSelectorProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={`page-${page.id}`}
        checked={isSelected}
        disabled={disabled}
        onCheckedChange={(checked) => {
          onSelectionChange(page.id, checked === true);
        }}
      />
      <label 
        htmlFor={`page-${page.id}`}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
      >
        Select
      </label>
    </div>
  );
}

interface BulkPageSelectorProps {
  pages: TransformedGeneratedPage[];
  selectedPages: Set<string>;
  onSelectionChange: (pageIds: string[], selected: boolean) => void;
  disabled?: boolean;
  filter?: (page: TransformedGeneratedPage) => boolean;
}

export function BulkPageSelector({
  pages,
  selectedPages,
  onSelectionChange,
  disabled = false,
  filter
}: BulkPageSelectorProps) {
  const filteredPages = filter ? pages.filter(filter) : pages;
  const selectablePages = filteredPages.filter(page => page.hasValidFilePath);
  const selectableIds = selectablePages.map(page => page.id);
  
  const selectedCount = selectableIds.filter(id => selectedPages.has(id)).length;
  const isAllSelected = selectableIds.length > 0 && selectedCount === selectableIds.length;
  const isPartiallySelected = selectedCount > 0 && selectedCount < selectableIds.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      // Deselect all
      onSelectionChange(selectableIds, false);
    } else {
      // Select all
      onSelectionChange(selectableIds, true);
    }
  };

  if (selectablePages.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="select-all-pages"
          checked={isAllSelected}
          ref={(el) => {
            if (el && 'indeterminate' in el) {
              (el as any).indeterminate = isPartiallySelected;
            }
          }}
          disabled={disabled || selectablePages.length === 0}
          onCheckedChange={handleSelectAll}
        />
        <label 
          htmlFor="select-all-pages"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          Select All ({selectablePages.length} pages)
        </label>
      </div>
      
      {selectedCount > 0 && (
        <div className="text-sm text-muted-foreground">
          {selectedCount} of {selectablePages.length} selected
        </div>
      )}
    </div>
  );
}

interface BulkActionsProps {
  selectedPages: Set<string>;
  pages: TransformedGeneratedPage[];
  onPublishSelected: (pageIds: string[]) => void;
  onDeleteSelected: (pageIds: string[]) => void;
  isPublishing?: boolean;
  isDeleting?: boolean;
  filter?: (page: TransformedGeneratedPage) => boolean;
}

export function BulkActions({
  selectedPages,
  pages,
  onPublishSelected,
  onDeleteSelected,
  isPublishing = false,
  isDeleting = false,
  filter
}: BulkActionsProps) {
  const filteredPages = filter ? pages.filter(filter) : pages;
  const selectedPageIds = Array.from(selectedPages);
  const selectedValidPages = filteredPages.filter(page => 
    selectedPages.has(page.id) && page.hasValidFilePath
  );
  
  const unpublishedSelected = selectedValidPages.filter(page => !page.published);
  
  const canPublish = unpublishedSelected.length > 0;
  const canDelete = selectedValidPages.length > 0;

  if (selectedPages.size === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
      <div className="flex-1 text-sm text-muted-foreground">
        {selectedValidPages.length} page{selectedValidPages.length !== 1 ? 's' : ''} selected
      </div>
      
      <div className="flex gap-2">
        {canPublish && (
          <Button
            size="sm"
            onClick={() => onPublishSelected(unpublishedSelected.map(p => p.id))}
            disabled={isPublishing}
          >
            {isPublishing ? 'Publishing...' : `Publish ${unpublishedSelected.length}`}
          </Button>
        )}
        
        {canDelete && (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDeleteSelected(selectedPageIds)}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : `Delete ${selectedValidPages.length}`}
          </Button>
        )}
      </div>
    </div>
  );
}