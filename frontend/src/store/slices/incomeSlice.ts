import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Income {
  id: string;
  amount: number;
  source: string;
  date: string;
  categoryId?: string;
}

interface IncomeState {
  incomes: Income[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: IncomeState = {
  incomes: [],
  total: 0,
  page: 1,
  limit: 10,
  isLoading: false,
  error: null,
};

const incomeSlice = createSlice({
  name: 'incomes',
  initialState,
  reducers: {
    fetchIncomesStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchIncomesSuccess(state, action: PayloadAction<{ incomes: Income[], total: number, page: number, limit: number }>) {
      state.isLoading = false;
      state.incomes = action.payload.incomes;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.error = null;
    },
    fetchIncomesFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    addIncome(state, action: PayloadAction<Income>) {
      state.incomes.unshift(action.payload);
      state.total += 1;
    },
    updateIncomeAction(state, action: PayloadAction<Income>) {
      const index = state.incomes.findIndex(i => i.id === action.payload.id);
      if (index !== -1) {
        state.incomes[index] = action.payload;
      }
    },
    deleteIncomeAction(state, action: PayloadAction<string>) {
      state.incomes = state.incomes.filter(i => i.id !== action.payload);
      state.total -= 1;
    }
  },
});

export const { fetchIncomesStart, fetchIncomesSuccess, fetchIncomesFailure, addIncome, updateIncomeAction, deleteIncomeAction } = incomeSlice.actions;
export default incomeSlice.reducer;
