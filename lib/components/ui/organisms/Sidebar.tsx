import { memo } from 'react';
import { Calendar, Settings, LogOut, Building2, Link2, Menu, CreditCard, LucideIcon } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { themeClasses } from '../../../theme/utils';
import NavItem from '../molecules/NavItem';
import Button from '../atoms/Button';

export type ViewMode = 'update' | 'preview' | 'analytics' | 'profile' | 'links' | 'settings' | 'subscription';

export interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  user?: { email?: string } | null;
  business?: { name?: string } | null;
  onSignOut: () => void;
  className?: string;
  'data-testid'?: string;
}

interface NavItemConfig {
  id: ViewMode;
  icon: LucideIcon;
  label: string;
  badge?: string | number;
  showBadge?: () => boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  currentView,
  onViewChange,
  user,
  business,
  onSignOut,
  className,
  'data-testid': testId,
}) => {
  const navItems: NavItemConfig[] = [
    {
      id: 'update',
      icon: Calendar,
      label: 'Create Update',
    },
    {
      id: 'profile',
      icon: Building2,
      label: 'Business Details',
      showBadge: () => !business,
    },
    {
      id: 'links',
      icon: Link2,
      label: 'Links',
    },
    {
      id: 'settings',
      icon: Settings,
      label: 'Settings',
    },
    {
      id: 'subscription',
      icon: CreditCard,
      label: 'Subscription',
    },
  ];

  const getUserInitials = () => {
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <aside 
      className={cn(
        // Base layout
        'flex flex-col h-screen relative z-[100] overflow-hidden transition-all duration-300',
        
        // Theme-aware background and border
        themeClasses.sidebar(),
        
        // Width based on collapsed state
        isOpen ? 'w-64' : 'w-[4.375rem]',
        
        className
      )}
      data-testid={testId}
    >
      {/* Header */}
      <div className={cn(
        'flex items-center gap-3 border-b border-white/[0.08] min-h-[3.5625rem]',
        'p-3'
      )}>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="p-2 hover:bg-white/10 text-gray-200"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </Button>
        
        {isOpen && (
          <div className={cn(
            'flex-1 text-base font-semibold text-gray-200 whitespace-nowrap overflow-hidden',
            'transition-opacity duration-300'
          )}>
            LocRaven
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={currentView === item.id}
            isCollapsed={!isOpen}
            onClick={() => onViewChange(item.id)}
            badge={item.showBadge?.() ? '!' : undefined}
            data-testid={`sidebar-nav-${item.id}`}
          />
        ))}
      </nav>

      {/* Footer - User Profile */}
      <div className="border-t border-white/[0.08] p-3">
        <Button
          variant="ghost"
          onClick={onSignOut}
          className={cn(
            'w-full justify-start hover:bg-white/10 text-gray-200',
            !isOpen && 'px-2 justify-center'
          )}
        >
          <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {getUserInitials()}
          </div>
          
          {isOpen && (
            <div className="flex items-center gap-2 ml-3 overflow-hidden">
              <span className="text-sm text-gray-200 truncate">
                {user?.email || 'User'}
              </span>
              <LogOut size={14} className="text-red-400 flex-shrink-0" />
            </div>
          )}
        </Button>
      </div>
    </aside>
  );
};

export default memo(Sidebar);