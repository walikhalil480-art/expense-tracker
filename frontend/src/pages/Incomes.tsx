import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { fetchIncomesStart, fetchIncomesSuccess, fetchIncomesFailure, addIncome, deleteIncomeAction } from '../store/slices/incomeSlice';
import { fetchCategoriesStart, fetchCategoriesSuccess, fetchCategoriesFailure } from '../store/slices/categorySlice';
import api from '../services/api';
import { RootState } from '../store';

const incomeSchema = z.object({
  amount: z.number().positive(),
  source: z.string().min(1),
  categoryId: z.string().uuid().optional().or(z.literal('')),
  date: z.string().min(1),
});

type IncomeFormValues = z.infer<typeof incomeSchema>;

const Incomes: React.FC = () => {
  const dispatch = useDispatch();
  const { incomes, isLoading } = useSelector((state: RootState) => state.incomes);
  const { categories } = useSelector((state: RootState) => state.categories);
  const [showModal, setShowModal] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<IncomeFormValues>({
    resolver: zodResolver(incomeSchema),
    defaultValues: { date: new Date().toISOString().split('T')[0] }
  });

  useEffect(() => {
    const loadData = async () => {
      dispatch(fetchIncomesStart());
      dispatch(fetchCategoriesStart());
      try {
        const [incRes, catRes] = await Promise.all([
          api.get('/incomes'),
          api.get('/categories')
        ]);
        dispatch(fetchIncomesSuccess(incRes.data.data));
        dispatch(fetchCategoriesSuccess(catRes.data.data.categories));
      } catch (err: any) {
        dispatch(fetchIncomesFailure(err.message));
        dispatch(fetchCategoriesFailure(err.message));
      }
    };
    loadData();
  }, [dispatch]);

  const onSubmit = async (data: IncomeFormValues) => {
    try {
      const payload: any = { ...data, date: new Date(data.date).toISOString() };
      if (!payload.categoryId) delete payload.categoryId;
      const res = await api.post('/incomes', payload);
      dispatch(addIncome(res.data.data.income));
      setShowModal(false);
      reset();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      try {
        await api.delete(`/incomes/${id}`);
        dispatch(deleteIncomeAction(id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Incomes</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          + Add Income
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Source</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">Loading...</td></tr>
            ) : incomes.map((income) => (
              <tr key={income.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{new Date(income.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{income.source}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-teal-600 dark:text-teal-400 font-medium">
                  ${Number(income.amount).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleDelete(income.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Delete</button>
                </td>
              </tr>
            ))}
            {!isLoading && incomes.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No incomes found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Add Income</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                <input type="number" step="0.01" {...register('amount', { valueAsNumber: true })} className="mt-1 block w-full border border-gray-300 rounded-md p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                {errors.amount && <p className="text-red-500 text-xs">{errors.amount.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Source (Description)</label>
                <input type="text" {...register('source')} className="mt-1 block w-full border border-gray-300 rounded-md p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                {errors.source && <p className="text-red-500 text-xs">{errors.source.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category (Optional)</label>
                <select {...register('categoryId')} className="mt-1 block w-full border border-gray-300 rounded-md p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">None</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {errors.categoryId && <p className="text-red-500 text-xs">{errors.categoryId.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                <input type="date" {...register('date')} className="mt-1 block w-full border border-gray-300 rounded-md p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md dark:text-gray-300 dark:hover:bg-gray-700">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Incomes;
