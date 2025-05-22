import React from 'react';
import { Link, useLocation } from 'wouter';
import { Home, Package, IndianRupeeIcon, LogOut, Building, User2Icon, ShoppingCart } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { useAuth } from '../../hooks/use-auth';

const routes = [
  { title: 'Dashboard', icon: Home, href: '/dashboard', roles: ['admin', 'staff', 'technician'] },
  { title: 'Products', icon: Package, href: '/products', roles: ['admin', 'staff', 'technician'] },
  { title: 'Sales', icon: IndianRupeeIcon, href: '/sales', roles: ['admin', 'staff'] },
  { title: 'Buyer', icon: User2Icon, href: '/buyers', roles: ['admin', 'staff'] },
  { title: 'Towns', icon: Building, href: '/towns', roles: ['admin', 'staff'] },
  { title: 'Bill Generate', icon: ShoppingCart, href: '/bill-generate', roles: ['admin', 'staff'] },
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
        'fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 shadow-sm transform transition-all duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'md:relative md:translate-x-0',
        'flex flex-col'
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-center border-b border-gray-100 bg-emerald-50">
        <h2 
          onClick={() => window.location.href = "/"} 
          className="text-xl font-bold text-emerald-700 cursor-pointer hover:text-emerald-600 transition-colors duration-200 tracking-wide"
        >
          ShopSage
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-auto py-6 px-4 space-y-2">
        {routes.map((route) => {
          const Icon = route.icon;
          const isActive = location === route.href;
          
          return (
            <Link key={route.href} href={route.href}>
              <div
                className={cn(
                  'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200',
                  'hover:bg-emerald-50 cursor-pointer group relative',
                  isActive
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-gray-700 hover:text-emerald-700'
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-600 rounded-r-full" />
                )}
                <Icon 
                  className={cn(
                    'h-5 w-5 transition-colors duration-200',
                    isActive 
                      ? 'text-white' 
                      : 'text-gray-500 group-hover:text-emerald-600'
                  )} 
                />
                <span className="font-medium">{route.title}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-gray-100 p-4 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center border-2 border-emerald-200">
              <span className="text-emerald-700 text-sm font-semibold">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <button
                onClick={() => (window.location.href = "/profile")}
                className="text-sm font-semibold text-gray-800 hover:text-emerald-600 transition-colors duration-200"
              >
                {user?.username}
              </button>
              <p className="text-xs text-gray-500 capitalize mt-0.5">
                {user?.shopName}
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={logout}
            className="hover:bg-red-50 hover:text-red-600 transition-all duration-200 rounded-lg h-8 w-8"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}