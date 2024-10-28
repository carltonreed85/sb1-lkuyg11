import React, { useState } from 'react';
import { UserPlus, Save, Search, Edit2, Trash2, Check, X } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

export default function ProviderSettings() {
  const { settings, updateProviderSettings } = useSettings();
  const [providers, setProviders] = useState(settings?.providers || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingProvider, setIsAddingProvider] = useState(false);
  const [editingProviderId, setEditingProviderId] = useState<string | null>(null);
  const [newProvider, setNewProvider] = useState({
    name: '',
    specialty: '',
    email: '',
    phone: '',
    locations: [] as string[],
    npi: '',
  });

  const handleAddProvider = () => {
    if (!newProvider.name || !newProvider.specialty) return;

    const provider = {
      id: Date.now().toString(),
      ...newProvider,
      active: true,
    };

    setProviders([...providers, provider]);
    setNewProvider({
      name: '',
      specialty: '',
      email: '',
      phone: '',
      locations: [],
      npi: '',
    });
    setIsAddingProvider(false);
    updateProviderSettings([...providers, provider]);
  };

  const handleEditProvider = (provider: any) => {
    const updatedProviders = providers.map(p => 
      p.id === provider.id ? provider : p
    );
    setProviders(updatedProviders);
    setEditingProviderId(null);
    updateProviderSettings(updatedProviders);
  };

  const handleDeleteProvider = (providerId: string) => {
    const updatedProviders = providers.filter(p => p.id !== providerId);
    setProviders(updatedProviders);
    updateProviderSettings(updatedProviders);
  };

  const filteredProviders = providers.filter(provider =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Provider Management</h2>
        <button
          onClick={() => setIsAddingProvider(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Provider
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
          placeholder="Search providers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Add Provider Form */}
      {isAddingProvider && (
        <div className="bg-white shadow sm:rounded-lg p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Provider Name *
                </label>
                <input
                  type="text"
                  value={newProvider.name}
                  onChange={(e) => setNewProvider({ ...newProvider, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Medical Service *
                </label>
                <input
                  type="text"
                  value={newProvider.specialty}
                  onChange={(e) => setNewProvider({ ...newProvider, specialty: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={newProvider.email}
                  onChange={(e) => setNewProvider({ ...newProvider, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  value={newProvider.phone}
                  onChange={(e) => setNewProvider({ ...newProvider, phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  NPI Number
                </label>
                <input
                  type="text"
                  value={newProvider.npi}
                  onChange={(e) => setNewProvider({ ...newProvider, npi: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsAddingProvider(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProvider}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Add Provider
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Providers List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {filteredProviders.map((provider) => (
            <li key={provider.id} className="px-4 py-4 sm:px-6">
              {editingProviderId === provider.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <input
                      type="text"
                      value={provider.name}
                      onChange={(e) => setProviders(providers.map(p => 
                        p.id === provider.id ? { ...p, name: e.target.value } : p
                      ))}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                    <input
                      type="text"
                      value={provider.specialty}
                      onChange={(e) => setProviders(providers.map(p => 
                        p.id === provider.id ? { ...p, specialty: e.target.value } : p
                      ))}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setEditingProviderId(null)}
                      className="inline-flex items-center p-1 border border-transparent rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleEditProvider(provider)}
                      className="inline-flex items-center p-1 border border-transparent rounded-full text-green-600 hover:bg-green-100"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{provider.name}</h4>
                    <p className="text-sm text-gray-500">{provider.specialty}</p>
                    {provider.email && (
                      <p className="text-sm text-gray-500">{provider.email}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingProviderId(provider.id)}
                      className="inline-flex items-center p-1 border border-transparent rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProvider(provider.id)}
                      className="inline-flex items-center p-1 border border-transparent rounded-full text-red-400 hover:bg-red-100 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}