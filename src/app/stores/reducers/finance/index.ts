import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LOADING_STATUS, LoadingStatus } from "@constants/status";
import {
  Transaction,
  DebtRecord,
  MonthlySummary,
} from "@interfaces/finance";
import type { RootState } from "@stores/index";

export interface FinanceState {
  status: LoadingStatus;
  transactions: Transaction[];
  debts: DebtRecord[];
  summary: MonthlySummary;
  error: unknown;
}

const initialState: FinanceState = {
  status: LOADING_STATUS.IDLE,
  transactions: [],
  debts: [],
  summary: {
    month: "10/2026",
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    todayExpense: 0,
    yesterdayExpense: 0,
    dailyAverageExpense: 0,
    totalReceivable: 0,
    totalPayable: 0,
    currency: "VND",
  },
  error: null,
};

export const financeSlice = createSlice({
  name: "finance",
  initialState,
  reducers: {
    getFinanceDataAction: (state) => {
      state.status = LOADING_STATUS.LOADING;
    },
    getFinanceDataSuccess: (
      state,
      action: PayloadAction<{
        transactions: Transaction[];
        debts: DebtRecord[];
        summary: MonthlySummary;
      }>
    ) => {
      state.status = LOADING_STATUS.SUCCESS;
      state.transactions = action.payload.transactions;
      state.debts = action.payload.debts;
      state.summary = action.payload.summary;
    },
    getFinanceDataFailure: (state, action: PayloadAction<unknown>) => {
      state.status = LOADING_STATUS.ERROR;
      state.error = action.payload;
    },
    addTransactionAction: (state, _action: PayloadAction<Partial<Transaction>>) => {
      state.status = LOADING_STATUS.LOADING;
    },
    addTransactionSuccess: (state, action: PayloadAction<Transaction>) => {
      state.status = LOADING_STATUS.SUCCESS;
      state.transactions.unshift(action.payload);
      if (action.payload.type === "expense") {
        state.summary.totalExpense += action.payload.amount;
        if (action.payload.date === "2026-10-08") {
          state.summary.todayExpense += action.payload.amount;
        }
      } else {
        state.summary.totalIncome += action.payload.amount;
      }
      state.summary.balance =
        state.summary.totalIncome - state.summary.totalExpense;
    },
    deleteTransactionAction: (state, _action: PayloadAction<string>) => {
      state.status = LOADING_STATUS.LOADING;
    },
    deleteTransactionSuccess: (state, action: PayloadAction<string>) => {
      state.status = LOADING_STATUS.SUCCESS;
      const index = state.transactions.findIndex((t) => t.id === action.payload);
      if (index !== -1) {
        const removed = state.transactions[index];
        state.transactions.splice(index, 1);
        if (removed.type === "expense") {
          state.summary.totalExpense -= removed.amount;
          if (removed.date === "2026-10-08") {
            state.summary.todayExpense -= removed.amount;
          }
        } else {
          state.summary.totalIncome -= removed.amount;
        }
        state.summary.balance =
          state.summary.totalIncome - state.summary.totalExpense;
      }
    },
    addDebtAction: (state, _action: PayloadAction<Partial<DebtRecord>>) => {
      state.status = LOADING_STATUS.LOADING;
    },
    addDebtSuccess: (state, action: PayloadAction<DebtRecord>) => {
      state.status = LOADING_STATUS.SUCCESS;
      state.debts.unshift(action.payload);
      if (action.payload.type === "lend") {
        state.summary.totalReceivable += action.payload.remainAmount;
      } else {
        state.summary.totalPayable += action.payload.remainAmount;
      }
    },
    updateDebtAction: (
      state,
      _action: PayloadAction<{ id: string; status?: string; paidAmount?: number }>
    ) => {
      state.status = LOADING_STATUS.LOADING;
    },
    updateDebtSuccess: (state, action: PayloadAction<DebtRecord>) => {
      state.status = LOADING_STATUS.SUCCESS;
      const index = state.debts.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) {
        state.debts[index] = action.payload;
        // Recalculate totals
        state.summary.totalReceivable = state.debts
          .filter((d) => d.type === "lend" && d.status !== "paid")
          .reduce((sum, d) => sum + d.remainAmount, 0);
        state.summary.totalPayable = state.debts
          .filter((d) => d.type === "borrow" && d.status !== "paid")
          .reduce((sum, d) => sum + d.remainAmount, 0);
      }
    },
    deleteDebtAction: (state, _action: PayloadAction<string>) => {
      state.status = LOADING_STATUS.LOADING;
    },
    deleteDebtSuccess: (state, action: PayloadAction<string>) => {
      state.status = LOADING_STATUS.SUCCESS;
      const index = state.debts.findIndex((d) => d.id === action.payload);
      if (index !== -1) {
        state.debts.splice(index, 1);
        state.summary.totalReceivable = state.debts
          .filter((d) => d.type === "lend" && d.status !== "paid")
          .reduce((sum, d) => sum + d.remainAmount, 0);
        state.summary.totalPayable = state.debts
          .filter((d) => d.type === "borrow" && d.status !== "paid")
          .reduce((sum, d) => sum + d.remainAmount, 0);
      }
    },
  },
});

export const {
  getFinanceDataAction,
  getFinanceDataSuccess,
  getFinanceDataFailure,
  addTransactionAction,
  addTransactionSuccess,
  deleteTransactionAction,
  deleteTransactionSuccess,
  addDebtAction,
  addDebtSuccess,
  updateDebtAction,
  updateDebtSuccess,
  deleteDebtAction,
  deleteDebtSuccess,
} = financeSlice.actions;

export const financeSelector = (state: RootState) => state.finance;

export default financeSlice.reducer;
