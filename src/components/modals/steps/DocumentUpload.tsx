import React, { useState } from 'react';
import { Upload, X, File, Image as ImageIcon, FileText } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface DocumentUploadProps {
  onBack: () => void;
  onNext: (documents: Document[]) => void;
}

export default function DocumentUpload({ onBack, onNext }: DocumentUploadProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        id: Math.random().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      }));
      setDocuments([...documents, ...newFiles]);
    }
  };

  const removeDocument = (id: string) => {
    setDocuments((prevDocs) => {
      const docToRemove = prevDocs.find((doc) => doc.id === id);
      if (docToRemove) {
        URL.revokeObjectURL(docToRemove.url);
      }
      return prevDocs.filter((doc) => doc.id !== id);
    });
    if (selectedDocument?.id === id) {
      setSelectedDocument(null);
    }
  };

  const handleNext = () => {
    onNext(documents);
  };

  const isImage = (type: string) => type.startsWith('image/');
  const isPDF = (type: string) => type === 'application/pdf';

  return (
    <div className="space-y-6">
      {/* Upload Area */}
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

      {/* Document List and Preview */}
      {documents.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Document List */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Uploaded Documents</h4>
            <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow overflow-hidden">
              {documents.map((doc) => (
                <li
                  key={doc.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${
                    selectedDocument?.id === doc.id ? 'bg-primary/5 border-l-4 border-primary' : ''
                  }`}
                  onClick={() => setSelectedDocument(doc)}
                >
                  <div className="flex justify-between items-center">
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
                        <p className="text-xs text-gray-500">
                          {(doc.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeDocument(doc.id);
                      }}
                      className="ml-4 text-sm font-medium text-red-600 hover:text-red-500 p-1 rounded-full hover:bg-red-50"
                    >
                      <X className="h-5 w-5" />
                    </button>
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
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="btn-secondary"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="btn-primary"
        >
          Next
        </button>
      </div>
    </div>
  );
}