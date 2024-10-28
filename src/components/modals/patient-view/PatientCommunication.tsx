import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { Patient } from '../../../types';

interface PatientCommunicationProps {
  patient: Patient;
}

export default function PatientCommunication({ patient }: PatientCommunicationProps) {
  const [message, setMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle message sending
    setMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Messages */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Communication History</h3>
        </div>
        <div className="h-96 flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4">
            <div className="prose prose-sm text-gray-500">
              <p>No messages available.</p>
            </div>
          </div>
          
          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="flex items-end gap-4">
            <div className="flex-1">
              <label htmlFor="message" className="sr-only">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}