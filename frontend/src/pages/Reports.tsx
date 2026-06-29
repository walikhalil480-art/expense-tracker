import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';

interface ReportData {
  month: string;
  income: number;
  expense: number;
}

const Reports: React.FC = () => {
  const [data, setData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const [expRes, incRes] = await Promise.all([
          api.get('/expenses?limit=1000'),
          api.get('/incomes?limit=1000')
        ]);
        
        const expenses = expRes.data.data.expenses;
        const incomes = incRes.data.data.incomes;

        const monthlyData: Record<string, { income: number; expense: number }> = {};
        
        for (let i = 5; i >= 0; i--) {
          const d = new Date();
          d.setMonth(d.getMonth() - i);
          const monthStr = d.toLocaleString('default', { month: 'short', year: 'numeric' });
          monthlyData[monthStr] = { income: 0, expense: 0 };
        }

        expenses.forEach((e: any) => {
          const d = new Date(e.date);
          const monthStr = d.toLocaleString('default', { month: 'short', year: 'numeric' });
          if (monthlyData[monthStr]) monthlyData[monthStr].expense += e.amount;
        });

        incomes.forEach((i: any) => {
          const d = new Date(i.date);
          const monthStr = d.toLocaleString('default', { month: 'short', year: 'numeric' });
          if (monthlyData[monthStr]) monthlyData[monthStr].income += i.amount;
        });

        const formattedData = Object.keys(monthlyData).map(month => ({
          month,
          income: monthlyData[month].income,
          expense: monthlyData[month].expense
        }));

        setData(formattedData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Financial Reports</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Income vs Expense (Last 6 Months)</h3>
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading report data...</div>
        ) : (
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" stroke="#8884d8" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', color: '#fff', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="income" name="Income" fill="#0d9488" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="#e11d48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
