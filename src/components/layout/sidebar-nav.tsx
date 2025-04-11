import React from 'react';
import { Link, useLocation } from 'wouter';
import { Home, Package, IndianRupeeIcon, LogOut, Building, User2Icon, ShoppingCart  } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { useAuth } from '../../hooks/use-auth';

const routes = [
  { title: 'Dashboard', icon: Home, href: '/', roles: ['admin', 'staff', 'technician'] },
  { title: 'Products', icon: Package, href: '/products', roles: ['admin', 'staff', 'technician'] },
  { title: 'Sales', icon: IndianRupeeIcon, href: '/sales', roles: ['admin', 'staff'] },
  { title: 'Buyer', icon: User2Icon, href: '/buyers', roles: ['admin', 'staff'] },
  { title: 'Towns', icon: Building, href: '/towns', roles: ['admin', 'staff'] },
  { title: 'Bill Generate', icon: ShoppingCart, href: '/bill-generate', roles: ['admin', 'staff'] }, // New Route
];

interface SidebarNavProps {
  isOpen: boolean;
  logout: () => void;
}

export function SidebarNav({ isOpen, logout }: SidebarNavProps) {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <div
    className={cn(
      'fixed top-0 left-0 z-40 h-screen w-64 bg-sidebar border-r shadow-lg transform transition-transform duration-300',
      isOpen ? 'translate-x-0' : '-translate-x-full',
      'md:relative md:translate-x-0',
      'flex flex-col'
    )}
  >
  <div className="flex h-14 items-center border-b px-4">
    <h2 className="text-lg font-semibold text-sidebar-foreground">Inventory Pro</h2>
  </div>
  <nav className="flex-1 overflow-auto py-2">
    {routes.map((route) => {
      const Icon = route.icon;
      return (
        <Link key={route.href} href={route.href}>
          <a
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-sidebar-accent',
              location === route.href
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {route.title}
          </a>
        </Link>
      );
    })}
  </nav>
  <div className="border-t p-4 mt-auto"> {/* Add mt-auto to push this div to the bottom */}
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-white">{user?.username}</p>
        <p className="text-xs text-muted-foreground capitalize">
          {user?.role}
        </p>
      </div>
      <Button variant="ghost" size="icon" onClick={logout}>
        <LogOut className="h-4 w-4 text-white" />
      </Button>
    </div>
  </div>
</div>
  );
}
