import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Patient, InsurancePolicy } from '../types';

interface PatientContextType {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

const defaultInsurancePolicy: InsurancePolicy = {
  provider: 'Blue Cross Blue Shield',
  policyNumber: 'BCBS123456789',
  groupNumber: 'GRP987654321',
  effectiveDate: '2024-01-01',
  policyHolder: {
    name: 'John Smith',
    relationship: 'Self',
    dateOfBirth: '1985-06-15',
  },
};

// Mock initial patients data
const initialPatients: Patient[] = [
  {
    id: '1',
    fullName: 'John Smith',
    dateOfBirth: '1985-06-15',
    gender: 'male',
    ethnicity: 'Caucasian',
    contactInfo: {
      phone: '(555) 123-4567',
      address: '123 Main St, Anytown, USA',
    },
    insurance: {
      primary: defaultInsurancePolicy,
      secondary: {
        ...defaultInsurancePolicy,
        provider: 'Medicare',
        policyNumber: 'MED987654321',
      },
    },
    emergencyContact: {
      name: 'Jane Smith',
      relationship: 'Spouse',
      phone: '(555) 987-6543',
    },
    medicalHistory: {
      conditions: ['Hypertension', 'Type 2 Diabetes'],
      allergies: ['Penicillin'],
      medications: ['Metformin', 'Lisinopril'],
    },
  },
  {
    id: '2',
    fullName: 'Emma Wilson',
    dateOfBirth: '1992-03-22',
    gender: 'female',
    ethnicity: 'Asian',
    contactInfo: {
      phone: '(555) 234-5678',
      address: '456 Oak Ave, Somewhere, USA',
    },
    insurance: {
      primary: {
        ...defaultInsurancePolicy,
        provider: 'Aetna',
        policyNumber: 'AET123456789',
      },
    },
    emergencyContact: {
      name: 'Robert Wilson',
      relationship: 'Father',
      phone: '(555) 876-5432',
    },
    medicalHistory: {
      conditions: ['Asthma'],
      allergies: ['Pollen', 'Dust'],
      medications: ['Albuterol'],
    },
  },
];

export function PatientProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);

  const addPatient = (patient: Omit<Patient, 'id'>) => {
    const newPatient = {
      ...patient,
      id: Math.random().toString(36).substr(2, 9),
    };
    setPatients((prev) => [...prev, newPatient]);
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients((prev) =>
      prev.map((patient) =>
        patient.id === id ? { ...patient, ...updates } : patient
      )
    );
  };

  const deletePatient = (id: string) => {
    setPatients((prev) => prev.filter((patient) => patient.id !== id));
  };

  return (
    <PatientContext.Provider value={{ patients, addPatient, updatePatient, deletePatient }}>
      {children}
    </PatientContext.Provider>
  );
}

export function usePatients() {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatients must be used within a PatientProvider');
  }
  return context;
}