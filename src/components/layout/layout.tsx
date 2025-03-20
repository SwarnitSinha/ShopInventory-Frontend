// components/layout/Layout.js
import React, { useState, ReactNode } from 'react';
import { Header } from './header';
import { SidebarNav } from './sidebar-nav';
import { Footer } from './footer';
import { useAuth } from '../../hooks/use-auth';

export function Layout({ children }: {children: React.ReactNode}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logoutMutation } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <SidebarNav isOpen={isSidebarOpen} logout={logoutMutation.mutate} />
        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
