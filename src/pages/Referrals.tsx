import React, { useState } from 'react';
import { Plus, Search, Filter, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import NewReferralModal from '../components/modals/NewReferralModal';
import ReferralViewModal from '../components/modals/ReferralViewModal';
import { useReferrals } from '../contexts/ReferralContext';
import { useSettings } from '../contexts/SettingsContext';
import type { Referral } from '../contexts/ReferralContext';

const STATUS_FILTERS = [
  { id: 'all', label: 'All Referrals' },
  { id: 'new', label: 'New' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
  { id: 'on_hold', label: 'On Hold' },
  { id: 'cancelled', label: 'Cancelled' }
];

const PRIORITY_FILTERS = [
  { id: 'all', label: 'All Priorities' },
  { id: 'urgent', label: 'Urgent' },
  { id: 'high', label: 'High' },
  { id: 'medium', label: 'Medium' },
  { id: 'low', label: 'Low' }
];

export default function Referrals() {
  const [isNewReferralModalOpen, setIsNewReferralModalOpen] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const { referrals } = useReferrals();
  const { settings } = useSettings();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'in_progress':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-yellow-50 text-yellow-800 ring-yellow-600/20';
      case 'in_progress':
        return 'bg-blue-50 text-blue-800 ring-blue-600/20';
      case 'completed':
        return 'bg-green-50 text-green-800 ring-green-600/20';
      case 'on_hold':
        return 'bg-orange-50 text-orange-800 ring-orange-600/20';
      case 'cancelled':
        return 'bg-red-50 text-red-800 ring-red-600/20';
      default:
        return 'bg-gray-50 text-gray-800 ring-gray-600/20';
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-50 text-red-700 ring-red-600/20';
      case 'high':
        return 'bg-orange-50 text-orange-700 ring-orange-600/20';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 ring-yellow-600/20';
      case 'low':
        return 'bg-green-50 text-green-700 ring-green-600/20';
      default:
        return 'bg-gray-50 text-gray-700 ring-gray-600/20';
    }
  };

  const filteredReferrals = referrals.filter(referral => {
    const matchesSearch = 
      referral.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referral.details.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referral.details.specialty.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || referral.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || referral.details.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Referrals</h1>
          <p className="mt-2 text-sm text-gray-700">
            Track and manage patient referrals across all stages of the referral process.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button 
            className="btn-primary"
            onClick={() => setIsNewReferralModalOpen(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            New Referral
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Search referrals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status Filters */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
                <div className="space-y-2">
                  {STATUS_FILTERS.map(filter => (
                    <label key={filter.id} className="flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value={filter.id}
                        checked={statusFilter === filter.id}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <span className="ml-2 text-sm text-gray-700">{filter.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Priority Filters */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Priority</h3>
                <div className="space-y-2">
                  {PRIORITY_FILTERS.map(filter => (
                    <label key={filter.id} className="flex items-center">
                      <input
                        type="radio"
                        name="priority"
                        value={filter.id}
                        checked={priorityFilter === filter.id}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <span className="ml-2 text-sm text-gray-700">{filter.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Referrals Table */}
        <div className="mt-8 flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Patient & Provider
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status & Priority
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Details
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Dates
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredReferrals.map((referral) => (
                      <tr 
                        key={referral.id}
                        className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                        onClick={() => setSelectedReferral(referral)}
                      >
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-primary font-medium">
                                {referral.patient.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{referral.patient.name}</div>
                              <div className="text-sm text-gray-500">
                                To: {referral.details.provider}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(referral.status)}
                              <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ring-1 ring-inset ${getStatusStyle(referral.status)}`}>
                                {referral.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                              </span>
                            </div>
                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ring-1 ring-inset ${getPriorityStyle(referral.details.priority)}`}>
                              {referral.details.priority.charAt(0).toUpperCase() + referral.details.priority.slice(1)} Priority
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-4">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">{referral.details.specialty}</div>
                            <div className="text-gray-500 line-clamp-1">{referral.details.reason}</div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div>Created: {format(new Date(referral.date), 'MMM d, yyyy')}</div>
                          {referral.completionDate && (
                            <div>Completed: {format(new Date(referral.completionDate), 'MMM d, yyyy')}</div>
                          )}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedReferral(referral);
                            }}
                            className="text-primary hover:text-primary-dark"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NewReferralModal
        isOpen={isNewReferralModalOpen}
        onClose={() => setIsNewReferralModalOpen(false)}
      />

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