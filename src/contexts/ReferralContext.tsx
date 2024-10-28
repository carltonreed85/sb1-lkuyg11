import React, { createContext, useContext, useState, ReactNode } from 'react';
import { format } from 'date-fns';

export type ReferralStatus = 'new' | 'in_progress' | 'pending_authorization' | 'scheduled' | 'completed' | 'on_hold' | 'cancelled' | 'closed';
export type ReferralPriority = 'urgent' | 'high' | 'medium' | 'low';

interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  mrn?: string;
}

interface ReferralDetails {
  location: string;
  provider: string;
  medicalService: string;
  priority: ReferralPriority;
  reason: string;
  notes?: string;
  subStatus: string;
}

export interface Referral {
  id: string;
  caseId: string;
  patient: Patient;
  details: ReferralDetails;
  status: ReferralStatus;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
  }>;
  date: string;
  completionDate?: string;
}

interface ReferralContextType {
  referrals: Referral[];
  addReferral: (referral: Omit<Referral, 'id' | 'date' | 'status' | 'caseId'>) => void;
  getRecentReferrals: (limit?: number) => Referral[];
  updateReferral: (id: string, updates: Partial<Referral>) => void;
  getReferralsByPatient: (patientId: string) => Referral[];
  deleteReferral: (id: string) => void;
}

const ReferralContext = createContext<ReferralContextType | undefined>(undefined);

// Function to generate a case ID
const generateCaseId = () => {
  const prefix = 'REF';
  const randomNum = Math.floor(Math.random() * 900000) + 100000; // 6-digit number
  return `${prefix}${randomNum}`;
};

export function ReferralProvider({ children }: { children: ReactNode }) {
  const [referrals, setReferrals] = useState<Referral[]>([
    {
      id: '1',
      caseId: 'REF123456',
      patient: {
        id: '1',
        name: 'John Smith',
        dateOfBirth: '1985-06-15',
        mrn: 'MRN001',
      },
      details: {
        location: 'Main Hospital',
        provider: 'Dr. Sarah Johnson',
        medicalService: 'Cardiology',
        priority: 'high',
        reason: 'Cardiac evaluation',
        subStatus: 'Unassigned'
      },
      status: 'new',
      documents: [],
      date: '2024-03-15',
    },
  ]);

  const addReferral = (newReferral: Omit<Referral, 'id' | 'date' | 'status' | 'caseId'>) => {
    const referral: Referral = {
      ...newReferral,
      id: Math.random().toString(36).substr(2, 9),
      caseId: generateCaseId(),
      date: format(new Date(), 'yyyy-MM-dd'),
      status: 'new',
    };

    setReferrals((prev) => [referral, ...prev]);
  };

  const updateReferral = (id: string, updates: Partial<Referral>) => {
    setReferrals(prev => prev.map(referral => 
      referral.id === id ? { ...referral, ...updates } : referral
    ));
  };

  const getRecentReferrals = (limit = 10) => {
    return referrals
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  const getReferralsByPatient = (patientId: string) => {
    return referrals.filter(referral => referral.patient.id === patientId);
  };

  const deleteReferral = (id: string) => {
    setReferrals(prev => prev.filter(referral => referral.id !== id));
  };

  return (
    <ReferralContext.Provider 
      value={{ 
        referrals, 
        addReferral, 
        getRecentReferrals, 
        updateReferral,
        getReferralsByPatient,
        deleteReferral
      }}
    >
      {children}
    </ReferralContext.Provider>
  );
}

export function useReferrals() {
  const context = useContext(ReferralContext);
  if (context === undefined) {
    throw new Error('useReferrals must be used within a ReferralProvider');
  }
  return context;
}