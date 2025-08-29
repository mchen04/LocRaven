'use client';

import { GeneratedPage } from '../../../../types';
import { config } from '../../../utils/config';

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
    <div className="card">
      <div className="pages-header">
        <h2 className="card-title">🌐 Your Generated Pages</h2>
        <span className="page-count">
          <span>{pages.length}</span> pages
        </span>
      </div>
      
      <div className="pages-list">
        {pages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <div className="empty-title">No pages yet</div>
            <div className="empty-text">
              Create your first update to generate AI-discoverable pages
            </div>
          </div>
        ) : (
          pages.map(page => {
            const pageUrl = page.file_path + '.html';
            const readableTitle = page.title || extractReadableTitle(page.file_path);
            
            return (
              <div key={page.id} className="page-item">
                <div className="page-header">
                  <div className="page-title">{readableTitle}</div>
                  <span className="page-badge">LIVE</span>
                </div>
                <a 
                  href={`${config.env.appUrl}${pageUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="page-url"
                >
                  {config.env.appUrl.replace(/^https?:\/\//, '')}{pageUrl}
                </a>
                <div className="page-meta">
                  <span>Created {getTimeAgo(page.created_at || '')}</span>
                  <div className="page-actions">
                    <button 
                      className="btn-view" 
                      onClick={() => window.open(`${config.env.appUrl}${pageUrl}`, '_blank')}
                    >
                      View Page
                    </button>
                    <button 
                      className="btn-delete" 
                      onClick={() => handleDelete(page.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PagesList;