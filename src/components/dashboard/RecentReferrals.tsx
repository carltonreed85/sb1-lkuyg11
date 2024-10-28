import React, { useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useReferrals } from '../../contexts/ReferralContext';
import ReferralViewModal from '../modals/ReferralViewModal';

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'new':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'new':
        return <Clock className="w-4 h-4" />;
      case 'in_progress':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {getStatusIcon(status)}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function RecentReferrals() {
  const navigate = useNavigate();
  const { referrals, getRecentReferrals } = useReferrals();
  const [selectedReferral, setSelectedReferral] = useState(null);
  const recentReferrals = getRecentReferrals(10);

  const handleClick = (referral) => {
    setSelectedReferral(referral);
  };

  return (
    <div className="space-y-4">
      {/* Recent Referrals List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Referrals</h2>
        {!recentReferrals || recentReferrals.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent referrals found</p>
        ) : (
          <div className="divide-y divide-gray-200">
            {recentReferrals.map((referral) => (
              <div
                key={referral.id}
                className="py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleClick(referral)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {referral.patient?.name || 'Unknown Patient'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {referral.details?.specialty || 'No specialty specified'} - {referral.details?.provider || 'No provider specified'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={referral.status} />
                  <p className="text-sm text-gray-500">
                    {referral.date ? format(new Date(referral.date), 'MMM d, yyyy') : 'No date'}
                  </p>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Referral View Modal */}
      {selectedReferral && (
        <ReferralViewModal
          referral={selectedReferral}
          isOpen={!!selectedReferral}
          onClose={() => setSelectedReferral(null)}
        />
      )}
    </div>
  );
}