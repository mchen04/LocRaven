'use client';

import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/providers/auth-provider';
import { useNotification } from '@/components/providers/notification-provider';
import {
  LayoutDashboard,
  User,
  Link as LinkIcon,
  BarChart3,
  CreditCard,
  Settings,
  LogOut,
  Plus
} from 'lucide-react';

const navigation: Array<{
  name: string;
  href: string;
  icon: any;
  badge?: string;
  description?: string;
}> = [
  {
    name: 'Update',
    href: '/dashboard',
    icon: LayoutDashboard,
    badge: 'Default'
  },
  {
    name: 'Profile',
    href: '/dashboard/profile',
    icon: User,
    description: 'Business details form'
  },
  {
    name: 'Links',
    href: '/dashboard/links', 
    icon: LinkIcon,
    description: 'Active/expired pages management'
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    description: 'Individual page performance'
  },
  {
    name: 'Subscription',
    href: '/dashboard/subscription',
    icon: CreditCard,
    description: 'Billing/plan management'
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    description: 'Account info + danger zone'
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  const { showSuccess, showError } = useNotification();

  const handleSignOut = async () => {
    try {
      await signOut();
      showSuccess('Successfully signed out');
    } catch (error) {
      showError('Failed to sign out');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <button
              key={item.name}
              onClick={() => router.push(item.href as any)}
              className={cn(
                'w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <item.icon className="mr-3 h-4 w-4" />
              <span className="flex-1 text-left">{item.name}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {item.badge}
                </Badge>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick actions */}
      <div className="px-4 py-4 border-t">
        <Button className="w-full mb-3" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Update
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full text-sm text-muted-foreground"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}