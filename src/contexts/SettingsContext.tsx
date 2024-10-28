import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  referralUpdates: boolean;
  taskReminders: boolean;
  systemAlerts: boolean;
}

interface OrganizationSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
}

interface LocationSettings {
  id: string;
  name: string;
  address: string;
  phone: string;
  active: boolean;
  specialties: string[];
}

interface ProviderSettings {
  id: string;
  name: string;
  specialty: string;
  locations: string[];
  medicalServices: string[];
  contact: {
    email: string;
    phone: string;
  };
}

interface MedicalService {
  id: string;
  name: string;
  description?: string;
  active: boolean;
}

interface SettingsContextType {
  notificationSettings: NotificationSettings;
  organizationSettings: OrganizationSettings;
  locations: LocationSettings[];
  providers: ProviderSettings[];
  medicalServices: MedicalService[];
  updateNotificationSettings: (settings: NotificationSettings) => void;
  updateOrganizationSettings: (settings: OrganizationSettings) => void;
  addLocation: (location: Omit<LocationSettings, 'id'>) => void;
  updateLocation: (id: string, location: Partial<LocationSettings>) => void;
  removeLocation: (id: string) => void;
  addProvider: (provider: Omit<ProviderSettings, 'id'>) => void;
  updateProvider: (id: string, provider: Partial<ProviderSettings>) => void;
  removeProvider: (id: string) => void;
  addMedicalService: (service: Omit<MedicalService, 'id'>) => void;
  updateMedicalService: (id: string, service: Partial<MedicalService>) => void;
  removeMedicalService: (id: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Initial state
const initialNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  smsNotifications: false,
  referralUpdates: true,
  taskReminders: true,
  systemAlerts: true,
};

const initialOrganizationSettings: OrganizationSettings = {
  name: 'Demo Organization',
  address: '123 Healthcare Ave',
  phone: '(555) 123-4567',
  email: 'info@demo-org.com',
};

const initialLocations: LocationSettings[] = [
  {
    id: '1',
    name: 'Main Hospital',
    address: '123 Main St, City, State',
    phone: '(555) 123-4567',
    active: true,
    specialties: ['1', '2'],
  },
];

const initialProviders: ProviderSettings[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    locations: ['1'],
    medicalServices: ['1'],
    contact: {
      email: 'sarah.johnson@example.com',
      phone: '(555) 234-5678',
    },
  },
];

const initialMedicalServices: MedicalService[] = [
  {
    id: '1',
    name: 'Cardiology',
    description: 'Heart and cardiovascular system',
    active: true,
  },
  {
    id: '2',
    name: 'Neurology',
    description: 'Nervous system disorders',
    active: true,
  },
];

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(initialNotificationSettings);
  const [organizationSettings, setOrganizationSettings] = useState<OrganizationSettings>(initialOrganizationSettings);
  const [locations, setLocations] = useState<LocationSettings[]>(initialLocations);
  const [providers, setProviders] = useState<ProviderSettings[]>(initialProviders);
  const [medicalServices, setMedicalServices] = useState<MedicalService[]>(initialMedicalServices);

  const updateNotificationSettings = (settings: NotificationSettings) => {
    setNotificationSettings(settings);
  };

  const updateOrganizationSettings = (settings: OrganizationSettings) => {
    setOrganizationSettings(settings);
  };

  const addLocation = (location: Omit<LocationSettings, 'id'>) => {
    const newLocation = {
      ...location,
      id: Math.random().toString(36).substr(2, 9),
    };
    setLocations(prev => [...prev, newLocation]);
  };

  const updateLocation = (id: string, location: Partial<LocationSettings>) => {
    setLocations(prev => prev.map(loc => 
      loc.id === id ? { ...loc, ...location } : loc
    ));
  };

  const removeLocation = (id: string) => {
    setLocations(prev => prev.filter(loc => loc.id !== id));
  };

  const addProvider = (provider: Omit<ProviderSettings, 'id'>) => {
    const newProvider = {
      ...provider,
      id: Math.random().toString(36).substr(2, 9),
    };
    setProviders(prev => [...prev, newProvider]);
  };

  const updateProvider = (id: string, provider: Partial<ProviderSettings>) => {
    setProviders(prev => prev.map(prov => 
      prov.id === id ? { ...prov, ...provider } : prov
    ));
  };

  const removeProvider = (id: string) => {
    setProviders(prev => prev.filter(prov => prov.id !== id));
  };

  const addMedicalService = (service: Omit<MedicalService, 'id'>) => {
    const newService = {
      ...service,
      id: Math.random().toString(36).substr(2, 9),
    };
    setMedicalServices(prev => [...prev, newService]);
  };

  const updateMedicalService = (id: string, service: Partial<MedicalService>) => {
    setMedicalServices(prev => prev.map(serv => 
      serv.id === id ? { ...serv, ...service } : serv
    ));
  };

  const removeMedicalService = (id: string) => {
    setMedicalServices(prev => prev.filter(serv => serv.id !== id));
  };

  return (
    <SettingsContext.Provider value={{
      notificationSettings,
      organizationSettings,
      locations,
      providers,
      medicalServices,
      updateNotificationSettings,
      updateOrganizationSettings,
      addLocation,
      updateLocation,
      removeLocation,
      addProvider,
      updateProvider,
      removeProvider,
      addMedicalService,
      updateMedicalService,
      removeMedicalService,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}