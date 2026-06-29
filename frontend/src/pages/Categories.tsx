import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { fetchCategoriesStart, fetchCategoriesSuccess, fetchCategoriesFailure, addCategory, deleteCategoryAction } from '../store/slices/categorySlice';
import api from '../services/api';
import { RootState } from '../store';

const categorySchema = z.object({
  name: z.string().min(1),
  color: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const Categories: React.FC = () => {
  const dispatch = useDispatch();
  const { categories, isLoading } = useSelector((state: RootState) => state.categories);
  const [showModal, setShowModal] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { color: '#000000' }
  });

  useEffect(() => {
    const loadData = async () => {
      dispatch(fetchCategoriesStart());
      try {
        const res = await api.get('/categories');
        dispatch(fetchCategoriesSuccess(res.data.data.categories));
      } catch (err: any) {
        dispatch(fetchCategoriesFailure(err.message));
      }
    };
    loadData();
  }, [dispatch]);

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      const res = await api.post('/categories', data);
      dispatch(addCategory(res.data.data.category));
      setShowModal(false);
      reset();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure? This might affect existing transactions.')) {
      try {
        await api.delete(`/categories/${id}`);
        dispatch(deleteCategoryAction(id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Categories</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          + Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center text-gray-500">Loading...</div>
        ) : categories.map((category) => (
          <div key={category.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: category.color || '#cccccc' }}></div>
              <span className="font-medium text-gray-800 dark:text-white">{category.name}</span>
            </div>
            <button onClick={() => handleDelete(category.id)} className="text-red-500 hover:text-red-700">Delete</button>
          </div>
        ))}
        {!isLoading && categories.length === 0 && (
          <div className="col-span-full text-center text-gray-500">No categories found.</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Add Category</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input type="text" {...register('name')} className="mt-1 block w-full border border-gray-300 rounded-md p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
                <input type="color" {...register('color')} className="mt-1 block w-full h-10 p-1 border border-gray-300 rounded-md" />
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

export default Categories;
