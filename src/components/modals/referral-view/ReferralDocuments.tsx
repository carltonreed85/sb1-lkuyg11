import React, { useState } from 'react';
import { Upload, X, File, Image as ImageIcon, FileText, Link as LinkIcon, Plus } from 'lucide-react';
import { Referral } from '../../../contexts/ReferralContext';
import { usePatients } from '../../../contexts/PatientContext';

interface ReferralDocumentsProps {
  referral: Referral;
}

interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  source?: 'upload' | 'patient_chart';
  uploadDate: string;
}

export default function ReferralDocuments({ referral }: ReferralDocumentsProps) {
  const { patients } = usePatients();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [showChartDocuments, setShowChartDocuments] = useState(false);

  const patient = patients.find(p => p.id === referral.patient.id);
  
  // Mock patient chart documents
  const patientChartDocuments: Document[] = patient ? [
    {
      id: 'chart-1',
      name: 'Previous Lab Results.pdf',
      type: 'application/pdf',
      url: '#',
      source: 'patient_chart',
      uploadDate: '2024-03-01'
    },
    {
      id: 'chart-2',
      name: 'Medical History.pdf',
      type: 'application/pdf',
      url: '#',
      source: 'patient_chart',
      uploadDate: '2024-02-15'
    }
  ] : [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        id: Math.random().toString(),
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
        uploadDate: new Date().toISOString()
      }));
      // Handle file upload logic
      console.log('New files:', newFiles);
    }
  };

  const handleChartDocumentSelect = (document: Document) => {
    // Handle document association logic
    console.log('Selected chart document:', document);
  };

  const isImage = (type: string) => type.startsWith('image/');
  const isPDF = (type: string) => type === 'application/pdf';

  return (
    <div className="space-y-6">
      {/* Upload Options */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => setShowUploadOptions(true)}
          className="btn-primary"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Documents
        </button>
        {patient && (
          <button
            onClick={() => setShowChartDocuments(true)}
            className="btn-secondary"
          >
            <LinkIcon className="h-4 w-4 mr-2" />
            Link Chart Documents
          </button>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadOptions && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  onClick={() => setShowUploadOptions(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Upload Documents
                  </h3>
                  
                  <div className="mt-4">
                    <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer rounded-md bg-white font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                            <span>Upload files</span>
                            <input
                              type="file"
                              className="sr-only"
                              multiple
                              accept="image/*,.pdf,.doc,.docx"
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, DOCX, JPG, PNG up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart Documents Modal */}
      {showChartDocuments && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  onClick={() => setShowChartDocuments(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Patient Chart Documents
                  </h3>
                  
                  <div className="mt-4">
                    <div className="divide-y divide-gray-200">
                      {patientChartDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="py-4 flex items-center justify-between hover:bg-gray-50"
                        >
                          <div className="flex items-center">
                            {isPDF(doc.type) ? (
                              <FileText className="h-5 w-5 text-gray-400" />
                            ) : isImage(doc.type) ? (
                              <ImageIcon className="h-5 w-5 text-gray-400" />
                            ) : (
                              <File className="h-5 w-5 text-gray-400" />
                            )}
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                              <p className="text-sm text-gray-500">
                                Added {new Date(doc.uploadDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleChartDocumentSelect(doc)}
                            className="ml-4 btn-secondary py-1"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Link
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Document List */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Documents</h4>
          <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow overflow-hidden">
            {referral.documents.map((doc) => (
              <li
                key={doc.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer ${
                  selectedDocument?.id === doc.id ? 'bg-primary/5 border-l-4 border-primary' : ''
                }`}
                onClick={() => setSelectedDocument(doc)}
              >
                <div className="flex items-center space-x-3">
                  {isImage(doc.type) ? (
                    <ImageIcon className="h-5 w-5 text-gray-400" />
                  ) : isPDF(doc.type) ? (
                    <FileText className="h-5 w-5 text-gray-400" />
                  ) : (
                    <File className="h-5 w-5 text-gray-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-500">{doc.type}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Preview Panel */}
        <div className="bg-white rounded-lg shadow-md p-4 h-[400px] overflow-hidden">
          {selectedDocument ? (
            <div className="h-full">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Document Preview</h4>
              <div className="h-[calc(100%-2rem)] overflow-hidden rounded-md bg-gray-50">
                {isImage(selectedDocument.type) ? (
                  <img
                    src={selectedDocument.url}
                    alt={selectedDocument.name}
                    className="h-full w-full object-contain"
                  />
                ) : isPDF(selectedDocument.type) ? (
                  <iframe
                    src={selectedDocument.url}
                    title={selectedDocument.name}
                    className="w-full h-full"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <File className="h-12 w-12 mx-auto mb-2" />
                      <p>Preview not available</p>
                      <p className="text-sm">File type: {selectedDocument.type}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <File className="h-12 w-12 mx-auto mb-2" />
                <p>Select a document to preview</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}