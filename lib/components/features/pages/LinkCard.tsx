'use client';


import { ExternalLink } from 'lucide-react';
import { GeneratedPage } from '../../../../types';
import { formatCreatedDate, formatExpiredDate } from '../../../utils/dateFormatters';
import { formatExpirationTime, isExpiringSoon } from '../../../services/data/expirationService';
import { generatePageUrl } from '../../../utils/urlHelpers';
import Dropdown, { DropdownItem } from '../../ui/molecules/Dropdown';

export interface LinkCardProps {
  page: GeneratedPage;
  variant: 'active' | 'expired';
  onPageClick: (page: GeneratedPage) => void;
  dropdownActions?: DropdownItem[];
  className?: string;
  showDropdown?: boolean;
  loading?: boolean;
}

const LinkCard: React.FC<LinkCardProps> = ({
  page,
  variant,
  onPageClick,
  dropdownActions = [],
  className = '',
  showDropdown = true,
  loading = false
}) => {
  const isActive = variant === 'active';
  const expiresAt = page.expires_at;
  const expiredAt = page.expired_at;
  const expiringSoon = isActive && expiresAt ? isExpiringSoon(expiresAt) : false;

  const cardClasses = [
    'link-card',
    variant,
    expiringSoon ? 'expiring-soon' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses}>
      {/* Card Header */}
      <div className="link-card-header">
        <div className="link-info">
          <h3 className="link-title">{page.title}</h3>
          <span className="link-type">{page.page_type}</span>
        </div>
        
        {/* Dropdown Menu */}
        {showDropdown && dropdownActions.length > 0 && page.page_type !== 'business' && (
          <Dropdown
            items={dropdownActions}
            disabled={loading}
          />
        )}
      </div>

      {/* URL Display */}
      <div className="link-url" onClick={() => onPageClick(page)}>
        <ExternalLink size={14} />
        <span>{page.file_path}</span>
      </div>

      {/* Metadata */}
      <div className="link-metadata">
        <div className="metadata-item">
          <span className="metadata-label">Created:</span>
          <span className="metadata-value">
            {page.created_at ? formatCreatedDate(page.created_at) : 'Unknown'}
          </span>
        </div>
        
        <div className="metadata-item">
          <span className="metadata-label">
            {isActive ? 'Expires:' : 'Expired:'}
          </span>
          <span className={`metadata-value ${expiringSoon ? 'expiring' : ''} ${!expiresAt && isActive ? 'permanent' : ''} ${!isActive ? 'expired' : ''}`}>
            {isActive 
              ? (expiresAt ? formatExpirationTime(expiresAt) : 'Never')
              : (
                  <>
                    {formatExpiredDate(expiredAt, expiresAt)}
                    {!expiredAt && expiresAt && <span className="fallback-indicator"> (estimated)</span>}
                  </>
                )
            }
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="link-actions">
        <a 
          href={generatePageUrl(page)}
          target="_blank"
          rel="noopener noreferrer"
          className={`view-link-btn ${!isActive ? 'disabled' : ''}`}
          title={!isActive ? 'Page is expired' : undefined}
        >
          <ExternalLink size={14} />
          {isActive ? 'View' : 'View (Expired)'}
        </a>
        <button 
          className="analytics-btn"
          onClick={() => onPageClick(page)}
        >
          Analytics
        </button>
      </div>
    </div>
  );
};

export default LinkCard;