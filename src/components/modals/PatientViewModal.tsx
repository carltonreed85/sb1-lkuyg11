import React, { useState } from 'react';
import { X, FileText, Share2, Files, MessageSquare } from 'lucide-react';
import PatientInformation from './patient-view/PatientInformation';
import PatientReferrals from './patient-view/PatientReferrals';
import PatientDocuments from './patient-view/PatientDocuments';
import PatientCommunication from './patient-view/PatientCommunication';
import { Patient } from '../../types';

interface PatientViewModalProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'information' | 'referrals' | 'documents' | 'communication';

const tabs = [
  { id: 'information', name: 'Demographics', icon: FileText },
  { id: 'referrals', name: 'Referrals', icon: Share2 },
  { id: 'documents', name: 'Documents', icon: Files },
  { id: 'communication', name: 'Communication', icon: MessageSquare },
] as const;

export default function PatientViewModal({ patient, isOpen, onClose }: PatientViewModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('information');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

      <div className="fixed inset-0 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
          <div className="h-full flex flex-col">
            {/* Patient Info Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Patient Chart</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-gray-900">{patient.fullName}</h3>
                <p className="text-sm text-gray-500">
                  DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="mr-3 h-5 w-5" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="max-w-5xl mx-auto">
              {activeTab === 'information' && <PatientInformation patient={patient} />}
              {activeTab === 'referrals' && <PatientReferrals patient={patient} />}
              {activeTab === 'documents' && <PatientDocuments patient={patient} />}
              {activeTab === 'communication' && <PatientCommunication patient={patient} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}