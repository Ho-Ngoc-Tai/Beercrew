"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Header } from "@components/modules/Header";
import { useAppDispatch, useAppSelector } from "@stores/index";
import {
  getFinanceDataAction,
  financeSelector,
} from "@stores/reducers/finance";
import { DailyExpenseList } from "./DailyExpenseList";
import { CreateTransactionModal } from "./CreateTransactionModal";
import { formatCurrencyVND } from "@commons/utils/format";
import {
  Filter,
  Search,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  Utensils,
  Car,
  ShoppingBag,
  Zap,
  Home,
  Coffee,
  HeartPulse,
  Receipt,
} from "lucide-react";
import { Button } from "@components/ui/button";
import { TransactionCategory, TransactionType } from "@interfaces/finance";

const categories: { key: string; label: string }[] = [
  { key: "all", label: "Tất Cả Danh Mục" },
  { key: "food", label: "Ăn Uống" },
  { key: "transport", label: "Đi Lại / Xăng" },
  { key: "shopping", label: "Mua Sắm" },
  { key: "bills", label: "Hóa Đơn / Mạng" },
  { key: "housing", label: "Tiền Nhà" },
  { key: "entertainment", label: "Cafe / Giải Trí" },
  { key: "health", label: "Y Tế / Sức Khỏe" },
];

export function ExpensesFeature() {
  const dispatch = useAppDispatch();
  const { transactions, summary } = useAppSelector(financeSelector);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | TransactionType>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPayment, setSelectedPayment] = useState<string>("all");

  useEffect(() => {
    dispatch(getFinanceDataAction());
  }, [dispatch]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Type match
      if (selectedType !== "all" && tx.type !== selectedType) return false;

      // Category match
      if (selectedCategory !== "all" && tx.category !== selectedCategory) return false;

      // Payment method match
      if (selectedPayment !== "all" && tx.paymentMethod !== selectedPayment) return false;

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = tx.title.toLowerCase().includes(query);
        const matchesNotes = tx.notes ? tx.notes.toLowerCase().includes(query) : false;
        if (!matchesTitle && !matchesNotes) return false;
      }

      return true;
    });
  }, [transactions, selectedType, selectedCategory, selectedPayment, searchQuery]);

  const filteredIncome = useMemo(
    () =>
      filteredTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  );

  const filteredExpense = useMemo(
    () =>
      filteredTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  );

  return (
    <div className="space-y-6">
      <Header
        title="Nhật Ký Thu Chi Hàng Ngày"
        subtitle="Chi tiết từng khoản chi tiêu trong ngày, phân loại danh mục & phương thức thanh toán"
        createButtonLabel="+ Ghi Khoản Mới"
        onOpenCreateModal={() => setIsCreateOpen(true)}
      />

      {/* Filter and Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1e1e1e] border border-[#f0ede6] dark:border-[#2a2a2a] shadow-warm flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Tổng Thu Trong Kỳ
          </span>
          <span className="text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-400 mt-2">
            +{formatCurrencyVND(summary.totalIncome)}
          </span>
          <span className="text-xs text-neutral-400 mt-1">
            Đã lọc: +{formatCurrencyVND(filteredIncome)}
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#1e1e1e] border border-[#f0ede6] dark:border-[#2a2a2a] shadow-warm flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Tổng Chi Trong Kỳ
          </span>
          <span className="text-2xl font-black tracking-tight text-rose-500 mt-2">
            -{formatCurrencyVND(summary.totalExpense)}
          </span>
          <span className="text-xs text-neutral-400 mt-1">
            Đã lọc: -{formatCurrencyVND(filteredExpense)}
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-emerald-600 text-white shadow-warm flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
            Số Dư Thực Tế (Thu - Chi)
          </span>
          <span className="text-2xl font-black tracking-tight mt-2">
            {formatCurrencyVND(summary.balance)}
          </span>
          <span className="text-xs text-emerald-100/90 mt-1">
            Hiển thị {filteredTransactions.length} / {transactions.length} giao dịch
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#1e1e1e] border border-[#f0ede6] dark:border-[#2a2a2a] shadow-warm space-y-4">
        {/* Search & Type Switch */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo món ăn, đổ xăng, cafe, ghi chú..."
              className="h-10 w-full rounded-2xl border border-[#f0ede6] dark:border-[#2a2a2a] bg-[#fafaf7] dark:bg-[#252525] pl-10 pr-4 text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Type Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-2xl shrink-0">
            <button
              onClick={() => setSelectedType("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedType === "all"
                  ? "bg-white dark:bg-[#1e1e1e] text-neutral-900 dark:text-white shadow-xs"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setSelectedType("expense")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedType === "expense"
                  ? "bg-rose-500 text-white shadow-xs"
                  : "text-neutral-500 hover:text-rose-500"
              }`}
            >
              Chỉ Chi Tiêu
            </button>
            <button
              onClick={() => setSelectedType("income")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedType === "income"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-neutral-500 hover:text-emerald-600"
              }`}
            >
              Chỉ Thu Nhập
            </button>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                    : "bg-[#fafaf7] dark:bg-[#252525] text-neutral-600 dark:text-neutral-400 border-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Grouped List */}
      <DailyExpenseList
        transactions={filteredTransactions}
        onOpenCreateModal={() => setIsCreateOpen(true)}
      />

      {/* Create Modal */}
      <CreateTransactionModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}
