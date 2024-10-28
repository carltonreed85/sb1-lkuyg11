import React, { useState } from 'react';
import { Phone, Mail, MapPin, AlertCircle, User, Heart, Edit2, Check, X } from 'lucide-react';
import { Patient, InsurancePolicy } from '../../../types';
import { usePatients } from '../../../contexts/PatientContext';
import { format } from 'date-fns';

interface PatientInformationProps {
  patient: Patient;
}

interface DataRowProps {
  label: string;
  value: string | React.ReactNode;
  isEditing?: boolean;
  editComponent?: React.ReactNode;
}

const DataRow: React.FC<DataRowProps> = ({ label, value, isEditing, editComponent }) => (
  <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
      {isEditing ? editComponent : value}
    </dd>
  </div>
);

const InsuranceSection: React.FC<{
  insurance: InsurancePolicy;
  isEditing: boolean;
  onChange?: (field: string, value: string) => void;
  isPrimary?: boolean;
}> = ({ insurance, isEditing, onChange, isPrimary = true }) => {
  const title = isPrimary ? 'Primary Insurance' : 'Secondary Insurance';
  
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-medium text-gray-900">{title}</h4>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-200">
          <DataRow
            label="Provider"
            value={insurance.provider}
            isEditing={isEditing}
            editComponent={
              <input
                type="text"
                value={insurance.provider}
                onChange={(e) => onChange?.('provider', e.target.value)}
                className="form-input"
              />
            }
          />
          <DataRow
            label="Policy Number"
            value={insurance.policyNumber}
            isEditing={isEditing}
            editComponent={
              <input
                type="text"
                value={insurance.policyNumber}
                onChange={(e) => onChange?.('policyNumber', e.target.value)}
                className="form-input"
              />
            }
          />
          <DataRow
            label="Group Number"
            value={insurance.groupNumber}
            isEditing={isEditing}
            editComponent={
              <input
                type="text"
                value={insurance.groupNumber}
                onChange={(e) => onChange?.('groupNumber', e.target.value)}
                className="form-input"
              />
            }
          />
          <DataRow
            label="Effective Date"
            value={format(new Date(insurance.effectiveDate), 'MMM d, yyyy')}
            isEditing={isEditing}
            editComponent={
              <input
                type="date"
                value={insurance.effectiveDate}
                onChange={(e) => onChange?.('effectiveDate', e.target.value)}
                className="form-input"
              />
            }
          />
          <DataRow
            label="Policy Holder"
            value={
              <div>
                <div>{insurance.policyHolder.name}</div>
                <div className="text-sm text-gray-500">
                  Relationship: {insurance.policyHolder.relationship}
                </div>
                <div className="text-sm text-gray-500">
                  DOB: {format(new Date(insurance.policyHolder.dateOfBirth), 'MMM d, yyyy')}
                </div>
              </div>
            }
            isEditing={isEditing}
            editComponent={
              <div className="space-y-2">
                <input
                  type="text"
                  value={insurance.policyHolder.name}
                  onChange={(e) => onChange?.('policyHolderName', e.target.value)}
                  placeholder="Policy Holder Name"
                  className="form-input"
                />
                <input
                  type="text"
                  value={insurance.policyHolder.relationship}
                  onChange={(e) => onChange?.('policyHolderRelationship', e.target.value)}
                  placeholder="Relationship"
                  className="form-input"
                />
                <input
                  type="date"
                  value={insurance.policyHolder.dateOfBirth}
                  onChange={(e) => onChange?.('policyHolderDOB', e.target.value)}
                  className="form-input"
                />
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default function PatientInformation({ patient }: PatientInformationProps) {
  const { updatePatient } = usePatients();
  const [isEditing, setIsEditing] = useState(false);
  const [editedPatient, setEditedPatient] = useState(patient);

  const handleSave = () => {
    updatePatient(patient.id, editedPatient);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedPatient(patient);
    setIsEditing(false);
  };

  const handleInsuranceChange = (isPrimary: boolean) => (field: string, value: string) => {
    setEditedPatient(prev => {
      const insuranceKey = isPrimary ? 'primary' : 'secondary';
      const insurance = prev.insurance[insuranceKey];
      
      if (!insurance) return prev;

      let updatedInsurance = { ...insurance };

      if (field.startsWith('policyHolder')) {
        const policyHolderField = field.replace('policyHolder', '').toLowerCase();
        updatedInsurance = {
          ...insurance,
          policyHolder: {
            ...insurance.policyHolder,
            [policyHolderField]: value
          }
        };
      } else {
        updatedInsurance = {
          ...insurance,
          [field]: value
        };
      }

      return {
        ...prev,
        insurance: {
          ...prev.insurance,
          [insuranceKey]: updatedInsurance
        }
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Edit Controls */}
      <div className="flex justify-end bg-white py-2">
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
              onClick={handleCancel}
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

      {/* Demographics Section */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Demographics</h3>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <DataRow
              label="Full Name"
              value={editedPatient.fullName}
              isEditing={isEditing}
              editComponent={
                <input
                  type="text"
                  value={editedPatient.fullName}
                  onChange={(e) => setEditedPatient(prev => ({ ...prev, fullName: e.target.value }))}
                  className="form-input"
                />
              }
            />
            <DataRow
              label="Date of Birth"
              value={format(new Date(editedPatient.dateOfBirth), 'MMM d, yyyy')}
              isEditing={isEditing}
              editComponent={
                <input
                  type="date"
                  value={editedPatient.dateOfBirth}
                  onChange={(e) => setEditedPatient(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  className="form-input"
                />
              }
            />
            <DataRow
              label="Gender"
              value={editedPatient.gender}
              isEditing={isEditing}
              editComponent={
                <select
                  value={editedPatient.gender}
                  onChange={(e) => setEditedPatient(prev => ({ ...prev, gender: e.target.value }))}
                  className="form-select"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              }
            />
            <DataRow
              label="Ethnicity"
              value={editedPatient.ethnicity}
              isEditing={isEditing}
              editComponent={
                <input
                  type="text"
                  value={editedPatient.ethnicity}
                  onChange={(e) => setEditedPatient(prev => ({ ...prev, ethnicity: e.target.value }))}
                  className="form-input"
                />
              }
            />
          </dl>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Contact Information</h3>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <DataRow
              label="Phone"
              value={editedPatient.contactInfo.phone}
              isEditing={isEditing}
              editComponent={
                <input
                  type="tel"
                  value={editedPatient.contactInfo.phone}
                  onChange={(e) => setEditedPatient(prev => ({
                    ...prev,
                    contactInfo: { ...prev.contactInfo, phone: e.target.value }
                  }))}
                  className="form-input"
                />
              }
            />
            <DataRow
              label="Address"
              value={editedPatient.contactInfo.address}
              isEditing={isEditing}
              editComponent={
                <textarea
                  value={editedPatient.contactInfo.address}
                  onChange={(e) => setEditedPatient(prev => ({
                    ...prev,
                    contactInfo: { ...prev.contactInfo, address: e.target.value }
                  }))}
                  rows={3}
                  className="form-textarea"
                />
              }
            />
          </dl>
        </div>
      </div>

      {/* Insurance Information */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Insurance Information</h3>
        </div>
        <div className="border-t border-gray-200 p-4 space-y-6">
          <InsuranceSection
            insurance={editedPatient.insurance.primary}
            isEditing={isEditing}
            onChange={handleInsuranceChange(true)}
            isPrimary={true}
          />
          {editedPatient.insurance.secondary && (
            <InsuranceSection
              insurance={editedPatient.insurance.secondary}
              isEditing={isEditing}
              onChange={handleInsuranceChange(false)}
              isPrimary={false}
            />
          )}
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Emergency Contact</h3>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <DataRow
              label="Name"
              value={editedPatient.emergencyContact.name}
              isEditing={isEditing}
              editComponent={
                <input
                  type="text"
                  value={editedPatient.emergencyContact.name}
                  onChange={(e) => setEditedPatient(prev => ({
                    ...prev,
                    emergencyContact: { ...prev.emergencyContact, name: e.target.value }
                  }))}
                  className="form-input"
                />
              }
            />
            <DataRow
              label="Relationship"
              value={editedPatient.emergencyContact.relationship}
              isEditing={isEditing}
              editComponent={
                <input
                  type="text"
                  value={editedPatient.emergencyContact.relationship}
                  onChange={(e) => setEditedPatient(prev => ({
                    ...prev,
                    emergencyContact: { ...prev.emergencyContact, relationship: e.target.value }
                  }))}
                  className="form-input"
                />
              }
            />
            <DataRow
              label="Phone"
              value={editedPatient.emergencyContact.phone}
              isEditing={isEditing}
              editComponent={
                <input
                  type="tel"
                  value={editedPatient.emergencyContact.phone}
                  onChange={(e) => setEditedPatient(prev => ({
                    ...prev,
                    emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
                  }))}
                  className="form-input"
                />
              }
            />
          </dl>
        </div>
      </div>
    </div>
  );
}