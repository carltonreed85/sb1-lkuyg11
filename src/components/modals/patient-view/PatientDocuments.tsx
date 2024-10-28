import React from 'react';
import { Files, Upload, Download } from 'lucide-react';
import { Patient } from '../../../types';

interface PatientDocumentsProps {
  patient: Patient;
}

export default function PatientDocuments({ patient }: PatientDocumentsProps) {
  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Files className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Documents</h3>
          </div>
          <button className="btn-primary">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </button>
        </div>
        <div className="prose prose-sm text-gray-500">
          <p>No documents available.</p>
        </div>
      </div>
    </div>
  );
}