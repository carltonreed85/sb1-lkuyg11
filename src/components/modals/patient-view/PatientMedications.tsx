import React from 'react';
import { Pill, AlertCircle, Clock } from 'lucide-react';
import { Patient } from '../../../types';

interface PatientMedicationsProps {
  patient: Patient;
}

export default function PatientMedications({ patient }: PatientMedicationsProps) {
  return (
    <div className="space-y-6">
      {/* Current Medications */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <Pill className="h-5 w-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Current Medications</h3>
        </div>
        <div className="space-y-4">
          {patient.medicalHistory.medications.map((medication) => (
            <div key={medication} className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-900">{medication}</h4>
              <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <p className="font-medium">Dosage</p>
                  <p>Not specified</p>
                </div>
                <div>
                  <p className="font-medium">Frequency</p>
                  <p>Not specified</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Medication Allergies */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Medication Allergies</h3>
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

      {/* Medication History */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <Clock className="h-5 w-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Past Medications</h3>
        </div>
        <div className="prose prose-sm text-gray-500">
          <p>No past medications recorded.</p>
        </div>
      </div>
    </div>
  );
}