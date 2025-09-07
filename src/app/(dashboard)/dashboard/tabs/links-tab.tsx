'use client';

import { useState } from 'react';

import { EditUpdateModal } from '@/components/edit-update-modal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { BusinessProfile } from '@/features/business/types/business-types';
import { LinksTabProps, UserLink } from '@/features/links/types/links-types';
import { BusinessUpdatesService } from '@/services/business-updates';
import type { GeneratedPage } from '@/types/business-updates';

export function LinksTab({ links, businessProfile }: LinksTabProps & { businessProfile?: BusinessProfile | null }) {
  const [activeSection, setActiveSection] = useState('active');
  const [visibleActiveCount, setVisibleActiveCount] = useState(5);
  const [visibleExpiredCount, setVisibleExpiredCount] = useState(5);
  const [localLinks, setLocalLinks] = useState(links);
  const [isDeletingIds, setIsDeletingIds] = useState<string[]>([]);
  
  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<UserLink | null>(null);
  
  const { toast } = useToast();
  
  const activeLinks = localLinks?.filter((link) => link.status === 'active') || [];
  const expiredLinks = localLinks?.filter((link) => link.status === 'expired') || [];

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied",
      description: "The link has been copied to your clipboard",
    });
  };

  const handleEditLink = (linkId: string) => {
    const link = localLinks?.find(l => l.id === linkId);
    if (link) {
      setEditingLink(link);
      setIsEditModalOpen(true);
    } else {
      toast({
        title: "Cannot Edit",
        description: "Link not found",
        variant: "destructive",
      });
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    setIsDeletingIds(prev => [...prev, linkId]);
    
    try {
      const response = await BusinessUpdatesService.deleteGeneratedPage(linkId);
      
      if (response.success) {
        // Update local state
        setLocalLinks(prev => prev?.filter(link => link.id !== linkId) || []);
        
        toast({
          title: "Success",
          description: "Link deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete link",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error", 
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDeletingIds(prev => prev.filter(id => id !== linkId));
    }
  };

  const handleLoadMoreActive = () => {
    setVisibleActiveCount(prev => prev + 5);
  };

  const handleLoadMoreExpired = () => {
    setVisibleExpiredCount(prev => prev + 5);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingLink(null);
  };

  const handleEditSuccess = (updatedPages?: GeneratedPage[]) => {
    // For now, we'll just show a success message
    // In a full implementation, we might want to refresh the links data
    // or update the local state with the new page information
    toast({
      title: "Update Successful",
      description: updatedPages 
        ? `Successfully updated with ${updatedPages.length} regenerated pages` 
        : "Update saved successfully",
    });

    // Refresh local links by refetching if needed
    // For MVP, we'll just close the modal
    handleEditModalClose();
  };

  const visibleActiveLinks = activeLinks.slice(0, visibleActiveCount);
  const visibleExpiredLinks = expiredLinks.slice(0, visibleExpiredCount);
  const hasMoreActive = activeLinks.length > visibleActiveCount;
  const hasMoreExpired = expiredLinks.length > visibleExpiredCount;

  const permanentPageUrl = businessProfile?.city_state_slug && businessProfile?.url_slug ? 
    `https://locraven.com/${businessProfile.city_state_slug}/${businessProfile.url_slug}` : null;

  const sections = [
    { id: 'permanent', name: 'Permanent Page', count: permanentPageUrl ? 1 : 0 },
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

      {/* Permanent Page Section */}
      {activeSection === 'permanent' && (
        <div className='space-y-6'>
          <Card title='Permanent Business Page'>
            {permanentPageUrl ? (
              <div className='bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-6'>
                <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-2'>
                      <h3 className='font-semibold text-cyan-300'>Your Permanent Business Page</h3>
                      <span className='rounded-full bg-green-900 px-2 py-1 text-xs font-medium text-green-300'>
                        Never Expires
                      </span>
                    </div>
                    <p className='text-sm text-gray-400 mb-4'>
                      This permanent page never expires and automatically links to all your business updates. 
                      Perfect for sharing with customers, adding to business cards, or including in marketing materials.
                    </p>
                    <div className='p-3 bg-black/50 rounded border'>
                      <code className='text-sm text-cyan-300 break-all'>{permanentPageUrl}</code>
                    </div>
                  </div>
                  <div className='flex flex-wrap gap-2 lg:flex-col lg:ml-4'>
                    <Button
                      size='sm'
                      variant='secondary'
                      onClick={() => handleCopyLink(permanentPageUrl)}
                      className='flex-1 lg:flex-none'
                    >
                      Copy Link
                    </Button>
                    <a 
                      href={permanentPageUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className='inline-flex items-center justify-center flex-1 lg:flex-none px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-medium rounded-md transition-colors'
                    >
                      View Page
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className='py-8 text-center text-zinc-400'>
                <div className='mb-4'>
                  <svg className='w-12 h-12 mx-auto text-zinc-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' />
                  </svg>
                </div>
                <p className='text-lg mb-2'>No Permanent Page Available</p>
                <p className='text-sm'>
                  Complete your business profile to get your permanent business page.
                </p>
              </div>
            )}
          </Card>
        </div>
      )}

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
                    isDeletingIds={isDeletingIds}
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
                    isDeletingIds={isDeletingIds}
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

      {/* Edit Modal */}
      {editingLink && (
        <EditUpdateModal
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
          link={editingLink}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}

function LinkItem({
  link,
  onCopy,
  onEdit,
  onDelete,
  isDeletingIds,
}: {
  link: UserLink;
  onCopy: (url: string) => void;
  onEdit: (linkId: string) => void;
  onDelete: (linkId: string) => void;
  isDeletingIds: string[];
}) {
  return (
    <div className='rounded-md bg-zinc-800 p-4'>
      <div className='flex flex-col md:flex-row md:items-start md:justify-between'>
        <div className='flex-1 mb-4 md:mb-0'>
          <div className='flex items-center gap-3 mb-2 flex-wrap'>
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
          
          <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-zinc-400'>
            <span>Published: {link.published ? 'Yes' : 'No'}</span>
            <span>Created: {new Date(link.createdAt).toLocaleDateString()}</span>
            <span>Expires: {link.expiresAt ? new Date(link.expiresAt).toLocaleDateString() : 'Never'}</span>
          </div>
        </div>
        
        <div className='flex flex-wrap gap-2 md:ml-4 md:flex-col lg:flex-row'>
          <Button
            size='sm'
            variant='secondary'
            onClick={() => onCopy(link.url)}
            className='flex-1 sm:flex-none text-xs sm:text-sm'
          >
            Copy Link
          </Button>
          {link.status === 'active' && (
            <Button
              size='sm'
              variant='secondary'
              onClick={() => onEdit(link.id)}
              className='flex-1 sm:flex-none text-xs sm:text-sm'
            >
              Edit
            </Button>
          )}
          <Button
            size='sm'
            variant='secondary'
            onClick={() => onDelete(link.id)}
            disabled={isDeletingIds.includes(link.id)}
            className='text-red-400 hover:text-red-300 flex-1 sm:flex-none text-xs sm:text-sm'
          >
            {isDeletingIds.includes(link.id) ? 'Deleting...' : 'Delete'}
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