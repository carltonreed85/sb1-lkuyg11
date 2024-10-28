import React, { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, Download, Calendar, Filter, ArrowUp, ArrowDown, Table } from 'lucide-react';
import { useReferrals } from '../contexts/ReferralContext';
import { format, subDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import * as XLSX from 'xlsx';

const periods = [
  { label: 'Last 7 Days', days: 7 },
  { label: 'Last 30 Days', days: 30 },
  { label: 'Last 90 Days', days: 90 }
];

const metrics = [
  { label: 'Total Volume', value: 'total' },
  { label: 'By Status', value: 'status' },
  { label: 'By Priority', value: 'priority' },
  { label: 'By Medical Service', value: 'service' },
  { label: 'By Provider', value: 'provider' },
  { label: 'By Location', value: 'location' }
];

const fieldGroups = {
  patient: ['name', 'dateOfBirth', 'mrn'],
  details: ['location', 'provider', 'medicalService', 'priority', 'reason'],
  status: ['status', 'date', 'completionDate'],
  documents: ['count']
};

export default function Reports() {
  const { referrals } = useReferrals();
  const [selectedPeriod, setSelectedPeriod] = useState<number>(30);
  const [selectedMetric, setSelectedMetric] = useState<string>('total');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [showFieldSelector, setShowFieldSelector] = useState(false);

  // Calculate date range
  const endDate = useMemo(() => endOfDay(new Date()), []);
  const startDate = useMemo(() => startOfDay(subDays(endDate, selectedPeriod)), [selectedPeriod, endDate]);

  // Filter referrals within selected date range
  const filteredReferrals = useMemo(() => {
    return referrals.filter(referral => 
      isWithinInterval(new Date(referral.date), { start: startDate, end: endDate })
    );
  }, [referrals, startDate, endDate]);

  // Calculate analytics based on selected metric
  const analytics = useMemo(() => {
    const data: Record<string, number> = {};
    
    switch (selectedMetric) {
      case 'status':
        filteredReferrals.forEach(referral => {
          const status = referral.status.replace('_', ' ');
          data[status] = (data[status] || 0) + 1;
        });
        break;
      case 'priority':
        filteredReferrals.forEach(referral => {
          const priority = referral.details.priority;
          data[priority] = (data[priority] || 0) + 1;
        });
        break;
      case 'service':
        filteredReferrals.forEach(referral => {
          const service = referral.details.medicalService;
          data[service] = (data[service] || 0) + 1;
        });
        break;
      case 'provider':
        filteredReferrals.forEach(referral => {
          const provider = referral.details.provider;
          data[provider] = (data[provider] || 0) + 1;
        });
        break;
      case 'location':
        filteredReferrals.forEach(referral => {
          const location = referral.details.location;
          data[location] = (data[location] || 0) + 1;
        });
        break;
      default:
        // Daily volume for total referrals
        for (let i = 0; i < selectedPeriod; i++) {
          const date = format(subDays(endDate, i), 'yyyy-MM-dd');
          data[date] = 0;
        }
        filteredReferrals.forEach(referral => {
          const date = format(new Date(referral.date), 'yyyy-MM-dd');
          if (data[date] !== undefined) {
            data[date]++;
          }
        });
    }
    
    return data;
  }, [selectedMetric, filteredReferrals, selectedPeriod, endDate]);

  // Calculate trends
  const trends = useMemo(() => {
    const previousPeriodStart = startOfDay(subDays(startDate, selectedPeriod));
    const previousReferrals = referrals.filter(referral =>
      isWithinInterval(new Date(referral.date), { 
        start: previousPeriodStart,
        end: startDate
      })
    );

    return {
      total: {
        current: filteredReferrals.length,
        previous: previousReferrals.length,
        change: ((filteredReferrals.length - previousReferrals.length) / (previousReferrals.length || 1)) * 100
      },
      completed: {
        current: filteredReferrals.filter(r => r.status === 'completed').length,
        previous: previousReferrals.filter(r => r.status === 'completed').length,
        change: ((filteredReferrals.filter(r => r.status === 'completed').length - 
                 previousReferrals.filter(r => r.status === 'completed').length) / 
                (previousReferrals.filter(r => r.status === 'completed').length || 1)) * 100
      }
    };
  }, [referrals, filteredReferrals, selectedPeriod, startDate]);

  const handleExport = () => {
    // Prepare data for export
    const exportData = filteredReferrals.map(referral => {
      const row: any = {};

      if (selectedFields.length === 0) {
        // Export all fields if none selected
        row['Case ID'] = referral.caseId;
        row['Patient Name'] = referral.patient.name;
        row['Patient DOB'] = format(new Date(referral.patient.dateOfBirth), 'MM/dd/yyyy');
        row['MRN'] = referral.patient.mrn;
        row['Status'] = referral.status;
        row['Priority'] = referral.details.priority;
        row['Provider'] = referral.details.provider;
        row['Medical Service'] = referral.details.medicalService;
        row['Location'] = referral.details.location;
        row['Reason'] = referral.details.reason;
        row['Created Date'] = format(new Date(referral.date), 'MM/dd/yyyy');
        row['Documents'] = referral.documents.length;
      } else {
        // Export only selected fields
        selectedFields.forEach(field => {
          if (field === 'name') row['Patient Name'] = referral.patient.name;
          if (field === 'dateOfBirth') row['Patient DOB'] = format(new Date(referral.patient.dateOfBirth), 'MM/dd/yyyy');
          if (field === 'mrn') row['MRN'] = referral.patient.mrn;
          if (field === 'status') row['Status'] = referral.status;
          if (field === 'priority') row['Priority'] = referral.details.priority;
          if (field === 'provider') row['Provider'] = referral.details.provider;
          if (field === 'medicalService') row['Medical Service'] = referral.details.medicalService;
          if (field === 'location') row['Location'] = referral.details.location;
          if (field === 'reason') row['Reason'] = referral.details.reason;
          if (field === 'date') row['Created Date'] = format(new Date(referral.date), 'MM/dd/yyyy');
          if (field === 'documents') row['Documents'] = referral.documents.length;
        });
      }

      return row;
    });

    // Create workbook and add data
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, ws, 'Referrals');

    // Save file
    XLSX.writeFile(wb, `referrals_export_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  const toggleField = (field: string) => {
    setSelectedFields(prev => 
      prev.includes(field)
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  return (
    <div className="space-y-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Reports
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 gap-4">
          <div className="relative">
            <button
              onClick={() => setShowFieldSelector(!showFieldSelector)}
              className="btn-secondary"
            >
              <Table className="h-5 w-5 mr-2" />
              Select Fields
            </button>

            {showFieldSelector && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                <div className="p-4">
                  <div className="space-y-4">
                    {Object.entries(fieldGroups).map(([group, fields]) => (
                      <div key={group}>
                        <h4 className="text-sm font-medium text-gray-900 mb-2 capitalize">{group}</h4>
                        <div className="space-y-2">
                          {fields.map(field => (
                            <label key={field} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedFields.includes(field)}
                                onChange={() => toggleField(field)}
                                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                              />
                              <span className="ml-2 text-sm text-gray-600 capitalize">
                                {field.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <button onClick={handleExport} className="btn-primary">
            <Download className="h-5 w-5 mr-2" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Analytics Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-400" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(Number(e.target.value))}
            className="block rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            {periods.map((period) => (
              <option key={period.days} value={period.days}>
                {period.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="block rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            {metrics.map((metric) => (
              <option key={metric.value} value={metric.value}>
                {metric.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Referrals</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {trends.total.current}
                    </div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      trends.total.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {trends.total.change >= 0 ? (
                        <ArrowUp className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDown className="h-4 w-4 mr-1" />
                      )}
                      {Math.abs(trends.total.change).toFixed(1)}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completion Rate</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {((trends.completed.current / trends.total.current) * 100).toFixed(1)}%
                    </div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      trends.completed.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {trends.completed.change >= 0 ? (
                        <ArrowUp className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDown className="h-4 w-4 mr-1" />
                      )}
                      {Math.abs(trends.completed.change).toFixed(1)}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Graph */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Analytics</h3>
        <div className="h-64">
          <div className="h-full flex items-end">
            {Object.entries(analytics).map(([label, value], index) => (
              <div
                key={index}
                className="flex-1 mx-1 group relative"
              >
                <div
                  className="absolute bottom-0 w-full bg-primary hover:bg-primary-dark transition-colors rounded-t"
                  style={{ 
                    height: `${(value / Math.max(...Object.values(analytics))) * 100}%` 
                  }}
                >
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                    <div>{selectedMetric === 'total' ? format(new Date(label), 'MMM d, yyyy') : label}</div>
                    <div>{value} referrals</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* X-axis labels */}
        <div className="mt-4 flex justify-between text-xs text-gray-500">
          {Object.keys(analytics).map((label, index) => (
            <div key={index} className="flex-1 text-center truncate px-1">
              {selectedMetric === 'total' 
                ? format(new Date(label), 'MMM d')
                : label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}