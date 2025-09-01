'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LinksTabProps, UserLink } from '@/features/links/types/links-types';

export function LinksTab({ links }: LinksTabProps) {
  const [activeSection, setActiveSection] = useState('active');
  const [visibleActiveCount, setVisibleActiveCount] = useState(5);
  const [visibleExpiredCount, setVisibleExpiredCount] = useState(5);
  
  const activeLinks = links?.filter((link) => link.status === 'active') || [];
  const expiredLinks = links?.filter((link) => link.status === 'expired') || [];

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    // TODO: Show success toast
  };

  const handleEditLink = (linkId: string) => {
    // TODO: Implement edit functionality
    console.log('Editing link:', linkId);
  };

  const handleDeleteLink = (linkId: string) => {
    // TODO: Implement delete functionality
    console.log('Deleting link:', linkId);
  };

  const handleLoadMoreActive = () => {
    setVisibleActiveCount(prev => prev + 5);
  };

  const handleLoadMoreExpired = () => {
    setVisibleExpiredCount(prev => prev + 5);
  };

  const visibleActiveLinks = activeLinks.slice(0, visibleActiveCount);
  const visibleExpiredLinks = expiredLinks.slice(0, visibleExpiredCount);
  const hasMoreActive = activeLinks.length > visibleActiveCount;
  const hasMoreExpired = expiredLinks.length > visibleExpiredCount;

  const sections = [
    { id: 'active', name: 'Active', count: activeLinks.length },
    { id: 'expired', name: 'Expired', count: expiredLinks.length },
  ];

  return (
    <div className='space-y-6'>
      {/* Section Navigation */}
      <div className='border-b border-zinc-700'>
        <nav className='flex space-x-8'>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeSection === section.id
                  ? 'border-white text-white'
                  : 'border-transparent text-zinc-400 hover:text-zinc-300'
              }`}
            >
              {section.name} ({section.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Active Links Section */}
      {activeSection === 'active' && (
        <div className='space-y-6'>
          <Card title='Active Links'>
            {activeLinks.length > 0 ? (
              <div className='space-y-4'>
                {visibleActiveLinks.map((link) => (
                  <LinkItem
                    key={link.id}
                    link={link}
                    onCopy={handleCopyLink}
                    onEdit={handleEditLink}
                    onDelete={handleDeleteLink}
                  />
                ))}
                {hasMoreActive && (
                  <div className='flex justify-center pt-4'>
                    <Button
                      variant='secondary'
                      onClick={handleLoadMoreActive}
                      className='text-sm'
                    >
                      Load 5 More ({activeLinks.length - visibleActiveCount} remaining)
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className='py-8 text-center text-zinc-400'>
                <p>No active links yet. Create an update to generate your first link!</p>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Expired Links Section */}
      {activeSection === 'expired' && (
        <div className='space-y-6'>
          <Card title='Expired Links'>
            {expiredLinks.length > 0 ? (
              <div className='space-y-4'>
                {visibleExpiredLinks.map((link) => (
                  <LinkItem
                    key={link.id}
                    link={link}
                    onCopy={handleCopyLink}
                    onEdit={handleEditLink}
                    onDelete={handleDeleteLink}
                  />
                ))}
                {hasMoreExpired && (
                  <div className='flex justify-center pt-4'>
                    <Button
                      variant='secondary'
                      onClick={handleLoadMoreExpired}
                      className='text-sm'
                    >
                      Load 5 More ({expiredLinks.length - visibleExpiredCount} remaining)
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className='py-8 text-center text-zinc-400'>
                <p>No expired links.</p>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

function LinkItem({
  link,
  onCopy,
  onEdit,
  onDelete,
}: {
  link: UserLink;
  onCopy: (url: string) => void;
  onEdit: (linkId: string) => void;
  onDelete: (linkId: string) => void;
}) {
  return (
    <div className='rounded-md bg-zinc-800 p-4'>
      <div className='flex items-start justify-between'>
        <div className='flex-1'>
          <div className='flex items-center gap-3 mb-2'>
            <h3 className='font-medium text-white'>{link.title}</h3>
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${
                link.status === 'active'
                  ? 'bg-green-900 text-green-300'
                  : 'bg-red-900 text-red-300'
              }`}
            >
              {link.status}
            </span>
            <span className='rounded-full bg-zinc-700 px-2 py-1 text-xs text-zinc-300'>
              {link.pageType || 'Page'}
            </span>
          </div>
          
          <div className='mb-3'>
            <p className='text-sm text-zinc-400 break-all'>{link.url}</p>
          </div>
          
          <div className='flex items-center gap-6 text-sm text-zinc-400'>
            <span>Published: {link.published ? 'Yes' : 'No'}</span>
            <span>Created: {new Date(link.createdAt).toLocaleDateString()}</span>
            <span>Expires: {link.expiresAt ? new Date(link.expiresAt).toLocaleDateString() : 'Never'}</span>
          </div>
        </div>
        
        <div className='flex gap-2 ml-4'>
          <Button
            size='sm'
            variant='secondary'
            onClick={() => onCopy(link.url)}
          >
            Copy Link
          </Button>
          {link.status === 'active' && (
            <Button
              size='sm'
              variant='secondary'
              onClick={() => onEdit(link.id)}
            >
              Edit
            </Button>
          )}
          <Button
            size='sm'
            variant='secondary'
            onClick={() => onDelete(link.id)}
            className='text-red-400 hover:text-red-300'
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

// Reuse the Card component pattern
function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className='w-full rounded-md bg-zinc-900'>
      <div className='p-4'>
        <h2 className='mb-4 text-xl font-semibold text-white'>{title}</h2>
        <div>{children}</div>
      </div>
    </div>
  );
}