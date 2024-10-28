import React, { useState } from 'react';
import { useSettings } from '../../../contexts/SettingsContext';

interface ReferralDetailsProps {
  patient: any;
  onBack: () => void;
  onNext: (referralData: any) => void;
}

export default function ReferralDetails({ patient, onBack, onNext }: ReferralDetailsProps) {
  const { specialties, locations, providers } = useSettings();
  const [formData, setFormData] = useState({
    specialty: '',
    location: '',
    provider: '',
    priority: '',
    reason: '',
    notes: '',
    address: '',
    phone: '',
    email: '',
    preferredDate: '',
    preferredTime: '',
    insuranceVerified: false,
    insuranceNotes: ''
  });

  // Filter locations based on selected specialty
  const availableLocations = locations.filter(location => 
    location.active && 
    (!formData.specialty || location.medicalServices.includes(formData.specialty))
  );

  // Filter providers based on selected specialty and location
  const availableProviders = providers.filter(provider => 
    provider.active && 
    (!formData.specialty || provider.specialties.includes(formData.specialty)) &&
    (!formData.location || provider.locations.includes(formData.location))
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => {
      const updates: any = { [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value };
      
      // Reset dependent fields when specialty changes
      if (name === 'specialty') {
        updates.location = '';
        updates.provider = '';
      }
      // Reset provider when location changes
      else if (name === 'location') {
        updates.provider = '';
        
        // Auto-fill address and phone from selected location
        const selectedLocation = locations.find(loc => loc.id === value);
        if (selectedLocation) {
          updates.address = selectedLocation.address;
          updates.phone = selectedLocation.phone;
        }
      }
      // Auto-fill email when provider changes
      else if (name === 'provider') {
        const selectedProvider = providers.find(prov => prov.id === value);
        if (selectedProvider) {
          updates.email = selectedProvider.contact.email;
        }
      }

      return { ...prev, ...updates };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Patient Summary */}
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-sm font-medium text-gray-500">Selected Patient</h3>
        <p className="mt-1 font-medium">{patient?.name}</p>
        <p className="text-sm text-gray-500">
          DOB: {patient?.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'N/A'}
          {patient?.mrn && ` | MRN: ${patient.mrn}`}
        </p>
      </div>

      {/* Referral Details */}
      <div className="grid grid-cols-1 gap-6">
        {/* Medical Service Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Medical Service *
          </label>
          <select
            name="specialty"
            value={formData.specialty}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            required
          >
            <option value="">Select medical service</option>
            {specialties
              .filter(specialty => specialty.active)
              .map((specialty) => (
                <option key={specialty.id} value={specialty.id}>
                  {specialty.name}
                </option>
              ))
            }
          </select>
        </div>

        {/* Location Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Refer to Location *
          </label>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            required
            disabled={!formData.specialty}
          >
            <option value="">Select location</option>
            {availableLocations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
          {formData.specialty && availableLocations.length === 0 && (
            <p className="mt-1 text-sm text-red-600">
              No locations available for this medical service
            </p>
          )}
        </div>

        {/* Provider Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Refer to Provider *
          </label>
          <select
            name="provider"
            value={formData.provider}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            required
            disabled={!formData.location || !formData.specialty}
          >
            <option value="">Select provider</option>
            {availableProviders.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
          {formData.specialty && formData.location && availableProviders.length === 0 && (
            <p className="mt-1 text-sm text-red-600">
              No providers available for the selected criteria
            </p>
          )}
        </div>

        {/* Auto-filled Location Details */}
        {formData.location && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
          </div>
        )}

        {/* Provider Email */}
        {formData.provider && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Provider Email
            </label>
            <input
              type="email"
              value={formData.email}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
        )}

        {/* Priority Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Priority *
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            required
          >
            <option value="">Select priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Preferred Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Preferred Date
            </label>
            <input
              type="date"
              name="preferredDate"
              value={formData.preferredDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Preferred Time
            </label>
            <select
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            >
              <option value="">Select time</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
            </select>
          </div>
        </div>

        {/* Insurance Verification */}
        <div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="insuranceVerified"
              checked={formData.insuranceVerified}
              onChange={handleChange}
              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Insurance Verified
            </label>
          </div>
          {formData.insuranceVerified && (
            <textarea
              name="insuranceNotes"
              value={formData.insuranceNotes}
              onChange={handleChange}
              rows={2}
              placeholder="Add insurance verification notes..."
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          )}
        </div>

        {/* Reason for Referral */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Reason for Referral *
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows={3}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Additional Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="btn-secondary"
        >
          Back
        </button>
        <button
          type="submit"
          className="btn-primary"
        >
          Next
        </button>
      </div>
    </form>
  );
}