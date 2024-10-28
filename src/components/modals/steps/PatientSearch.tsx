import React, { useState } from 'react';
import { Search, Plus, ChevronRight } from 'lucide-react';
import PatientRegistrationForm from '../PatientRegistrationForm';

interface PatientSearchProps {
  onNext: (patient: any) => void;
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  mrn: string;
  phone: string;
  email: string;
}

export default function PatientSearch({ onNext }: PatientSearchProps) {
  const [showRegistration, setShowRegistration] = useState(false);
  const [searchFields, setSearchFields] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    mrn: '',
    phone: '',
  });
  const [hasSearched, setHasSearched] = useState(false);

  // Mock patient data
  const mockPatients: Patient[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: '1985-06-15',
      mrn: 'MRN001',
      phone: '(555) 123-4567',
      email: 'john.smith@email.com',
    },
    {
      id: '2',
      firstName: 'Emma',
      lastName: 'Wilson',
      dateOfBirth: '1992-03-22',
      mrn: 'MRN002',
      phone: '(555) 234-5678',
      email: 'emma.wilson@email.com',
    },
  ];

  const searchPatients = () => {
    const normalizedFields = {
      firstName: searchFields.firstName.toLowerCase().trim(),
      lastName: searchFields.lastName.toLowerCase().trim(),
      dateOfBirth: searchFields.dateOfBirth.trim(),
      mrn: searchFields.mrn.toLowerCase().trim(),
      phone: searchFields.phone.replace(/\D/g, ''),
    };

    // Only search if at least one field has a value
    const hasSearchCriteria = Object.values(normalizedFields).some(value => value !== '');
    if (!hasSearchCriteria) return [];

    return mockPatients.filter(patient => {
      // Exact match for MRN if provided
      if (normalizedFields.mrn && patient.mrn.toLowerCase() !== normalizedFields.mrn) {
        return false;
      }

      // Exact match for date of birth if provided
      if (normalizedFields.dateOfBirth && patient.dateOfBirth !== normalizedFields.dateOfBirth) {
        return false;
      }

      // Exact match for phone if provided (comparing only digits)
      if (normalizedFields.phone && patient.phone.replace(/\D/g, '') !== normalizedFields.phone) {
        return false;
      }

      // Partial match for first name if provided
      if (normalizedFields.firstName && !patient.firstName.toLowerCase().startsWith(normalizedFields.firstName)) {
        return false;
      }

      // Partial match for last name if provided
      if (normalizedFields.lastName && !patient.lastName.toLowerCase().startsWith(normalizedFields.lastName)) {
        return false;
      }

      return true;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchFields(prev => ({
      ...prev,
      [name]: value
    }));
    setHasSearched(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
  };

  const handlePatientSelect = (patient: Patient) => {
    onNext({
      id: patient.id,
      name: `${patient.firstName} ${patient.lastName}`,
      dateOfBirth: patient.dateOfBirth,
      mrn: patient.mrn,
      phone: patient.phone,
      email: patient.email,
    });
  };

  const handlePatientRegistered = (patient: any) => {
    onNext(patient);
  };

  const matchedPatients = hasSearched ? searchPatients() : [];
  const hasSearchInput = Object.values(searchFields).some(value => value.trim() !== '');

  if (showRegistration) {
    return <PatientRegistrationForm onSubmit={handlePatientRegistered} />;
  }

  return (
    <div className="space-y-6">
      {/* Multi-field Search Form */}
      <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Search Patient</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={searchFields.firstName}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
                placeholder="Enter first name"
              />
            </div>
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={searchFields.lastName}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
                placeholder="Enter last name"
              />
            </div>
          </div>
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <div className="mt-1">
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={searchFields.dateOfBirth}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          <div>
            <label htmlFor="mrn" className="block text-sm font-medium text-gray-700">
              MRN
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="mrn"
                name="mrn"
                value={searchFields.mrn}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
                placeholder="Enter MRN"
              />
            </div>
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="mt-1">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={searchFields.phone}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
                placeholder="(XXX) XXX-XXXX"
              />
            </div>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <Search className="h-5 w-5 mr-2" />
              Search
            </button>
          </div>
        </div>
      </form>

      {/* Search Results */}
      {hasSearched && hasSearchInput && (
        <div className="space-y-4">
          {matchedPatients.length === 0 ? (
            <div className="text-center py-4 bg-gray-50 rounded-lg shadow-md">
              <p className="text-gray-500">No matching patients found</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">
                  Matching Patients ({matchedPatients.length})
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {matchedPatients.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => handlePatientSelect(patient)}
                    className="w-full text-left px-4 py-4 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {patient.firstName} {patient.lastName}
                        </h4>
                        <div className="mt-1 text-sm text-gray-500 space-y-1">
                          <p>DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}</p>
                          <p>MRN: {patient.mrn}</p>
                          <p>Phone: {patient.phone}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Register New Patient Button */}
      <button
        onClick={() => setShowRegistration(true)}
        className="w-full flex items-center justify-between p-4 bg-primary-dark text-white rounded-lg hover:bg-primary-dark/90 transition-colors shadow-md"
      >
        <div className="flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          <span className="font-medium">Register New Patient</span>
        </div>
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}