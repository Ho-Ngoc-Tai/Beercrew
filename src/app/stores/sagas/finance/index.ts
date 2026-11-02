import { call, put, takeLatest, all } from "redux-saga/effects";
import { get, post } from "@commons/ajax/client";
import {
  NEXT_TRANSACTION_LIST_ENDPOINT,
  NEXT_TRANSACTION_CREATE_ENDPOINT,
  NEXT_TRANSACTION_DELETE_ENDPOINT,
  NEXT_DEBT_LIST_ENDPOINT,
  NEXT_DEBT_CREATE_ENDPOINT,
  NEXT_DEBT_UPDATE_ENDPOINT,
  NEXT_DEBT_DELETE_ENDPOINT,
  NEXT_FINANCE_SUMMARY_ENDPOINT,
} from "@routes/next.api";
import {
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
} from "@stores/reducers/finance";
import { ApiResponse } from "@interfaces/base";
import { Transaction, DebtRecord, MonthlySummary } from "@interfaces/finance";

function* callApiGetFinanceData(): Generator<any, void, any> {
  try {
    const [txRes, debtRes, sumRes]: [
      ApiResponse<{ items: Transaction[] }>,
      ApiResponse<{ items: DebtRecord[] }>,
      ApiResponse<MonthlySummary>
    ] = yield all([
      call(get, NEXT_TRANSACTION_LIST_ENDPOINT),
      call(get, NEXT_DEBT_LIST_ENDPOINT),
      call(get, NEXT_FINANCE_SUMMARY_ENDPOINT),
    ]);

    const transactions = txRes?.data?.items || [];
    const debts = debtRes?.data?.items || [];
    const summary = sumRes?.data || {
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
    };

    yield put(
      getFinanceDataSuccess({
        transactions,
        debts,
        summary,
      })
    );
  } catch (error: any) {
    yield put(getFinanceDataFailure(error?.message || "Lỗi tải dữ liệu tài chính"));
  }
}

function* callApiAddTransaction(
  action: ReturnType<typeof addTransactionAction>
): Generator<any, void, any> {
  try {
    const response: ApiResponse<Transaction> = yield call(
      post,
      NEXT_TRANSACTION_CREATE_ENDPOINT,
      action.payload
    );
    if (response?.code === 200 || response?.code === 201) {
      yield put(addTransactionSuccess(response.data));
    }
  } catch (error: any) {
    console.error("[FinanceSaga] Thêm giao dịch thất bại:", error);
  }
}

function* callApiDeleteTransaction(
  action: ReturnType<typeof deleteTransactionAction>
): Generator<any, void, any> {
  try {
    const response: ApiResponse<null> = yield call(
      post,
      NEXT_TRANSACTION_DELETE_ENDPOINT,
      { id: action.payload }
    );
    if (response?.code === 200) {
      yield put(deleteTransactionSuccess(action.payload));
    }
  } catch (error: any) {
    console.error("[FinanceSaga] Xóa giao dịch thất bại:", error);
  }
}

function* callApiAddDebt(
  action: ReturnType<typeof addDebtAction>
): Generator<any, void, any> {
  try {
    const response: ApiResponse<DebtRecord> = yield call(
      post,
      NEXT_DEBT_CREATE_ENDPOINT,
      action.payload
    );
    if (response?.code === 200 || response?.code === 201) {
      yield put(addDebtSuccess(response.data));
    }
  } catch (error: any) {
    console.error("[FinanceSaga] Thêm sổ nợ thất bại:", error);
  }
}

function* callApiUpdateDebt(
  action: ReturnType<typeof updateDebtAction>
): Generator<any, void, any> {
  try {
    const response: ApiResponse<DebtRecord> = yield call(
      post,
      NEXT_DEBT_UPDATE_ENDPOINT,
      action.payload
    );
    if (response?.code === 200 && response.data) {
      yield put(updateDebtSuccess(response.data));
    }
  } catch (error: any) {
    console.error("[FinanceSaga] Cập nhật sổ nợ thất bại:", error);
  }
}

function* callApiDeleteDebt(
  action: ReturnType<typeof deleteDebtAction>
): Generator<any, void, any> {
  try {
    const response: ApiResponse<null> = yield call(
      post,
      NEXT_DEBT_DELETE_ENDPOINT,
      { id: action.payload }
    );
    if (response?.code === 200) {
      yield put(deleteDebtSuccess(action.payload));
    }
  } catch (error: any) {
    console.error("[FinanceSaga] Xóa khoản nợ thất bại:", error);
  }
}

export default function* financeSaga() {
  yield all([
    takeLatest(getFinanceDataAction.type, callApiGetFinanceData),
    takeLatest(addTransactionAction.type, callApiAddTransaction),
    takeLatest(deleteTransactionAction.type, callApiDeleteTransaction),
    takeLatest(addDebtAction.type, callApiAddDebt),
    takeLatest(updateDebtAction.type, callApiUpdateDebt),
    takeLatest(deleteDebtAction.type, callApiDeleteDebt),
  ]);
}
