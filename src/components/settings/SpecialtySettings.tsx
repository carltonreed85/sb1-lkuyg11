import React, { useState } from 'react';
import { Plus, Save, Trash2, Edit2, Check, X } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

interface MedicalService {
  id: string;
  name: string;
  description?: string;
}

export default function SpecialtySettings() {
  const { medicalServices, addMedicalService, updateMedicalService, removeMedicalService } = useSettings();
  const [newService, setNewService] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<MedicalService | null>(null);

  const handleAddService = () => {
    if (newService.name.trim()) {
      addMedicalService(newService);
      setNewService({ name: '', description: '' });
    }
  };

  const handleEdit = (service: MedicalService) => {
    setEditingId(service.id);
    setEditForm(service);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleSaveEdit = (id: string) => {
    if (editForm && editForm.name.trim()) {
      updateMedicalService(id, editForm);
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleRemove = (id: string) => {
    removeMedicalService(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Medical Services</h2>
      </div>

      {/* Add New Service Form */}
      <div className="bg-white shadow sm:rounded-lg p-6">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Add New Medical Service</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Service Name
            </label>
            <input
              type="text"
              value={newService.name}
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              placeholder="Enter service name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              value={newService.description}
              onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              placeholder="Enter description (optional)"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={handleAddService}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </button>
        </div>
      </div>

      {/* Services List */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Current Medical Services</h3>
          <div className="space-y-4">
            {medicalServices.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-md"
              >
                {editingId === service.id ? (
                  <div className="flex-1 mr-4">
                    <input
                      type="text"
                      value={editForm?.name || ''}
                      onChange={(e) => setEditForm({ ...editForm!, name: e.target.value })}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                    <input
                      type="text"
                      value={editForm?.description || ''}
                      onChange={(e) => setEditForm({ ...editForm!, description: e.target.value })}
                      className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                    <div className="mt-2 flex space-x-2">
                      <button
                        onClick={() => handleSaveEdit(service.id)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{service.name}</h4>
                    {service.description && (
                      <p className="text-sm text-gray-500">{service.description}</p>
                    )}
                  </div>
                )}
                {editingId !== service.id && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="p-1 text-gray-400 hover:text-gray-500"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleRemove(service.id)}
                      className="p-1 text-red-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
            {medicalServices.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No medical services added yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}