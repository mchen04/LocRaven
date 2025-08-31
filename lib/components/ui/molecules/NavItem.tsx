import { memo } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { themeClasses } from '../../../theme/utils';

export interface NavItemProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
  badge?: string | number;
  className?: string;
  'data-testid'?: string;
}

const NavItem: React.FC<NavItemProps> = ({
  icon: Icon,
  label,
  isActive = false,
  isCollapsed = false,
  onClick,
  badge,
  className,
  'data-testid': testId,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        // Base styles
        'flex items-center w-full text-left rounded-md transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
        
        // Padding based on collapsed state
        isCollapsed ? 'p-2 justify-center' : 'px-3 py-2',
        
        // Theme-aware active/inactive styles
        themeClasses.navItem(isActive),
        
        className
      )}
      data-testid={testId}
      title={isCollapsed ? label : undefined}
    >
      <Icon 
        size={20} 
        className={cn(
          'flex-shrink-0',
          !isCollapsed && 'mr-3'
        )} 
      />
      
      {!isCollapsed && (
        <>
          <span className="flex-1 text-sm font-medium">
            {label}
          </span>
          
          {badge && (
            <span className={cn(
              'ml-2 px-2 py-0.5 text-xs font-medium rounded-full',
              isActive 
                ? 'bg-white/20 text-white' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            )}>
              {badge}
            </span>
          )}
        </>
      )}
    </button>
  );
};

export default memo(NavItem);