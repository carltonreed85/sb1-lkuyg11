import React from 'react';
import { FileText, Clock, CheckCircle, AlertCircle, Plus, AlertTriangle } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import RecentReferrals from '../components/dashboard/RecentReferrals';
import NewReferralModal from '../components/modals/NewReferralModal';
import { useAuth } from '../contexts/AuthContext';
import { useReferrals } from '../contexts/ReferralContext';
import { subDays, differenceInDays } from 'date-fns';
import VolumeGraph from '../components/dashboard/VolumeGraph';

export default function Dashboard() {
  const { user } = useAuth();
  const { referrals } = useReferrals();
  const [isNewReferralModalOpen, setIsNewReferralModalOpen] = React.useState(false);

  // Calculate metrics for the current period (last 30 days)
  const currentDate = new Date();
  const thirtyDaysAgo = subDays(currentDate, 30);
  const sixtyDaysAgo = subDays(currentDate, 60);

  // Calculate stale referrals (older than 45 days)
  const staleReferrals = referrals.filter(referral => {
    const daysDifference = differenceInDays(new Date(), new Date(referral.date));
    return daysDifference > 45 && referral.status !== 'completed';
  });

  // Current period metrics
  const currentPeriodReferrals = referrals.filter(ref => 
    new Date(ref.date) >= thirtyDaysAgo && new Date(ref.date) <= currentDate
  );

  // Previous period metrics (30-60 days ago)
  const previousPeriodReferrals = referrals.filter(ref =>
    new Date(ref.date) >= sixtyDaysAgo && new Date(ref.date) < thirtyDaysAgo
  );

  // Calculate metrics
  const metrics = {
    total: {
      current: currentPeriodReferrals.length,
      previous: previousPeriodReferrals.length,
      trend: previousPeriodReferrals.length ? 
        ((currentPeriodReferrals.length - previousPeriodReferrals.length) / previousPeriodReferrals.length) * 100 : 0
    },
    urgent: {
      current: currentPeriodReferrals.filter(ref => ref.details.priority === 'urgent').length,
      previous: previousPeriodReferrals.filter(ref => ref.details.priority === 'urgent').length,
      trend: previousPeriodReferrals.filter(ref => ref.details.priority === 'urgent').length ?
        ((currentPeriodReferrals.filter(ref => ref.details.priority === 'urgent').length - 
          previousPeriodReferrals.filter(ref => ref.details.priority === 'urgent').length) / 
          previousPeriodReferrals.filter(ref => ref.details.priority === 'urgent').length) * 100 : 0
    },
    pending: {
      value: referrals.filter(ref => ['new', 'in_progress', 'pending_authorization'].includes(ref.status)).length
    },
    completed: {
      current: currentPeriodReferrals.filter(ref => ref.status === 'completed').length,
      previous: previousPeriodReferrals.filter(ref => ref.status === 'completed').length,
      trend: previousPeriodReferrals.filter(ref => ref.status === 'completed').length ?
        ((currentPeriodReferrals.filter(ref => ref.status === 'completed').length - 
          previousPeriodReferrals.filter(ref => ref.status === 'completed').length) / 
          previousPeriodReferrals.filter(ref => ref.status === 'completed').length) * 100 : 0
    }
  };

  const stats = [
    { 
      title: 'Total Referrals', 
      value: metrics.total.current, 
      icon: FileText, 
      trend: { 
        value: Math.round(metrics.total.trend), 
        isPositive: metrics.total.trend >= 0 
      } 
    },
    { 
      title: 'Urgent Referrals', 
      value: metrics.urgent.current, 
      icon: AlertCircle, 
      trend: { 
        value: Math.round(metrics.urgent.trend), 
        isPositive: metrics.urgent.trend >= 0 
      } 
    },
    { 
      title: 'Pending Reviews', 
      value: metrics.pending.value, 
      icon: Clock 
    },
    { 
      title: 'Completed Today', 
      value: metrics.completed.current, 
      icon: CheckCircle, 
      trend: { 
        value: Math.round(metrics.completed.trend), 
        isPositive: metrics.completed.trend >= 0 
      } 
    },
  ];

  return (
    <>
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Dashboard
            </h2>
            {user && (
              <span className="text-lg text-gray-600">
                Welcome back, <span className="font-semibold text-primary">{user.name}</span>
              </span>
            )}
          </div>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button 
            className="btn-primary inline-flex items-center"
            onClick={() => setIsNewReferralModalOpen(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            New Referral
          </button>
        </div>
      </div>

      {/* Stale Referrals Alert */}
      {staleReferrals.length > 0 && (
        <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
            <div>
              <p className="text-sm text-yellow-700">
                <span className="font-medium">Attention needed:</span>{' '}
                {staleReferrals.length} referral{staleReferrals.length === 1 ? ' is' : 's are'} older than 45 days and may require follow-up.{' '}
                <button 
                  onClick={() => navigate('/referrals')} 
                  className="font-medium text-yellow-700 underline hover:text-yellow-600"
                >
                  View all
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="mt-8">
        <VolumeGraph />
      </div>

      <div className="mt-8">
        <RecentReferrals />
      </div>

      <NewReferralModal
        isOpen={isNewReferralModalOpen}
        onClose={() => setIsNewReferralModalOpen(false)}
      />
    </>
  );
}