import React, { useState } from 'react';
import { Phone, Mail, MapPin, AlertCircle, User, Heart, Edit2, Check, X } from 'lucide-react';
import { Patient } from '../../../types';
import { usePatients } from '../../../contexts/PatientContext';

interface PatientSummaryProps {
  patient: Patient;
}

export default function PatientSummary({ patient }: PatientSummaryProps) {
  const { updatePatient } = usePatients();
  const [isEditing, setIsEditing] = useState(false);
  const [editedPatient, setEditedPatient] = useState({
    gender: patient.gender,
    ethnicity: patient.ethnicity,
    contactInfo: { ...patient.contactInfo },
    insurance: { ...patient.insurance },
    emergencyContact: { ...patient.emergencyContact },
    medicalHistory: { ...patient.medicalHistory }
  });

  const handleSave = () => {
    updatePatient(patient.id, editedPatient);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Edit Controls */}
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

      {/* Primary Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Primary Information</h3>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Gender</dt>
              <dd className="mt-1">
                {isEditing ? (
                  <select
                    value={editedPatient.gender}
                    onChange={(e) => setEditedPatient(prev => ({ ...prev, gender: e.target.value }))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <span className="text-sm text-gray-900">{patient.gender}</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Ethnicity</dt>
              <dd className="mt-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedPatient.ethnicity}
                    onChange={(e) => setEditedPatient(prev => ({ ...prev, ethnicity: e.target.value }))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                ) : (
                  <span className="text-sm text-gray-900">{patient.ethnicity}</span>
                )}
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
          <dl className="space-y-4">
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-400 mr-2" />
              <div className="flex-1">
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1">
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedPatient.contactInfo.phone}
                      onChange={(e) => setEditedPatient(prev => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo, phone: e.target.value }
                      }))}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{patient.contactInfo.phone}</span>
                  )}
                </dd>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-1" />
              <div className="flex-1">
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1">
                  {isEditing ? (
                    <textarea
                      value={editedPatient.contactInfo.address}
                      onChange={(e) => setEditedPatient(prev => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo, address: e.target.value }
                      }))}
                      rows={2}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{patient.contactInfo.address}</span>
                  )}
                </dd>
              </div>
            </div>
          </dl>
        </div>
      </div>

      {/* Insurance Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Insurance Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Primary Insurance</h4>
            {isEditing ? (
              <input
                type="text"
                value={editedPatient.insurance.primary}
                onChange={(e) => setEditedPatient(prev => ({
                  ...prev,
                  insurance: { ...prev.insurance, primary: e.target.value }
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{patient.insurance.primary}</p>
            )}
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Secondary Insurance</h4>
            {isEditing ? (
              <input
                type="text"
                value={editedPatient.insurance.secondary || ''}
                onChange={(e) => setEditedPatient(prev => ({
                  ...prev,
                  insurance: { ...prev.insurance, secondary: e.target.value }
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="Optional"
              />
            ) : (
              patient.insurance.secondary && (
                <p className="mt-1 text-sm text-gray-900">{patient.insurance.secondary}</p>
              )
            )}
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
        <dl className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <dt className="text-sm font-medium text-gray-500">Name</dt>
            <dd className="mt-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editedPatient.emergencyContact.name}
                  onChange={(e) => setEditedPatient(prev => ({
                    ...prev,
                    emergencyContact: { ...prev.emergencyContact, name: e.target.value }
                  }))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              ) : (
                <span className="text-sm text-gray-900">{patient.emergencyContact.name}</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Relationship</dt>
            <dd className="mt-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editedPatient.emergencyContact.relationship}
                  onChange={(e) => setEditedPatient(prev => ({
                    ...prev,
                    emergencyContact: { ...prev.emergencyContact, relationship: e.target.value }
                  }))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              ) : (
                <span className="text-sm text-gray-900">{patient.emergencyContact.relationship}</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Phone</dt>
            <dd className="mt-1">
              {isEditing ? (
                <input
                  type="tel"
                  value={editedPatient.emergencyContact.phone}
                  onChange={(e) => setEditedPatient(prev => ({
                    ...prev,
                    emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
                  }))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              ) : (
                <span className="text-sm text-gray-900">{patient.emergencyContact.phone}</span>
              )}
            </dd>
          </div>
        </dl>
      </div>

      {/* Medical Alerts */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Medical Alerts</h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-1" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">Allergies</h4>
              {isEditing ? (
                <textarea
                  value={editedPatient.medicalHistory.allergies.join('\n')}
                  onChange={(e) => setEditedPatient(prev => ({
                    ...prev,
                    medicalHistory: {
                      ...prev.medicalHistory,
                      allergies: e.target.value.split('\n').filter(Boolean)
                    }
                  }))}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  placeholder="Enter each allergy on a new line"
                />
              ) : (
                <ul className="mt-1 text-sm text-gray-500">
                  {patient.medicalHistory.allergies.map((allergy) => (
                    <li key={allergy}>{allergy}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="flex items-start">
            <Heart className="h-5 w-5 text-red-500 mr-2 mt-1" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">Active Conditions</h4>
              {isEditing ? (
                <textarea
                  value={editedPatient.medicalHistory.conditions.join('\n')}
                  onChange={(e) => setEditedPatient(prev => ({
                    ...prev,
                    medicalHistory: {
                      ...prev.medicalHistory,
                      conditions: e.target.value.split('\n').filter(Boolean)
                    }
                  }))}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  placeholder="Enter each condition on a new line"
                />
              ) : (
                <ul className="mt-1 text-sm text-gray-500">
                  {patient.medicalHistory.conditions.map((condition) => (
                    <li key={condition}>{condition}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}