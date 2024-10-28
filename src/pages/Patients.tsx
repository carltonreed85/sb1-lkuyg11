import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, Phone, MapPin, Shield, X } from 'lucide-react';
import { usePatients } from '../contexts/PatientContext';
import { format } from 'date-fns';
import PatientViewModal from '../components/modals/PatientViewModal';
import PatientRegistrationForm from '../components/modals/PatientRegistrationForm';
import { Patient } from '../types';

export default function Patients() {
  const { patients, addPatient } = usePatients();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isPatientViewModalOpen, setIsPatientViewModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  const filteredPatients = patients.filter((patient) =>
    patient.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.contactInfo.phone.includes(searchQuery) ||
    patient.insurance.primary.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsPatientViewModalOpen(true);
  };

  const handlePatientRegistered = (patientData: any) => {
    addPatient(patientData);
    setIsRegistrationModalOpen(false);
  };

  return (
    <>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Patients</h1>
          <p className="mt-2 text-sm text-gray-700">
            A comprehensive list of all registered patients and their essential information.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button 
            className="btn-primary"
            onClick={() => setIsRegistrationModalOpen(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            Register Patient
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="Search patients by name, phone, or insurance..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          <Filter className="h-5 w-5 mr-2" />
          Filters
        </button>
      </div>

      {/* Patients Table */}
      <div className="mt-8 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Patient Information
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Contact Details
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Insurance
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredPatients.map((patient) => (
                    <tr 
                      key={patient.id}
                      className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                      onClick={() => handleViewPatient(patient)}
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-medium">
                              {patient.fullName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{patient.fullName}</div>
                            <div className="text-sm text-gray-500 space-y-1">
                              <div>DOB: {format(new Date(patient.dateOfBirth), 'MMM d, yyyy')}</div>
                              <div className="flex items-center gap-1">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  patient.gender === 'male' ? 'bg-blue-100 text-blue-800' :
                                  patient.gender === 'female' ? 'bg-pink-100 text-pink-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4">
                        <div className="text-sm space-y-2">
                          <div className="flex items-center text-gray-900">
                            <Phone className="h-4 w-4 text-gray-400 mr-2" />
                            {patient.contactInfo.phone}
                          </div>
                          <div className="flex items-start">
                            <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-1" />
                            <span className="text-gray-500 line-clamp-2">
                              {patient.contactInfo.address}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4">
                        <div className="text-sm space-y-2">
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 text-gray-400 mr-2" />
                            <div>
                              <div className="text-gray-900">{patient.insurance.primary.provider}</div>
                              {patient.insurance.secondary && (
                                <div className="text-gray-500 text-xs">+Secondary Insurance</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button className="text-gray-400 hover:text-gray-500">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Patient View Modal */}
      {selectedPatient && (
        <PatientViewModal
          patient={selectedPatient}
          isOpen={isPatientViewModalOpen}
          onClose={() => {
            setIsPatientViewModalOpen(false);
            setSelectedPatient(null);
          }}
        />
      )}

      {/* Patient Registration Modal */}
      {isRegistrationModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            
            <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Register New Patient</h2>
                <button
                  onClick={() => setIsRegistrationModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                <PatientRegistrationForm onSubmit={handlePatientRegistered} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}