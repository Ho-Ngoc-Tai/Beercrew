"use client";

import React from "react";
import { formatCurrencyVND } from "@commons/utils/format";
import {
  Transaction,
  TransactionType,
  TransactionCategory,
  PaymentMethod,
} from "@interfaces/finance";
import {
  Utensils,
  Car,
  ShoppingBag,
  Zap,
  Home,
  Coffee,
  HeartPulse,
  Receipt,
  Banknote,
  Coins,
  QrCode,
  CreditCard,
  Trash2,
  Calendar,
} from "lucide-react";
import { useAppDispatch } from "@stores/index";
import { deleteTransactionAction } from "@stores/reducers/finance";
import { toast } from "sonner";

interface DailyExpenseListProps {
  transactions: Transaction[];
  onOpenCreateModal?: () => void;
}

export function DailyExpenseList({
  transactions,
  onOpenCreateModal,
}: DailyExpenseListProps) {
  const dispatch = useAppDispatch();

  const getCategoryIcon = (category: TransactionCategory) => {
    switch (category) {
      case "food":
        return <Utensils className="h-4 w-4 text-orange-500" />;
      case "transport":
        return <Car className="h-4 w-4 text-blue-500" />;
      case "shopping":
        return <ShoppingBag className="h-4 w-4 text-pink-500" />;
      case "bills":
        return <Zap className="h-4 w-4 text-amber-500" />;
      case "housing":
        return <Home className="h-4 w-4 text-indigo-500" />;
      case "entertainment":
        return <Coffee className="h-4 w-4 text-purple-500" />;
      case "health":
        return <HeartPulse className="h-4 w-4 text-rose-500" />;
      case "salary":
        return <Banknote className="h-4 w-4 text-emerald-500" />;
      case "bonus":
        return <Coins className="h-4 w-4 text-teal-500" />;
      case "freelance":
        return <Receipt className="h-4 w-4 text-cyan-500" />;
      default:
        return <Receipt className="h-4 w-4 text-neutral-400" />;
    }
  };

  const getPaymentMethodBadge = (method: PaymentMethod) => {
    switch (method) {
      case "cash":
        return "Tiền mặt";
      case "bank_transfer":
        return "Chuyển khoản";
      case "credit_card":
        return "Thẻ tín dụng";
      case "e_wallet":
        return "Ví điện tử";
      default:
        return method;
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Bạn có muốn xóa khoản "${title}"?`)) {
      dispatch(deleteTransactionAction(id));
      toast.success("Đã xóa giao dịch thành công!");
    }
  };

  // Group transactions by date
  const groupedByDate: Record<string, Transaction[]> = {};
  transactions.forEach((tx) => {
    if (!groupedByDate[tx.date]) {
      groupedByDate[tx.date] = [];
    }
    groupedByDate[tx.date].push(tx);
  });

  const sortedDates = Object.keys(groupedByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  const formatHeaderDate = (dateStr: string) => {
    if (dateStr === "2026-10-08") return "Hôm nay (08/10/2026)";
    if (dateStr === "2026-10-07") return "Hôm qua (07/10/2026)";
    const parts = dateStr.split("-");
    return `Ngày ${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  if (transactions.length === 0) {
    return (
      <div className="w-full py-16 text-center bg-white dark:bg-[#1e1e1e] rounded-3xl border border-[#f0ede6] dark:border-[#2a2a2a] p-8 shadow-warm">
        <div className="h-14 w-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-2xl mx-auto mb-3">
          📝
        </div>
        <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-1">
          Chưa có khoản thu chi nào được ghi
        </h4>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-4">
          Hãy bấm "Ghi Nhanh Chi Tiêu" để bắt đầu theo dõi dòng tiền hàng ngày của bạn.
        </p>
        {onOpenCreateModal && (
          <button
            onClick={onOpenCreateModal}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs"
          >
            + Ghi Chép Chi Tiêu Ngay
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedDates.map((dateStr) => {
        const items = groupedByDate[dateStr];
        const dayExpense = items
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + t.amount, 0);
        const dayIncome = items
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + t.amount, 0);

        return (
          <div
            key={dateStr}
            className="rounded-3xl border border-[#f0ede6] dark:border-[#2a2a2a] bg-white dark:bg-[#1e1e1e] overflow-hidden shadow-warm"
          >
            {/* Header ngày */}
            <div className="p-4 px-6 bg-[#f9f9f6] dark:bg-[#252525] border-b border-[#f0ede6] dark:border-[#2a2a2a] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-600" />
                <span className="font-extrabold text-sm text-neutral-900 dark:text-neutral-100">
                  {formatHeaderDate(dateStr)}
                </span>
                <span className="text-xs text-neutral-400">
                  ({items.length} giao dịch)
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold">
                {dayIncome > 0 && (
                  <span className="text-emerald-600">
                    Thu: +{formatCurrencyVND(dayIncome)}
                  </span>
                )}
                <span className="text-rose-500">
                  Chi: -{formatCurrencyVND(dayExpense)}
                </span>
              </div>
            </div>

            {/* Danh sách các khoản trong ngày */}
            <div className="divide-y divide-[#f0ede6] dark:divide-[#2a2a2a]">
              {items.map((tx) => {
                const isExpense = tx.type === "expense";
                return (
                  <div
                    key={tx.id}
                    className="p-4 px-6 flex items-center justify-between hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="h-10 w-10 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                        {getCategoryIcon(tx.category)}
                      </div>

                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100 truncate">
                          {tx.title}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                          <span>{tx.time}</span>
                          <span>•</span>
                          <span className="px-1.5 py-0.2 rounded-md bg-neutral-100 dark:bg-neutral-800 font-medium">
                            {getPaymentMethodBadge(tx.paymentMethod)}
                          </span>
                          {tx.notes && (
                            <>
                              <span>•</span>
                              <span className="italic truncate max-w-[200px]">
                                {tx.notes}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span
                        className={`font-black text-sm md:text-base ${
                          isExpense ? "text-rose-500" : "text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {isExpense ? "-" : "+"}
                        {formatCurrencyVND(tx.amount)}
                      </span>

                      <button
                        onClick={() => handleDelete(tx.id, tx.title)}
                        title="Xóa giao dịch"
                        className="opacity-0 group-hover:opacity-100 p-2 text-neutral-400 hover:text-rose-500 rounded-xl transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
