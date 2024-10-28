import React, { useState } from 'react';
import { X, MessageSquare, FileText, CheckSquare, User } from 'lucide-react';
import ReferralSummary from './referral-view/ReferralSummary';
import ReferralCommunication from './referral-view/ReferralCommunication';
import ReferralDocuments from './referral-view/ReferralDocuments';
import ReferralTasks from './referral-view/ReferralTasks';
import { Referral } from '../../contexts/ReferralContext';
import { usePatients } from '../../contexts/PatientContext';
import PatientViewModal from './PatientViewModal';

interface ReferralViewModalProps {
  referral: Referral;
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'summary' | 'communication' | 'documents' | 'tasks';

const tabs = [
  { id: 'summary', name: 'Summary', icon: FileText },
  { id: 'communication', name: 'Communication', icon: MessageSquare },
  { id: 'documents', name: 'Documents', icon: FileText },
  { id: 'tasks', name: 'Tasks', icon: CheckSquare },
] as const;

export default function ReferralViewModal({ referral, isOpen, onClose }: ReferralViewModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('summary');
  const [showPatientChart, setShowPatientChart] = useState(false);
  const { patients } = usePatients();
  const patient = patients.find(p => p.id === referral.patient.id);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

          <div className="relative w-full max-w-6xl bg-white rounded-lg shadow-xl">
            {/* Header */}
            <div className="flex flex-col border-b border-gray-200">
              <div className="flex items-center justify-between p-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {referral.patient.name}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Case ID: {referral.caseId}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>DOB: {new Date(referral.patient.dateOfBirth).toLocaleDateString()}</span>
                    {referral.patient.mrn && <span>MRN: {referral.patient.mrn}</span>}
                    {patient && (
                      <button
                        onClick={() => setShowPatientChart(true)}
                        className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-md text-primary hover:text-primary-dark hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        <User className="h-4 w-4 mr-1" />
                        View Patient Chart
                      </button>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Tabs */}
              <div className="px-6">
                <nav className="flex -mb-px space-x-8" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        group inline-flex items-center px-1 py-4 border-b-2 font-medium text-sm
                        ${
                          activeTab === tab.id
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }
                      `}
                    >
                      <tab.icon
                        className={`-ml-0.5 mr-2 h-5 w-5 ${
                          activeTab === tab.id ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                      />
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === 'summary' && <ReferralSummary referral={referral} />}
              {activeTab === 'communication' && <ReferralCommunication referral={referral} />}
              {activeTab === 'documents' && <ReferralDocuments referral={referral} />}
              {activeTab === 'tasks' && <ReferralTasks referral={referral} />}
            </div>
          </div>
        </div>
      </div>

      {/* Patient Chart Modal */}
      {patient && showPatientChart && (
        <PatientViewModal
          patient={patient}
          isOpen={showPatientChart}
          onClose={() => setShowPatientChart(false)}
        />
      )}
    </>
  );
}