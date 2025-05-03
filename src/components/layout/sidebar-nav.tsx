import React from 'react';
import { Link, useLocation } from 'wouter';
import { Home, Package, IndianRupeeIcon, LogOut, Building, User2Icon, ShoppingCart } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { useAuth } from '../../hooks/use-auth';
import { motion } from 'framer-motion';

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
        'fixed top-0 left-0 z-40 h-screen w-64 bg-sidebar border-r shadow-lg transform transition-transform duration-300 bg-gradient-to-r from-blue-600 to-indigo-800',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'md:relative md:translate-x-0',
        'flex flex-col'
      )}
    >
      {/* Background container with z-0 */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {Array.from({ length: 10 }).map((_, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full bg-white opacity-5" // Reduced opacity to 5%
            initial={{
              x: Math.random() * 250,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.3 + 0.3, // Reduced scale
            }}
            animate={{
              x: Math.random() * 250,
              y: Math.random() * window.innerHeight,
              transition: {
                duration: Math.random() * 50 + 30,
                repeat: Infinity,
                repeatType: "reverse",
              },
            }}
            style={{
              width: `${Math.random() * 100 + 50}px`, // Reduced size
              height: `${Math.random() * 100 + 50}px`,
            }}
          />
        ))}
      </div>

      {/* Content container with z-10 */}
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex h-14 items-center border-b px-4">
        <h2 
    onClick={() => window.location.href = "/"} 
    className="text-lg font-semibold text-sidebar-foreground cursor-pointer hover:text-opacity-80"
  >
    ShopSage
  </h2>
          </div>
        <nav className="flex-1 overflow-auto py-2">
          {routes.map((route) => {
            const Icon = route.icon;
            return (
              <Link key={route.href} href={route.href}>
                <a
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-sidebar-accent relative',
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
        <div className="border-t p-4 mt-auto">
  <div className="flex items-center justify-between">
    <div>
      {/* Make username clickable */}
      <button
        onClick={() => (window.location.href = "/profile")}
        className="text-sm font-medium text-white hover:underline"
      >
        {user?.username}
      </button>
      {/* <p className="text-xs text-muted-foreground capitalize">
        {user?.role}
      </p> */}
    </div>
    <Button variant="ghost" size="icon" onClick={logout}>
      <LogOut className="h-4 w-4 text-white" />
    </Button>
  </div>
</div>
      </div>
    </div>
  );
}