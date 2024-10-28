import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Check, MapPin } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

interface Location {
  id: string;
  name: string;
  address: string;
  phone: string;
  active: boolean;
  specialties: string[];
}

export default function LocationSettings() {
  const { settings, updateLocations } = useSettings();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [newLocation, setNewLocation] = useState<Omit<Location, 'id'>>({
    name: '',
    address: '',
    phone: '',
    active: true,
    specialties: []
  });

  const handleAddLocation = () => {
    const location: Location = {
      id: Math.random().toString(),
      ...newLocation
    };
    updateLocations([...settings.locations, location]);
    setShowAddForm(false);
    setNewLocation({
      name: '',
      address: '',
      phone: '',
      active: true,
      specialties: []
    });
  };

  const handleUpdateLocation = () => {
    if (!editingLocation) return;
    updateLocations(settings.locations.map(loc => 
      loc.id === editingLocation.id ? editingLocation : loc
    ));
    setEditingLocation(null);
  };

  const handleDeleteLocation = (id: string) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      updateLocations(settings.locations.filter(loc => loc.id !== id));
    }
  };

  const LocationForm = ({ location, onSubmit, onCancel }: {
    location: Omit<Location, 'id'>;
    onSubmit: () => void;
    onCancel: () => void;
  }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Location Name</label>
          <input
            type="text"
            value={location.name}
            onChange={(e) => setNewLocation({ ...location, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea
            value={location.address}
            onChange={(e) => setNewLocation({ ...location, address: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            value={location.phone}
            onChange={(e) => setNewLocation({ ...location, phone: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Medical Services</label>
          <select
            multiple
            value={location.specialties}
            onChange={(e) => setNewLocation({
              ...location,
              specialties: Array.from(e.target.selectedOptions, option => option.value)
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            {settings.specialties.map(specialty => (
              <option key={specialty.id} value={specialty.id}>
                {specialty.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
          >
            Save Location
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Manage Locations</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Location
        </button>
      </div>

      {showAddForm && (
        <LocationForm
          location={newLocation}
          onSubmit={handleAddLocation}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <div className="grid grid-cols-1 gap-6">
        {settings.locations.map(location => (
          <div
            key={location.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            {editingLocation?.id === location.id ? (
              <LocationForm
                location={editingLocation}
                onSubmit={handleUpdateLocation}
                onCancel={() => setEditingLocation(null)}
              />
            ) : (
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">{location.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500">{location.address}</p>
                  <p className="text-sm text-gray-500">{location.phone}</p>
                  {location.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {location.specialties.map(specialtyId => {
                        const specialty = settings.specialties.find(s => s.id === specialtyId);
                        return specialty ? (
                          <span
                            key={specialtyId}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {specialty.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingLocation(location)}
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteLocation(location.id)}
                    className="p-2 text-red-400 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}