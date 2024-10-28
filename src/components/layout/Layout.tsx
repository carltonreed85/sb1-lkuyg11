import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onMenuClick={toggleSidebar} />
      
      <div className="flex h-screen pt-16">
        <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
        
        <main className={`flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-16'
        }`}>
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}