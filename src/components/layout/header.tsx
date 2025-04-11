// components/layout/Header.js
import React from 'react';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';

// Define the type for the props
interface HeaderProps {
    toggleSidebar: () => void;
  }

export function Header({ toggleSidebar }: HeaderProps) {
  return (
    <header className="h-14 flex items-center justify-between px-4 bg-header border-b">
      <h1 className="text-lg font-medium">Vinayak Traders</h1>
      <Button variant="ghost" size="icon" onClick={toggleSidebar}>
        <Menu className="h-6 w-6 text-primary" />
      </Button>
    </header>
  );
}
