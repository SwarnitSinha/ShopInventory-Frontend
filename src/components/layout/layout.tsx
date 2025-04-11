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
    <div className="flex min-h-screen">
  <SidebarNav isOpen={isSidebarOpen} logout={logoutMutation.mutate} />

  {/* Main content scrolls separately */}
  <div className="flex-1 flex flex-col h-screen overflow-hidden">
    <Header toggleSidebar={toggleSidebar} />
    <main className="flex-1 overflow-auto bg-background p-4">
      {children}
    </main>
    <Footer />
  </div>
</div>
  );
}
