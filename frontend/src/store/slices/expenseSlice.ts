import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  categoryId?: string;
  category?: { id: string; name: string; color: string };
}

interface ExpenseState {
  expenses: Expense[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: ExpenseState = {
  expenses: [],
  total: 0,
  page: 1,
  limit: 10,
  isLoading: false,
  error: null,
};

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    fetchExpensesStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchExpensesSuccess(state, action: PayloadAction<{ expenses: Expense[], total: number, page: number, limit: number }>) {
      state.isLoading = false;
      state.expenses = action.payload.expenses;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.error = null;
    },
    fetchExpensesFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    addExpense(state, action: PayloadAction<Expense>) {
      state.expenses.unshift(action.payload);
      state.total += 1;
    },
    updateExpenseAction(state, action: PayloadAction<Expense>) {
      const index = state.expenses.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.expenses[index] = action.payload;
      }
    },
    deleteExpenseAction(state, action: PayloadAction<string>) {
      state.expenses = state.expenses.filter(e => e.id !== action.payload);
      state.total -= 1;
    }
  },
});

export const { fetchExpensesStart, fetchExpensesSuccess, fetchExpensesFailure, addExpense, updateExpenseAction, deleteExpenseAction } = expenseSlice.actions;
export default expenseSlice.reducer;
