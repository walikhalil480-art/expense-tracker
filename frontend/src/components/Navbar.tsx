import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm z-10 border-b border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center py-4 px-6">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white md:hidden">ExpenseTracker</h2>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 dark:text-gray-300">Hello, {user?.name || user?.email}</span>
          <button 
            onClick={handleLogout}
            className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
