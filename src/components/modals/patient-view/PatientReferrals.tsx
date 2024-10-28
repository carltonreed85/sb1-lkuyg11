import React, { useState } from 'react';
import { Share2, Clock, CheckCircle, ChevronRight } from 'lucide-react';
import { Patient } from '../../../types';
import { useReferrals } from '../../../contexts/ReferralContext';
import { format } from 'date-fns';
import ReferralViewModal from '../ReferralViewModal';

interface PatientReferralsProps {
  patient: Patient;
}

export default function PatientReferrals({ patient }: PatientReferralsProps) {
  const { referrals } = useReferrals();
  const [selectedReferral, setSelectedReferral] = useState(null);

  // Filter referrals for this patient
  const patientReferrals = referrals.filter(ref => ref.patient.id === patient.id);

  // Separate referrals by status
  const activeReferrals = patientReferrals.filter(ref => 
    ['new', 'in_progress', 'pending_authorization'].includes(ref.status)
  );
  const pendingReferrals = patientReferrals.filter(ref => 
    ['scheduled', 'on_hold'].includes(ref.status)
  );
  const completedReferrals = patientReferrals.filter(ref => 
    ['completed', 'closed'].includes(ref.status)
  );

  const ReferralCard = ({ referral }) => (
    <div 
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => setSelectedReferral(referral)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-sm font-medium text-gray-900">
            {referral.details.specialty}
          </h4>
          <p className="text-sm text-gray-500 mt-1">
            To: {referral.details.provider}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
              referral.status === 'completed' ? 'bg-green-100 text-green-800' :
              referral.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {referral.status.replace('_', ' ').toUpperCase()}
            </span>
            <span className="text-xs text-gray-500">
              {format(new Date(referral.date), 'MMM d, yyyy')}
            </span>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  );

  const ReferralSection = ({ title, icon: Icon, referrals, iconColor }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
      {referrals.length === 0 ? (
        <p className="text-sm text-gray-500">No {title.toLowerCase()}</p>
      ) : (
        <div className="space-y-3">
          {referrals.map(referral => (
            <ReferralCard key={referral.id} referral={referral} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="space-y-6">
        <ReferralSection
          title="Active Referrals"
          icon={Share2}
          referrals={activeReferrals}
          iconColor="text-blue-500"
        />

        <ReferralSection
          title="Pending Referrals"
          icon={Clock}
          referrals={pendingReferrals}
          iconColor="text-yellow-500"
        />

        <ReferralSection
          title="Completed Referrals"
          icon={CheckCircle}
          referrals={completedReferrals}
          iconColor="text-green-500"
        />
      </div>

      {/* Referral View Modal */}
      {selectedReferral && (
        <ReferralViewModal
          referral={selectedReferral}
          isOpen={!!selectedReferral}
          onClose={() => setSelectedReferral(null)}
        />
      )}
    </>
  );
}