import { Clock, ExternalLink } from 'lucide-react';
import type { WebsiteInfo } from "../../../services/ai/geminiApi";

interface PagePreviewDisplayProps {
  websiteInfo: WebsiteInfo;
  currentUrl: string;
  recentlyUpdatedFields?: Record<string, boolean>;
  updateCount?: number;
}

const PagePreviewDisplay: React.FC<PagePreviewDisplayProps> = ({ 
  websiteInfo, 
  currentUrl, 
  recentlyUpdatedFields = {},
  updateCount = 0
}) => {
  // Check if key preview fields were recently updated
  const titleUpdated = recentlyUpdatedFields['previewData.title'] || recentlyUpdatedFields['updateContent'];
  const descriptionUpdated = recentlyUpdatedFields['previewData.description'] || recentlyUpdatedFields['updateContent'];
  
  return (
    <div className="page-preview-display" style={{
      border: updateCount > 0 ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid transparent',
      borderRadius: '0.5rem',
      padding: '0.75rem',
      transition: 'all 0.3s ease',
      backgroundColor: updateCount > 0 ? 'rgba(34, 197, 94, 0.05)' : 'transparent'
    }}>
      {updateCount > 0 && (
        <div style={{ 
          fontSize: 'var(--text-xs)', 
          color: '#22c55e', 
          marginBottom: '0.5rem',
          fontWeight: 'var(--font-weight-medium)'
        }}>
          ✨ Preview updated!
        </div>
      )}
      <div className="preview-header">
        <h2 className="preview-title" style={{
          color: titleUpdated ? '#22c55e' : '#1f2937',
          fontWeight: titleUpdated ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
          transition: 'all 0.3s ease'
        }}>
          {websiteInfo.previewData?.title || websiteInfo.updateContent}
        </h2>
        <div className="preview-meta">
          <Clock size={14} />
          <span>
            {websiteInfo.temporalInfo?.expiresAt 
              ? `Expires: ${new Date(websiteInfo.temporalInfo.expiresAt).toLocaleDateString()}`
              : 'No expiration set'
            }
          </span>
        </div>
      </div>

      <div className="preview-url">
        <ExternalLink size={14} />
        <span>{currentUrl}</span>
      </div>

      <div className="preview-content">
        <p style={{
          color: descriptionUpdated ? '#22c55e' : '#e5e7eb',
          fontWeight: descriptionUpdated ? 'var(--font-weight-medium)' : 'var(--font-weight-regular)',
          transition: 'all 0.3s ease'
        }}>
          {websiteInfo.previewData?.description || websiteInfo.updateContent}
        </p>
        
        {websiteInfo.previewData?.eventDescription && (
          <div className="event-description" style={{
            marginTop: '0.75rem',
            padding: '0.75rem',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '0.375rem',
            borderLeft: '3px solid #3b82f6'
          }}>
            <h4 style={{
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '0.375rem',
              color: '#1f2937'
            }}>
              Event Details
            </h4>
            <p style={{
              fontSize: '13px',
              color: '#6b7280',
              lineHeight: '1.4'
            }}>
              {websiteInfo.previewData.eventDescription}
            </p>
          </div>
        )}
        
        {websiteInfo.previewData?.highlights && (
          <ul className="preview-highlights">
            {websiteInfo.previewData.highlights.map((highlight, index) => (
              <li key={index}>{highlight}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PagePreviewDisplay;