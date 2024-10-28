import React from 'react';
import { Heart, AlertCircle, Users, Calendar } from 'lucide-react';
import { Patient } from '../../../types';

interface PatientMedicalHistoryProps {
  patient: Patient;
}

export default function PatientMedicalHistory({ patient }: PatientMedicalHistoryProps) {
  return (
    <div className="space-y-6">
      {/* Active Medical Conditions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <Heart className="h-5 w-5 text-red-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Active Medical Conditions</h3>
        </div>
        <div className="space-y-4">
          {patient.medicalHistory.conditions.map((condition) => (
            <div key={condition} className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-900">{condition}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* Allergies */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Allergies</h3>
        </div>
        <div className="space-y-4">
          {patient.medicalHistory.allergies.map((allergy) => (
            <div key={allergy} className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-900">{allergy}</h4>
              <p className="mt-1 text-sm text-gray-500">Severity: High</p>
            </div>
          ))}
        </div>
      </div>

      {/* Family History */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <Users className="h-5 w-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Family History</h3>
        </div>
        <div className="prose prose-sm text-gray-500">
          <p>No family history recorded.</p>
        </div>
      </div>

      {/* Surgical History */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <Calendar className="h-5 w-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Surgical History</h3>
        </div>
        <div className="prose prose-sm text-gray-500">
          <p>No surgical history recorded.</p>
        </div>
      </div>
    </div>
  );
}