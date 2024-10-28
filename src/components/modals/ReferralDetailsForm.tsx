import React from 'react';

interface ReferralDetailsFormProps {
  patient: any;
  onSubmit: (referralData: any) => void;
}

export default function ReferralDetailsForm({ patient, onSubmit }: ReferralDetailsFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock referral data
    const referralData = {
      id: Math.random().toString(),
      status: 'pending',
      priority: 'medium',
      createdDate: new Date().toISOString(),
    };
    onSubmit(referralData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Information</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="font-medium">{patient.name}</p>
          <p className="text-sm text-gray-500">
            DOB: {new Date(patient.dateOfBirth).toLocaleDateString()} | MRN: {patient.mrn}
          </p>
        </div>
      </div>

      {/* Referral Details */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Referral Details</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Referring Provider
            </label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
              <option>Select provider</option>
              <option>Dr. Sarah Johnson</option>
              <option>Dr. Michael Chen</option>
              <option>Dr. Lisa Anderson</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Specialty
            </label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
              <option>Select specialty</option>
              <option>Cardiology</option>
              <option>Dermatology</option>
              <option>Neurology</option>
              <option>Orthopedics</option>
              <option>Pediatrics</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
              <option>Select priority</option>
              <option>Urgent</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Preferred Timeline
            </label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
              <option>Select timeline</option>
              <option>Within 24 hours</option>
              <option>Within 48 hours</option>
              <option>Within 1 week</option>
              <option>Within 2 weeks</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clinical Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Clinical Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Reason for Referral
            </label>
            <textarea
              required
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Clinical History
            </label>
            <textarea
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Medications
            </label>
            <textarea
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn-primary">
          Create Referral
        </button>
      </div>
    </form>
  );
}