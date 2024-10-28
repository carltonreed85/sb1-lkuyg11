import React from 'react';
import { Check, Calendar, Clock, AlertCircle } from 'lucide-react';
import { useReferrals } from '../../../contexts/ReferralContext';
import { useSettings } from '../../../contexts/SettingsContext';

interface ReviewSubmitProps {
  formData: {
    patient: {
      id: string;
      name: string;
      dateOfBirth: string;
      mrn?: string;
    };
    referral: {
      location: string;
      provider: string;
      specialty: string;
      priority: string;
      reason: string;
      notes?: string;
      preferredDate?: string;
      preferredTime?: string;
      insuranceVerified: boolean;
      insuranceNotes?: string;
    };
    documents: Array<{
      id: string;
      name: string;
      type: string;
      url: string;
    }>;
  };
  onBack: () => void;
  onSubmit: (data: any) => void;
}

export default function ReviewSubmit({ formData, onBack, onSubmit }: ReviewSubmitProps) {
  const { addReferral } = useReferrals();
  const { providers, locations, specialties } = useSettings();

  const getProviderName = (providerId: string) => {
    return providers.find(p => p.id === providerId)?.name || providerId;
  };

  const getLocationName = (locationId: string) => {
    return locations.find(l => l.id === locationId)?.name || locationId;
  };

  const getSpecialtyName = (specialtyId: string) => {
    return specialties.find(s => s.id === specialtyId)?.name || specialtyId;
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="space-y-6">
      {/* Patient Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Patient Information</h3>
        <div className="mt-4 bg-gray-50 p-4 rounded-md">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.patient?.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.patient?.dateOfBirth && new Date(formData.patient.dateOfBirth).toLocaleDateString()}
              </dd>
            </div>
            {formData.patient?.mrn && (
              <div>
                <dt className="text-sm font-medium text-gray-500">MRN</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.patient.mrn}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Referral Details */}
      <div>
        <h3 className="text-lg font-medium text-gray-900">Referral Details</h3>
        <div className="mt-4 bg-gray-50 p-4 rounded-md">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Medical Service</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {getSpecialtyName(formData.referral?.specialty)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Location</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {getLocationName(formData.referral?.location)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Provider</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {getProviderName(formData.referral?.provider)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Priority</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  formData.referral?.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                  formData.referral?.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                  formData.referral?.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {formData.referral?.priority.charAt(0).toUpperCase() + formData.referral?.priority.slice(1)}
                </span>
              </dd>
            </div>

            {/* Preferred Date and Time */}
            {(formData.referral?.preferredDate || formData.referral?.preferredTime) && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Preferred Schedule</dt>
                <dd className="mt-1 text-sm text-gray-900 flex items-center gap-4">
                  {formData.referral?.preferredDate && (
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      {new Date(formData.referral.preferredDate).toLocaleDateString()}
                    </span>
                  )}
                  {formData.referral?.preferredTime && (
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                      {formData.referral.preferredTime}
                    </span>
                  )}
                </dd>
              </div>
            )}

            {/* Insurance Verification */}
            {formData.referral?.insuranceVerified && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Insurance Status</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <div className="flex items-center text-green-600">
                    <Check className="h-4 w-4 mr-1" />
                    Insurance Verified
                  </div>
                  {formData.referral.insuranceNotes && (
                    <p className="mt-1 text-gray-600">{formData.referral.insuranceNotes}</p>
                  )}
                </dd>
              </div>
            )}

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Reason for Referral</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.referral?.reason}</dd>
            </div>
            
            {formData.referral?.notes && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Additional Notes</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.referral?.notes}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Documents */}
      {formData.documents?.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900">Uploaded Documents</h3>
          <ul className="mt-4 divide-y divide-gray-200 bg-gray-50 rounded-md">
            {formData.documents.map((doc) => (
              <li key={doc.id} className="py-3 px-4 flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-sm text-gray-900">{doc.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

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
          type="button"
          onClick={handleSubmit}
          className="btn-primary"
        >
          Submit Referral
        </button>
      </div>
    </div>
  );
}