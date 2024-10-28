import React, { useState } from 'react';
import { format } from 'date-fns';
import { Edit2, Check, X } from 'lucide-react';
import { Referral, ReferralStatus, useReferrals } from '../../../contexts/ReferralContext';
import { useSettings } from '../../../contexts/SettingsContext';

interface ReferralSummaryProps {
  referral: Referral;
}

interface StatusConfig {
  label: string;
  subStatuses: string[];
}

const STATUS_CONFIG: Record<ReferralStatus, StatusConfig> = {
  new: {
    label: 'New',
    subStatuses: ['Unassigned', 'Pending Triage', 'Awaiting Information']
  },
  in_progress: {
    label: 'In Progress',
    subStatuses: ['Assigned', 'Reviewing Documents', 'Verification Needed', 'Awaiting Scheduling', 'Consult Scheduled']
  },
  pending_authorization: {
    label: 'Pending Authorization',
    subStatuses: ['Authorization Required', 'Authorization Submitted', 'Authorization Denied', 'Authorization Approved']
  },
  scheduled: {
    label: 'Scheduled',
    subStatuses: ['Appointment Confirmed', 'Appointment Rescheduled', 'Awaiting Pre-Appointment Requirements']
  },
  completed: {
    label: 'Completed',
    subStatuses: ['Consult Completed', 'Follow-up Scheduled', 'Report Submitted']
  },
  on_hold: {
    label: 'On Hold',
    subStatuses: ['Patient Unreachable', 'Insurance Issue', 'Patient Request', 'Clinical Hold']
  },
  cancelled: {
    label: 'Cancelled',
    subStatuses: ['Patient Declined', 'Referral Withdrawn', 'Insurance Denied', 'Duplicate Referral']
  },
  closed: {
    label: 'Closed',
    subStatuses: ['Referral Completed', 'Outcome Reported', 'Referral Archived']
  }
};

const PRIORITIES = ['Urgent', 'High', 'Medium', 'Low'] as const;

export default function ReferralSummary({ referral }: ReferralSummaryProps) {
  const { updateReferral } = useReferrals();
  const { providers = [], locations = [], specialties = [] } = useSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [editedReferral, setEditedReferral] = useState({
    status: referral.status,
    subStatus: referral.details.subStatus,
    priority: referral.details.priority,
    location: referral.details.location,
    provider: referral.details.provider,
    medicalService: referral.details.medicalService,
    reason: referral.details.reason
  });

  // Filter providers based on selected medical service and location
  const availableProviders = providers.filter(provider => {
    const hasService = provider.specialties?.includes(editedReferral.medicalService);
    const hasLocation = provider.locations?.includes(editedReferral.location);
    return provider.active && hasService && hasLocation;
  });

  // Filter locations based on selected medical service
  const availableLocations = locations.filter(location => 
    location.active && location.medicalServices?.includes(editedReferral.medicalService)
  );

  const handleSave = () => {
    updateReferral(referral.id, {
      status: editedReferral.status,
      details: {
        ...referral.details,
        ...editedReferral
      }
    });
    setIsEditing(false);
  };

  const getProviderName = (providerId: string) => {
    const provider = providers.find(p => p.id === providerId);
    return provider?.name || providerId;
  };

  const getLocationName = (locationId: string) => {
    const location = locations.find(l => l.id === locationId);
    return location?.name || locationId;
  };

  const getSpecialtyName = (specialtyId: string) => {
    const specialty = specialties.find(s => s.id === specialtyId);
    return specialty?.name || specialtyId;
  };

  return (
    <div className="space-y-6">
      {/* Header with Edit Controls */}
      <div className="flex justify-end">
        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
            >
              <Check className="h-4 w-4 mr-1" />
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Edit2 className="h-4 w-4 mr-1" />
            Edit Details
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 space-y-6">
          {/* Status and Priority Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
              {isEditing ? (
                <div className="space-y-2">
                  <select
                    value={editedReferral.status}
                    onChange={(e) => {
                      const newStatus = e.target.value as ReferralStatus;
                      setEditedReferral(prev => ({
                        ...prev,
                        status: newStatus,
                        subStatus: STATUS_CONFIG[newStatus].subStatuses[0]
                      }));
                    }}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  >
                    {Object.entries(STATUS_CONFIG).map(([key, { label }]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                  <select
                    value={editedReferral.subStatus}
                    onChange={(e) => setEditedReferral(prev => ({
                      ...prev,
                      subStatus: e.target.value
                    }))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  >
                    {STATUS_CONFIG[editedReferral.status].subStatuses.map(subStatus => (
                      <option key={subStatus} value={subStatus}>{subStatus}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-900">
                    {STATUS_CONFIG[referral.status].label}
                  </div>
                  <div className="text-sm text-gray-500">
                    {referral.details.subStatus}
                  </div>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Priority</h3>
              {isEditing ? (
                <select
                  value={editedReferral.priority}
                  onChange={(e) => setEditedReferral(prev => ({
                    ...prev,
                    priority: e.target.value.toLowerCase() as Referral['details']['priority']
                  }))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                >
                  {PRIORITIES.map(priority => (
                    <option key={priority} value={priority.toLowerCase()}>{priority}</option>
                  ))}
                </select>
              ) : (
                <div className="text-sm font-medium text-gray-900">
                  {editedReferral.priority.charAt(0).toUpperCase() + editedReferral.priority.slice(1)}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Created Date</h3>
              <div className="text-sm text-gray-900">
                {format(new Date(referral.date), 'MMM d, yyyy')}
              </div>
            </div>
          </div>

          {/* Referral Details */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Referral Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Medical Service</h4>
                {isEditing ? (
                  <select
                    value={editedReferral.medicalService}
                    onChange={(e) => {
                      const newService = e.target.value;
                      setEditedReferral(prev => ({
                        ...prev,
                        medicalService: newService,
                        location: '',
                        provider: ''
                      }));
                    }}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  >
                    <option value="">Select medical service</option>
                    {specialties
                      .filter(specialty => specialty.active)
                      .map(specialty => (
                        <option key={specialty.id} value={specialty.id}>
                          {specialty.name}
                        </option>
                      ))
                    }
                  </select>
                ) : (
                  <p className="text-sm text-gray-900">
                    {getSpecialtyName(referral.details.medicalService)}
                  </p>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Refer to Location</h4>
                {isEditing ? (
                  <select
                    value={editedReferral.location}
                    onChange={(e) => {
                      const newLocation = e.target.value;
                      setEditedReferral(prev => ({
                        ...prev,
                        location: newLocation,
                        provider: ''
                      }));
                    }}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    disabled={!editedReferral.medicalService}
                  >
                    <option value="">Select location</option>
                    {availableLocations.map(location => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-gray-900">
                    {getLocationName(referral.details.location)}
                  </p>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Refer to Provider</h4>
                {isEditing ? (
                  <select
                    value={editedReferral.provider}
                    onChange={(e) => setEditedReferral(prev => ({
                      ...prev,
                      provider: e.target.value
                    }))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    disabled={!editedReferral.location || !editedReferral.medicalService}
                  >
                    <option value="">Select provider</option>
                    {availableProviders.map(provider => (
                      <option key={provider.id} value={provider.id}>
                        {provider.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-gray-900">
                    {getProviderName(referral.details.provider)}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Reason for Referral</h4>
                {isEditing ? (
                  <textarea
                    value={editedReferral.reason}
                    onChange={(e) => setEditedReferral(prev => ({
                      ...prev,
                      reason: e.target.value
                    }))}
                    rows={4}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                ) : (
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{referral.details.reason}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}