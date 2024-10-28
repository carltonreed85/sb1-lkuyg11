import React, { useState } from 'react';
import { format } from 'date-fns';

interface PatientRegistrationFormProps {
  onSubmit: (patientData: any) => void;
}

export default function PatientRegistrationForm({ onSubmit }: PatientRegistrationFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    ssn: '',
    maritalStatus: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
    emergency: {
      name: '',
      relationship: '',
      phone: '',
    },
    insurance: {
      provider: '',
      policyNumber: '',
      groupNumber: '',
      phone: '',
      policyHolder: {
        name: '',
        dateOfBirth: '',
        sameAsPatient: true,
      },
    },
    medical: {
      allergies: '',
      medications: '',
      conditions: '',
      familyHistory: '',
    },
    consent: {
      hipaa: false,
      terms: false,
      communications: {
        phone: false,
        email: false,
        text: false,
      },
    },
    additionalNotes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        consent: {
          ...prev.consent,
          [name]: checkbox.checked,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name *</label>
            <input
              type="text"
              name="firstName"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name *</label>
            <input
              type="text"
              name="lastName"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth *</label>
            <input
              type="date"
              name="dateOfBirth"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender *</label>
            <select
              name="gender"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              value={formData.gender}
              onChange={handleInputChange}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Social Security Number</label>
            <input
              type="text"
              name="ssn"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              placeholder="XXX-XX-XXXX"
              value={formData.ssn}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Marital Status</label>
            <select
              name="maritalStatus"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              value={formData.maritalStatus}
              onChange={handleInputChange}
            >
              <option value="">Select status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address *</label>
            <input
              type="email"
              name="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              placeholder="(XXX) XXX-XXXX"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Street Address *</label>
            <input
              type="text"
              name="address.street"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              value={formData.address.street}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">City *</label>
            <input
              type="text"
              name="address.city"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              value={formData.address.city}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">State *</label>
            <select
              name="address.state"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              value={formData.address.state}
              onChange={handleInputChange}
            >
              <option value="">Select state</option>
              {/* Add state options */}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Zip Code *</label>
            <input
              type="text"
              name="address.zipCode"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              placeholder="XXXXX"
              value={formData.address.zipCode}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name *</label>
            <input
              type="text"
              name="emergency.name"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              value={formData.emergency.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Relationship *</label>
            <select
              name="emergency.relationship"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              value={formData.emergency.relationship}
              onChange={handleInputChange}
            >
              <option value="">Select relationship</option>
              <option value="parent">Parent</option>
              <option value="spouse">Spouse</option>
              <option value="child">Child</option>
              <option value="sibling">Sibling</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
            <input
              type="tel"
              name="emergency.phone"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              placeholder="(XXX) XXX-XXXX"
              value={formData.emergency.phone}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      {/* Insurance Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Insurance Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Insurance Provider *</label>
            <input
              type="text"
              name="insurance.provider"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              value={formData.insurance.provider}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Policy Number *</label>
            <input
              type="text"
              name="insurance.policyNumber"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              value={formData.insurance.policyNumber}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Group Number</label>
            <input
              type="text"
              name="insurance.groupNumber"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              value={formData.insurance.groupNumber}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Insurance Phone</label>
            <input
              type="tel"
              name="insurance.phone"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              placeholder="(XXX) XXX-XXXX"
              value={formData.insurance.phone}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      {/* Medical History */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Medical History</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Allergies</label>
            <textarea
              name="medical.allergies"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              value={formData.medical.allergies}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Medications</label>
            <textarea
              name="medical.medications"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              value={formData.medical.medications}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Past Medical Conditions</label>
            <textarea
              name="medical.conditions"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              value={formData.medical.conditions}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Family Medical History</label>
            <textarea
              name="medical.familyHistory"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              value={formData.medical.familyHistory}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      {/* Consent and Agreements */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Consent and Agreements</h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                name="hipaa"
                required
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                checked={formData.consent.hipaa}
                onChange={handleInputChange}
              />
            </div>
            <div className="ml-3 text-sm">
              <label className="font-medium text-gray-700">HIPAA Acknowledgment *</label>
              <p className="text-gray-500">I acknowledge that I have received and understand the HIPAA policies.</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                name="terms"
                required
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                checked={formData.consent.terms}
                onChange={handleInputChange}
              />
            </div>
            <div className="ml-3 text-sm">
              <label className="font-medium text-gray-700">Terms and Conditions *</label>
              <p className="text-gray-500">I agree to the terms and conditions of the organization.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
        <textarea
          name="additionalNotes"
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          value={formData.additionalNotes}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn-primary">
          Register Patient
        </button>
      </div>
    </form>
  );
}