import React from 'react';
import { TestTube, FileText, Download } from 'lucide-react';
import { Patient } from '../../../types';

interface PatientLabsProps {
  patient: Patient;
}

export default function PatientLabs({ patient }: PatientLabsProps) {
  return (
    <div className="space-y-6">
      {/* Recent Lab Results */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <TestTube className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Recent Lab Results</h3>
          </div>
          <button className="btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            Download All
          </button>
        </div>
        <div className="prose prose-sm text-gray-500">
          <p>No recent lab results available.</p>
        </div>
      </div>

      {/* Recent Imaging */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Recent Imaging</h3>
          </div>
          <button className="btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            Download All
          </button>
        </div>
        <div className="prose prose-sm text-gray-500">
          <p>No recent imaging results available.</p>
        </div>
      </div>
    </div>
  );
}