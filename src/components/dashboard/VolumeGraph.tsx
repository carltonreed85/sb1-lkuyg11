import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useReferrals } from '../../contexts/ReferralContext';
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';

interface VolumeData {
  name: string;
  total: number;
  completed: number;
  pending: number;
}

export default function VolumeGraph() {
  const { referrals } = useReferrals();
  const [data, setData] = useState<VolumeData[]>([]);
  const [timeframe, setTimeframe] = useState<'6months' | '12months'>('6months');
  const [filterStatus, setFilterStatus] = useState<string[]>(['all']);

  useEffect(() => {
    const endDate = new Date();
    const startDate = subMonths(endDate, timeframe === '6months' ? 6 : 12);
    const months = eachMonthOfInterval({ start: startDate, end: endDate });

    const volumeData = months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthReferrals = referrals.filter(referral => {
        const referralDate = new Date(referral.date);
        return referralDate >= monthStart && referralDate <= monthEnd;
      });

      return {
        name: format(month, 'MMM yyyy'),
        total: monthReferrals.length,
        completed: monthReferrals.filter(r => r.status === 'completed').length,
        pending: monthReferrals.filter(r => ['new', 'in_progress', 'pending_authorization'].includes(r.status)).length,
      };
    });

    setData(volumeData);
  }, [referrals, timeframe]);

  const filteredData = data.map(item => {
    const filtered: any = { name: item.name };
    if (filterStatus.includes('all') || filterStatus.includes('total')) filtered.total = item.total;
    if (filterStatus.includes('all') || filterStatus.includes('completed')) filtered.completed = item.completed;
    if (filterStatus.includes('all') || filterStatus.includes('pending')) filtered.pending = item.pending;
    return filtered;
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Referral Volume</h3>
        <div className="flex gap-4">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as '6months' | '12months')}
            className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
          </select>
          <select
            multiple
            value={filterStatus}
            onChange={(e) => setFilterStatus(Array.from(e.target.selectedOptions, option => option.value))}
            className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          >
            <option value="all">All</option>
            <option value="total">Total</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#2D7A89" name="Total Referrals" />
            <Bar dataKey="completed" fill="#4CAF50" name="Completed" />
            <Bar dataKey="pending" fill="#FFA726" name="Pending" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}