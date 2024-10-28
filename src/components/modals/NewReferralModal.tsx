import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import PatientSearch from './steps/PatientSearch';
import ReferralDetails from './steps/ReferralDetails';
import DocumentUpload from './steps/DocumentUpload';
import ReviewSubmit from './steps/ReviewSubmit';
import ProgressBar from '../common/ProgressBar';
import { useReferrals } from '../../contexts/ReferralContext';

interface NewReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type Step = 'patient-search' | 'referral-details' | 'document-upload' | 'review';

const steps: { id: Step; title: string }[] = [
  { id: 'patient-search', title: 'Patient Information' },
  { id: 'referral-details', title: 'Referral Details' },
  { id: 'document-upload', title: 'Documents' },
  { id: 'review', title: 'Review & Submit' },
];

const initialFormData = {
  patient: null,
  referral: null,
  documents: [],
};

export default function NewReferralModal({ isOpen, onClose }: NewReferralModalProps) {
  const { addReferral } = useReferrals();
  const [currentStep, setCurrentStep] = useState<Step>('patient-search');
  const [formData, setFormData] = useState(initialFormData);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('patient-search');
      setFormData(initialFormData);
    }
  }, [isOpen]);

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = (data: any) => {
    const stepIndex = steps.findIndex((step) => step.id === currentStep);
    
    setFormData((prev) => ({
      ...prev,
      [currentStep === 'patient-search' ? 'patient' : 
        currentStep === 'referral-details' ? 'referral' : 
        currentStep === 'document-upload' ? 'documents' : '']: data
    }));

    if (stepIndex < steps.length - 1) {
      setCurrentStep(steps[stepIndex + 1].id);
    }
  };

  const handleBack = () => {
    const stepIndex = steps.findIndex((step) => step.id === currentStep);
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1].id);
    }
  };

  const handleSubmit = (finalData: any) => {
    const completeFormData = {
      ...formData,
      ...finalData,
    };

    // Create the referral object
    const newReferral = {
      patient: {
        id: completeFormData.patient.id,
        name: completeFormData.patient.name,
        dateOfBirth: completeFormData.patient.dateOfBirth,
        mrn: completeFormData.patient.mrn,
      },
      details: {
        location: completeFormData.referral.location,
        provider: completeFormData.referral.provider,
        medicalService: completeFormData.referral.specialty,
        priority: completeFormData.referral.priority,
        reason: completeFormData.referral.reason,
        notes: completeFormData.referral.notes,
        subStatus: 'Unassigned',
        preferredDate: completeFormData.referral.preferredDate,
        preferredTime: completeFormData.referral.preferredTime,
        insuranceVerified: completeFormData.referral.insuranceVerified,
        insuranceNotes: completeFormData.referral.insuranceNotes,
      },
      documents: completeFormData.documents.map((doc: any) => ({
        id: doc.id,
        name: doc.name,
        type: doc.type,
        url: doc.url,
      })),
    };

    // Add the referral
    addReferral(newReferral);
    onClose();
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setCurrentStep('patient-search');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                New Referral
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {steps.find((step) => step.id === currentStep)?.title}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 pt-6">
            <ProgressBar
              steps={steps}
              currentStep={currentStep}
              progress={progress}
            />
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="form-section">
              {currentStep === 'patient-search' && (
                <PatientSearch onNext={handleNext} />
              )}
              {currentStep === 'referral-details' && (
                <ReferralDetails
                  patient={formData.patient}
                  onBack={handleBack}
                  onNext={handleNext}
                />
              )}
              {currentStep === 'document-upload' && (
                <DocumentUpload
                  onBack={handleBack}
                  onNext={handleNext}
                />
              )}
              {currentStep === 'review' && (
                <ReviewSubmit
                  formData={formData}
                  onBack={handleBack}
                  onSubmit={handleSubmit}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}