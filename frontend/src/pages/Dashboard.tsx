import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../services/api';

interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  remainingBalance: number;
  expensesByCategory: Array<{ category: string; amount: number; color: string }>;
  recentTransactions: Array<{ id: string; amount: number; date: string; type: string; category?: { name: string } }>;
}

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/dashboard/summary');
        setSummary(res.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <div className="text-gray-800 dark:text-white">Loading dashboard...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!summary) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Income</h3>
          <p className="text-3xl font-bold text-teal-600 dark:text-teal-400 mt-2">${summary.totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Expense</h3>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">${summary.totalExpense.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Remaining Balance</h3>
          <p className={`text-3xl font-bold mt-2 ${summary.remainingBalance >= 0 ? 'text-teal-600 dark:text-teal-400' : 'text-red-600 dark:text-red-400'}`}>
            ${summary.remainingBalance.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses by Category Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Expenses by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={summary.expensesByCategory}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {summary.expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#cccccc'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {summary.recentTransactions.map((tx) => (
              <div key={tx.id} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${tx.type === 'INCOME' ? 'bg-teal-500' : 'bg-red-500'}`}>
                    {tx.type === 'INCOME' ? '↓' : '↑'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">{tx.category?.name || 'Income'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className={`font-bold ${tx.type === 'INCOME' ? 'text-teal-600 dark:text-teal-400' : 'text-red-600 dark:text-red-400'}`}>
                  {tx.type === 'INCOME' ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                </div>
              </div>
            ))}
            {summary.recentTransactions.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No recent transactions found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
