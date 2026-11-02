"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@components/modules/Header";
import { useAppDispatch, useAppSelector } from "@stores/index";
import {
  getFinanceDataAction,
  financeSelector,
} from "@stores/reducers/finance";
import { authSelector } from "@stores/reducers/auth";
import {
  ArrowDownLeft,
  ArrowUpRight,
  WalletCards,
  Calendar,
  Clock,
  Plus,
  Users,
  AlertCircle,
  CheckCircle2,
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
  ChevronRight,
  TrendingDown,
  PhoneCall,
  ShieldAlert,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { formatCurrencyVND } from "@commons/utils/format";
import { Badge } from "@components/ui/badge";
import { CreateTransactionModal } from "@features/expenses/CreateTransactionModal";
import { CreateDebtModal } from "@features/debts/CreateDebtModal";
import { DebtDetailModal } from "@features/debts/DebtDetailModal";
import { Transaction, DebtRecord, TransactionCategory } from "@interfaces/finance";
import Link from "next/link";
import { EXPENSES_PAGE, DEBTS_PAGE } from "@routes/web";

export function DashboardFeature() {
  const dispatch = useAppDispatch();
  const { transactions, debts, summary } = useAppSelector(financeSelector);
  const { user } = useAppSelector(authSelector);

  const [isCreateTxOpen, setIsCreateTxOpen] = useState(false);
  const [createTxType, setCreateTxType] = useState<"expense" | "income">("expense");
  const [isCreateDebtOpen, setIsCreateDebtOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<DebtRecord | null>(null);

  useEffect(() => {
    dispatch(getFinanceDataAction());
  }, [dispatch]);

  // Today's transactions (08/10/2026)
  const todayTransactions = transactions.filter((t) => t.date === "2026-10-08");
  const todayExpenses = todayTransactions.filter((t) => t.type === "expense");
  const todayExpenseSum = todayExpenses.reduce((sum, t) => sum + t.amount, 0);

  // Unpaid Debts
  const unpaidLendDebts = debts.filter(
    (d) => d.type === "lend" && d.status !== "paid"
  );
  const unpaidBorrowDebts = debts.filter(
    (d) => d.type === "borrow" && d.status !== "paid"
  );

  // Category breakdown for monthly expenses
  const allMonthlyExpenses = transactions.filter((t) => t.type === "expense");
  const categoryTotals: Record<string, number> = {};
  allMonthlyExpenses.forEach((tx) => {
    categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
  });

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
      default:
        return <Receipt className="h-4 w-4 text-neutral-400" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    const map: Record<string, string> = {
      food: "Ăn Uống",
      transport: "Đi Lại / Xăng",
      shopping: "Mua Sắm",
      bills: "Hóa Đơn / Điện Nước",
      housing: "Tiền Nhà / Thuê",
      entertainment: "Cafe / Giải Trí",
      health: "Y Tế / Thuốc",
      other: "Chi Phí Khác",
    };
    return map[category] || category;
  };

  const savingsRate =
    summary.totalIncome > 0
      ? Math.round((summary.balance / summary.totalIncome) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <Header
        title="Bảng Thu Chi & Sổ Nợ Cá Nhân"
        subtitle={`Xin chào ${user?.name || "bạn"}, hôm nay ngày 08/10/2026 • Tổng hợp dòng tiền tháng 10`}
        createButtonLabel="+ Ghi Khoản Chi"
        onOpenCreateModal={() => {
          setCreateTxType("expense");
          setIsCreateTxOpen(true);
        }}
      />

      {/* Fast Action Quick-bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl bg-white dark:bg-[#1e1e1e] border border-[#f0ede6] dark:border-[#2a2a2a] shadow-warm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            Thao tác nhanh:
          </span>
          <Button
            size="sm"
            onClick={() => {
              setCreateTxType("expense");
              setIsCreateTxOpen(true);
            }}
            className="rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white gap-1.5"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
            Ghi Tiêu Tiền
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setCreateTxType("income");
              setIsCreateTxOpen(true);
            }}
            className="rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
          >
            <ArrowDownLeft className="h-3.5 w-3.5" />
            Ghi Tiền Thu Về
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsCreateDebtOpen(true)}
            className="rounded-xl text-xs font-bold border-[#e8e4dc] dark:border-[#333] hover:bg-neutral-100 dark:hover:bg-neutral-800 gap-1.5"
          >
            <Users className="h-3.5 w-3.5 text-blue-500" />
            Ghi Sổ Nợ / Cho Vay
          </Button>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
          <Calendar className="h-4 w-4 text-emerald-600" />
          <span>Kỳ thống kê: <strong>Tháng 10/2026</strong></span>
        </div>
      </div>

      {/* 4 KPI THỰC TẾ & KHẢ THI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Tổng Thu Tháng */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-warm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
              Tổng Thu Tháng 10
            </span>
            <div className="h-8 w-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <ArrowDownLeft className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-2xl lg:text-3xl font-black tracking-tight">
              +{formatCurrencyVND(summary.totalIncome)}
            </span>
          </div>
          <div className="text-[11px] text-emerald-100/90 flex items-center gap-1 font-medium">
            <span>Bao gồm lương & thu nhập khác</span>
          </div>
        </div>

        {/* 2. Tổng Chi Tháng */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-warm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-100">
              Tổng Chi Tháng 10
            </span>
            <div className="h-8 w-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <ArrowUpRight className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-2xl lg:text-3xl font-black tracking-tight">
              -{formatCurrencyVND(summary.totalExpense)}
            </span>
          </div>
          <div className="text-[11px] text-rose-100/90 flex items-center gap-1 font-medium">
            <span>Chi tiêu sinh hoạt & mua sắm</span>
          </div>
        </div>

        {/* 3. Số Dư Tiền Còn Lại */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1e1e1e] border border-[#f0ede6] dark:border-[#2a2a2a] shadow-warm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Số Dư Còn Lại (Thu - Chi)
            </span>
            <div className="h-8 w-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center">
              <WalletCards className="h-4 w-4 text-emerald-600" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-2xl lg:text-3xl font-black tracking-tight text-neutral-900 dark:text-neutral-50">
              {formatCurrencyVND(summary.balance)}
            </span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Tỷ lệ tích lũy: {savingsRate}% thu nhập
          </div>
        </div>

        {/* 4. Hôm Nay Đã Chi (Điểm chạm thực tế hàng ngày) */}
        <div className="p-5 rounded-3xl bg-amber-50 dark:bg-[#252014] border border-amber-200/60 dark:border-amber-900/40 shadow-warm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Hôm Nay Đã Chi (08/10)
            </span>
            <div className="h-8 w-8 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Clock className="h-4 w-4 text-amber-700 dark:text-amber-400" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-2xl lg:text-3xl font-black tracking-tight text-amber-900 dark:text-amber-300">
              {formatCurrencyVND(todayExpenseSum || summary.todayExpense)}
            </span>
          </div>
          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
            <span>{todayExpenses.length} khoản chi trong ngày</span>
            <span>Hôm qua: {formatCurrencyVND(summary.yesterdayExpense)}</span>
          </div>
        </div>
      </div>

      {/* SỔ NỢ (AI NỢ TÔI VS TÔI NỢ AI) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Người Khác Nợ Tôi (Cho vay / Cần đòi) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1e1e1e] border border-[#f0ede6] dark:border-[#2a2a2a] shadow-warm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                <ArrowDownLeft className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-neutral-900 dark:text-neutral-100">
                  Người Khác Nợ Tôi (Cần Thu)
                </h3>
                <p className="text-xs text-neutral-400">
                  Khoản cho bạn bè, đồng nghiệp mượn
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-neutral-400 block font-medium">Tổng cần thu</span>
              <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                {formatCurrencyVND(summary.totalReceivable)}
              </span>
            </div>
          </div>

          <div className="divide-y divide-[#f0ede6] dark:divide-[#2a2a2a]">
            {unpaidLendDebts.length === 0 ? (
              <p className="text-xs text-neutral-400 py-4 text-center">
                Hiện không có ai nợ bạn khoản nào 🎉
              </p>
            ) : (
              unpaidLendDebts.slice(0, 3).map((debt) => (
                <div
                  key={debt.id}
                  onClick={() => setSelectedDebt(debt)}
                  className="py-3 flex items-center justify-between cursor-pointer hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 px-2 rounded-2xl transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                      {debt.personName}
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      Lý do: {debt.reason} • Hạn: {debt.dueDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                      {formatCurrencyVND(debt.remainAmount)}
                    </span>
                    <Badge variant={debt.status === "partial" ? "outline" : "default"} className="text-[10px]">
                      {debt.status === "partial" ? "Đã trả 1 phần" : "Chưa trả"}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 border-t border-[#f0ede6] dark:border-[#2a2a2a] flex justify-between items-center text-xs">
            <span className="text-neutral-400">
              Có {unpaidLendDebts.length} khoản cho mượn đang mở
            </span>
            <Link
              href={DEBTS_PAGE}
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
            >
              Xem chi tiết sổ nợ <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Tôi Nợ Người Ta (Đi vay / Cần trả) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1e1e1e] border border-[#f0ede6] dark:border-[#2a2a2a] shadow-warm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-2xl bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <ArrowUpRight className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-neutral-900 dark:text-neutral-100">
                  Tôi Đang Nợ Người Ta (Cần Trả)
                </h3>
                <p className="text-xs text-neutral-400">
                  Thẻ tín dụng, vay nợ cá nhân, tiền trả góp
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-neutral-400 block font-medium">Tổng cần trả</span>
              <span className="text-base font-black text-rose-500">
                {formatCurrencyVND(summary.totalPayable)}
              </span>
            </div>
          </div>

          <div className="divide-y divide-[#f0ede6] dark:divide-[#2a2a2a]">
            {unpaidBorrowDebts.length === 0 ? (
              <p className="text-xs text-neutral-400 py-4 text-center">
                Tuyệt vời, bạn không nợ ai đồng nào! 👏
              </p>
            ) : (
              unpaidBorrowDebts.slice(0, 3).map((debt) => (
                <div
                  key={debt.id}
                  onClick={() => setSelectedDebt(debt)}
                  className="py-3 flex items-center justify-between cursor-pointer hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 px-2 rounded-2xl transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                      {debt.personName}
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      Khoản: {debt.reason} • Hạn trả: {debt.dueDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-rose-500">
                      {formatCurrencyVND(debt.remainAmount)}
                    </span>
                    <Badge variant="outline" className="text-[10px] text-rose-600 border-rose-200">
                      Cần trả
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 border-t border-[#f0ede6] dark:border-[#2a2a2a] flex justify-between items-center text-xs">
            <span className="text-neutral-400">
              Có {unpaidBorrowDebts.length} khoản nợ cần thanh toán đúng hạn
            </span>
            <Link
              href={DEBTS_PAGE}
              className="text-rose-500 font-bold hover:underline flex items-center gap-1"
            >
              Quản lý sổ nợ <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* CHI TIÊU CÁI GÌ TRONG NGÀY HÔM NAY (08/10) & PHÂN BỔ NHÓM CHI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột 1 & 2: Chi tiêu cái gì cái gì trong ngày hôm nay */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-[#1e1e1e] border border-[#f0ede6] dark:border-[#2a2a2a] shadow-warm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-base text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <span>Hôm Nay Chi Gì? (08/10/2026)</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                  {todayExpenses.length} món
                </span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Liệt kê chi tiết từng món tiền đã bỏ ra trong ngày hôm nay
              </p>
            </div>

            <Button
              size="sm"
              onClick={() => {
                setCreateTxType("expense");
                setIsCreateTxOpen(true);
              }}
              className="rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              Ghi Khoản Mới
            </Button>
          </div>

          {todayExpenses.length === 0 ? (
            <div className="py-10 text-center text-xs text-neutral-400">
              Hôm nay chưa có khoản chi nào được ghi nhận. Bấm "+ Ghi Khoản Mới" để thêm!
            </div>
          ) : (
            <div className="divide-y divide-[#f0ede6] dark:divide-[#2a2a2a]">
              {todayExpenses.map((tx) => (
                <div
                  key={tx.id}
                  className="py-3 flex items-center justify-between hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 px-2 rounded-2xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                      {getCategoryIcon(tx.category)}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100 block">
                        {tx.title}
                      </span>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                        <span>{tx.time}</span>
                        <span>•</span>
                        <span className="capitalize">{getCategoryLabel(tx.category)}</span>
                        {tx.notes && (
                          <>
                            <span>•</span>
                            <span className="italic">{tx.notes}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-sm text-rose-500 block">
                      -{formatCurrencyVND(tx.amount)}
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      {tx.paymentMethod === "cash"
                        ? "Tiền mặt"
                        : tx.paymentMethod === "bank_transfer"
                        ? "Chuyển khoản"
                        : tx.paymentMethod === "e_wallet"
                        ? "Ví điện tử"
                        : "Thẻ"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-3 border-t border-[#f0ede6] dark:border-[#2a2a2a] flex items-center justify-between text-xs">
            <span className="font-bold text-neutral-600 dark:text-neutral-300">
              Tổng chi tiêu hôm nay:
            </span>
            <span className="font-black text-base text-rose-500">
              -{formatCurrencyVND(todayExpenseSum)}
            </span>
          </div>

          <div className="pt-2 text-center">
            <Link
              href={EXPENSES_PAGE}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            >
              Xem toàn bộ lịch sử chi tiêu các ngày trước <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Cột 3: Tỷ trọng các nhóm chi tiêu trong tháng */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1e1e1e] border border-[#f0ede6] dark:border-[#2a2a2a] shadow-warm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-black text-base text-neutral-900 dark:text-neutral-100">
              Cơ Cấu Chi Tiêu Tháng 10
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Phân bổ số tiền theo từng mục đích sử dụng
            </p>

            <div className="mt-4 space-y-3">
              {Object.keys(categoryTotals).length === 0 ? (
                <p className="text-xs text-neutral-400 text-center py-6">
                  Chưa có dữ liệu phân loại chi tiêu
                </p>
              ) : (
                Object.entries(categoryTotals)
                  .sort(([, a], [, b]) => b - a)
                  .map(([cat, amount]) => {
                    const pct =
                      summary.totalExpense > 0
                        ? Math.round((amount / summary.totalExpense) * 100)
                        : 0;

                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                            {getCategoryIcon(cat as TransactionCategory)}
                            {getCategoryLabel(cat)}
                          </span>
                          <span className="font-black text-neutral-900 dark:text-neutral-100">
                            {formatCurrencyVND(amount)} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/30 text-xs space-y-1">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
              💡 Gợi ý quản lý tài chính:
            </span>
            <p className="text-emerald-700/80 dark:text-emerald-400/80 text-[11px]">
              Tỷ lệ chi tiêu của bạn đang ở mức <strong>{100 - savingsRate}%</strong> tổng thu nhập. Duy trì thói quen ghi chép mỗi khi phát sinh thanh toán để kiểm soát dòng tiền tốt nhất!
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateTransactionModal
        isOpen={isCreateTxOpen}
        onClose={() => setIsCreateTxOpen(false)}
        defaultType={createTxType}
      />

      <CreateDebtModal
        isOpen={isCreateDebtOpen}
        onClose={() => setIsCreateDebtOpen(false)}
      />

      <DebtDetailModal
        debt={selectedDebt}
        isOpen={Boolean(selectedDebt)}
        onClose={() => setSelectedDebt(null)}
      />
    </div>
  );
}
