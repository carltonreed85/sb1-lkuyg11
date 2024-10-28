import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Users, FileText, Settings, BarChart, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();

  // Define navigation items based on user role
  const navigation = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'Referrals', icon: FileText, path: '/referrals' },
    { name: 'Patients', icon: Users, path: '/patients' },
    // Only show Reports to admins
    ...(user?.role === 'admin' ? [{ name: 'Reports', icon: BarChart, path: '/reports' }] : []),
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-20 mt-16 flex flex-col transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
        <div className="flex items-center justify-end p-2">
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <ChevronLeft className={`h-5 w-5 transform transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`} />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto pt-3 pb-4">
          <nav className="flex-1 space-y-1 px-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <item.icon
                    className={`h-5 w-5 flex-shrink-0 ${
                      isOpen ? 'mr-3' : 'mx-auto'
                    }`}
                    aria-hidden="true"
                  />
                  <span className={`flex-1 whitespace-nowrap transition-all duration-200 ${
                    isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
                  }`}>
                    {item.name}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}