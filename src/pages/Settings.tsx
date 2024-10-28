import React, { useState } from 'react';
import { User, Bell, Shield, Building, ChevronRight, Users, MapPin, Stethoscope } from 'lucide-react';
import OrganizationSettings from '../components/settings/OrganizationSettings';
import UserManagement from '../components/settings/UserManagement';
import NotificationSettings from '../components/settings/NotificationSettings';
import SecuritySettings from '../components/settings/SecuritySettings';
import LocationSettings from '../components/settings/LocationSettings';
import ProviderSettings from '../components/settings/ProviderSettings';
import SpecialtySettings from '../components/settings/SpecialtySettings';
import { useAuth } from '../contexts/AuthContext';

type SettingsView = 'main' | 'organization' | 'users' | 'notifications' | 'security' | 'locations' | 'providers' | 'specialties';

export default function Settings() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<SettingsView>('main');

  const isAdmin = user?.role === 'admin';

  // Define settings sections based on user role
  const settingsSections = isAdmin ? [
    {
      id: 'organization',
      name: 'Organization Settings',
      icon: Building,
      description: 'Update organization details and preferences',
    },
    {
      id: 'users',
      name: 'User Management',
      icon: Users,
      description: 'Manage users and their permissions',
    },
    {
      id: 'locations',
      name: 'Locations',
      icon: MapPin,
      description: 'Manage referral locations',
    },
    {
      id: 'providers',
      name: 'Providers',
      icon: User,
      description: 'Manage referring providers',
    },
    {
      id: 'specialties',
      name: 'Medical Services',
      icon: Stethoscope,
      description: 'Manage medical specialties and services',
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: Bell,
      description: 'Configure how you receive alerts and updates',
    },
    {
      id: 'security',
      name: 'Security',
      icon: Shield,
      description: 'Manage your password and security settings',
    },
  ] : [
    {
      id: 'notifications',
      name: 'Notifications',
      icon: Bell,
      description: 'Configure how you receive alerts and updates',
    },
    {
      id: 'security',
      name: 'Security',
      icon: Shield,
      description: 'Manage your password and security settings',
    },
  ];

  const renderSettingsContent = () => {
    switch (currentView) {
      case 'organization':
        return isAdmin ? <OrganizationSettings onBack={() => setCurrentView('main')} /> : null;
      case 'users':
        return isAdmin ? <UserManagement onBack={() => setCurrentView('main')} /> : null;
      case 'locations':
        return isAdmin ? <LocationSettings onBack={() => setCurrentView('main')} /> : null;
      case 'providers':
        return isAdmin ? <ProviderSettings onBack={() => setCurrentView('main')} /> : null;
      case 'specialties':
        return isAdmin ? <SpecialtySettings onBack={() => setCurrentView('main')} /> : null;
      case 'notifications':
        return <NotificationSettings onBack={() => setCurrentView('main')} />;
      case 'security':
        return <SecuritySettings onBack={() => setCurrentView('main')} />;
      default:
        return (
          <div className="space-y-6">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setCurrentView(section.id as SettingsView)}
                className="w-full text-left px-4 py-5 sm:px-6 hover:bg-gray-50 rounded-lg border border-gray-200 shadow-sm transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <section.icon
                        className="h-6 w-6 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        {section.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        );
    }
  };

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Settings
          </h2>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {renderSettingsContent()}
      </div>
    </div>
  );
}