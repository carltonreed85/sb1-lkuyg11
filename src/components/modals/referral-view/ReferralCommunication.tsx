import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { format } from 'date-fns';
import { Referral } from '../../../contexts/ReferralContext';

interface ReferralCommunicationProps {
  referral: Referral;
}

export default function ReferralCommunication({ referral }: ReferralCommunicationProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'Dr. Sarah Johnson',
      content: 'Initial referral created and sent to specialist.',
      timestamp: new Date().toISOString(),
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Math.random().toString(),
      sender: 'Dr. Sarah Johnson',
      content: message,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  return (
    <div className="h-[400px] flex flex-col">
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto mb-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-start">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">{msg.sender}</h4>
                    <span className="text-xs text-gray-500">
                      {format(new Date(msg.timestamp), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm"
        />
        <button
          type="submit"
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}