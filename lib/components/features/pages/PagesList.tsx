'use client';

import { GeneratedPage } from '../../../../types';
import { config } from '../../../utils/config';
import Button from '../../ui/atoms/Button';
import Card from '../../ui/atoms/Card';
import { cn } from '../../../utils/cn';
import { themeClasses, themeClass } from '../../../theme/utils';

interface PagesListProps {
  pages: GeneratedPage[];
  onDeletePage: (pageId: string) => Promise<void>;
}

const PagesList: React.FC<PagesListProps> = ({ pages, onDeletePage }) => {
  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' minutes ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' hours ago';
    if (seconds < 604800) return Math.floor(seconds / 86400) + ' days ago';
    
    return new Date(date).toLocaleDateString();
  };

  const handleDelete = async (pageId: string) => {
    if (confirm('Are you sure you want to delete this page?')) {
      await onDeletePage(pageId);
    }
  };

  const extractReadableTitle = (filePath: string) => {
    const pathParts = filePath.split('/');
    const fileName = pathParts[pathParts.length - 1].replace('.html', '');
    return fileName.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Card variant="elevated" padding="lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className={cn(themeClasses.heading(), 'text-2xl')}>🌐 Your Generated Pages</h2>
        <span className={cn('px-3 py-1 rounded-full text-sm font-medium', themeClass('bg-primary-light'), themeClass('text-primary'))}>
          <span>{pages.length}</span> pages
        </span>
      </div>
      
      <div className="space-y-4">
        {pages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📄</div>
            <div className={cn(themeClasses.heading(), 'text-xl mb-2')}>No pages yet</div>
            <div className={themeClass('text-muted')}>
              Create your first update to generate AI-discoverable pages
            </div>
          </div>
        ) : (
          pages.map(page => {
            const pageUrl = page.file_path;
            const readableTitle = page.title || extractReadableTitle(page.file_path);
            
            return (
              <Card key={page.id} variant="outlined" padding="md" className="border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className={cn(themeClasses.heading(), 'text-lg')}>{readableTitle}</div>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-xs font-medium rounded-full">
                    LIVE
                  </span>
                </div>
                <a 
                  href={`${config.env.appUrl}${pageUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={cn('block mb-3 text-sm hover:underline', themeClass('text-primary'))}
                >
                  {config.env.appUrl.replace(/^https?:\/\//, '')}{pageUrl}
                </a>
                <div className="flex items-center justify-between">
                  <span className={cn('text-sm', themeClass('text-muted'))}>Created {getTimeAgo(page.created_at || '')}</span>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`${config.env.appUrl}${pageUrl}`, '_blank')}
                    >
                      View Page
                    </Button>
                    <Button 
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(page.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </Card>
  );
};

export default PagesList;