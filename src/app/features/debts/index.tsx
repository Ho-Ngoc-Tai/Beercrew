"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Header } from "@components/modules/Header";
import { useAppDispatch, useAppSelector } from "@stores/index";
import {
  getFinanceDataAction,
  financeSelector,
  updateDebtAction,
} from "@stores/reducers/finance";
import { CreateDebtModal } from "./CreateDebtModal";
import { DebtDetailModal } from "./DebtDetailModal";
import { DebtRecord, DebtType } from "@interfaces/finance";
import { formatCurrencyVND } from "@commons/utils/format";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import {
  Users,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Phone,
  Copy,
  Search,
  Check,
} from "lucide-react";
import { toast } from "sonner";

export function DebtsFeature() {
  const dispatch = useAppDispatch();
  const { debts, summary } = useAppSelector(financeSelector);

  const [activeTab, setActiveTab] = useState<DebtType>("lend");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<DebtRecord | null>(null);

  useEffect(() => {
    dispatch(getFinanceDataAction());
  }, [dispatch]);

  const lendDebts = useMemo(
    () => debts.filter((d) => d.type === "lend"),
    [debts]
  );
  const borrowDebts = useMemo(
    () => debts.filter((d) => d.type === "borrow"),
    [debts]
  );

  const currentTabDebts = activeTab === "lend" ? lendDebts : borrowDebts;

  const filteredDebts = useMemo(() => {
    return currentTabDebts.filter((d) => {
      if (statusFilter !== "all" && d.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = d.personName.toLowerCase().includes(query);
        const matchesReason = d.reason.toLowerCase().includes(query);
        const matchesPhone = d.phoneNumber ? d.phoneNumber.includes(query) : false;
        if (!matchesName && !matchesReason && !matchesPhone) return false;
      }
      return true;
    });
  }, [currentTabDebts, statusFilter, searchQuery]);

  const handleCopyReminder = (e: React.MouseEvent, debt: DebtRecord) => {
    e.stopPropagation();
    const message = `Chào ${debt.personName}, mình gửi nhắc nhẹ khoản "${debt.reason}" số tiền ${formatCurrencyVND(debt.remainAmount)}, hẹn hạn trả là ${debt.dueDate}. Khi nào tiện bạn chuyển khoản cho mình nhé, cảm ơn bạn nhiều!`;
    navigator.clipboard.writeText(message);
    toast.success(`Đã sao chép tin nhắn nhắc nợ cho ${debt.personName}!`);
  };

  const handleQuickMarkPaid = (e: React.MouseEvent, debt: DebtRecord) => {
    e.stopPropagation();
    if (confirm(`Xác nhận ${debt.personName} đã thanh toán hết ${formatCurrencyVND(debt.remainAmount)}?`)) {
      dispatch(
        updateDebtAction({
          id: debt.id,
          status: "paid",
          paidAmount: debt.amount,
        })
      );
      toast.success(`Đã cập nhật trạng thái: Đã thu hồi nợ xong!`);
    }
  };

  const netDebtDifference = summary.totalReceivable - summary.totalPayable;

  return (
    <div className="space-y-6">
      <Header
        title="Sổ Nợ & Cho Vay Cá Nhân"
        subtitle="Quản lý chi tiết các khoản người khác nợ mình và các khoản mình đang nợ"
        createButtonLabel="+ Ghi Khoản Nợ Mới"
        onOpenCreateModal={() => setIsCreateOpen(true)}
      />

      {/* KPI 3 Thẻ Sổ Nợ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Người khác nợ tôi */}
        <div
          onClick={() => setActiveTab("lend")}
          className={`p-5 rounded-3xl cursor-pointer transition-all border shadow-warm flex flex-col justify-between ${
            activeTab === "lend"
              ? "bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-transparent ring-2 ring-emerald-500"
              : "bg-white dark:bg-[#1e1e1e] border-[#f0ede6] dark:border-[#2a2a2a] hover:bg-neutral-50 dark:hover:bg-neutral-800"
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                activeTab === "lend" ? "text-emerald-100" : "text-neutral-400"
              }`}
            >
              Người Khác Nợ Tôi (Cho Vay)
            </span>
            <div
              className={`h-8 w-8 rounded-xl flex items-center justify-center ${
                activeTab === "lend"
                  ? "bg-white/20 text-white"
                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
              }`}
            >
              <ArrowDownLeft className="h-4 w-4" />
            </div>
          </div>
          <div className="my-2">
            <span
              className={`text-2xl font-black tracking-tight ${
                activeTab === "lend"
                  ? "text-white"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {formatCurrencyVND(summary.totalReceivable)}
            </span>
          </div>
          <span
            className={`text-xs ${
              activeTab === "lend" ? "text-emerald-100/90" : "text-neutral-400"
            }`}
          >
            {lendDebts.filter((d) => d.status !== "paid").length} khoản cần thu hồi
          </span>
        </div>

        {/* Tôi nợ người ta */}
        <div
          onClick={() => setActiveTab("borrow")}
          className={`p-5 rounded-3xl cursor-pointer transition-all border shadow-warm flex flex-col justify-between ${
            activeTab === "borrow"
              ? "bg-gradient-to-br from-rose-500 to-red-600 text-white border-transparent ring-2 ring-rose-500"
              : "bg-white dark:bg-[#1e1e1e] border-[#f0ede6] dark:border-[#2a2a2a] hover:bg-neutral-50 dark:hover:bg-neutral-800"
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                activeTab === "borrow" ? "text-rose-100" : "text-neutral-400"
              }`}
            >
              Tôi Nợ Người Ta (Đi Vay)
            </span>
            <div
              className={`h-8 w-8 rounded-xl flex items-center justify-center ${
                activeTab === "borrow"
                  ? "bg-white/20 text-white"
                  : "bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
              }`}
            >
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
          <div className="my-2">
            <span
              className={`text-2xl font-black tracking-tight ${
                activeTab === "borrow" ? "text-white" : "text-rose-500"
              }`}
            >
              {formatCurrencyVND(summary.totalPayable)}
            </span>
          </div>
          <span
            className={`text-xs ${
              activeTab === "borrow" ? "text-rose-100/90" : "text-neutral-400"
            }`}
          >
            {borrowDebts.filter((d) => d.status !== "paid").length} khoản cần thanh toán
          </span>
        </div>

        {/* Chênh lệch nợ ròng */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1e1e1e] border border-[#f0ede6] dark:border-[#2a2a2a] shadow-warm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Vị Thế Nợ Ròng (Cần Thu - Cần Trả)
            </span>
            <div className="h-8 w-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <Users className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
            </div>
          </div>
          <div className="my-2">
            <span
              className={`text-2xl font-black tracking-tight ${
                netDebtDifference >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-500"
              }`}
            >
              {netDebtDifference >= 0 ? "+" : ""}
              {formatCurrencyVND(netDebtDifference)}
            </span>
          </div>
          <span className="text-xs text-neutral-400">
            {netDebtDifference >= 0
              ? "Bạn đang cho vay nhiều hơn nợ người khác"
              : "Bạn đang có nghĩa vụ nợ cần hoàn trả"}
          </span>
        </div>
      </div>

      {/* Tabs Switcher and Filter */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#1e1e1e] border border-[#f0ede6] dark:border-[#2a2a2a] shadow-warm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Main 2 Tabs */}
          <div className="flex items-center gap-2 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-2xl">
            <button
              onClick={() => setActiveTab("lend")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "lend"
                  ? "bg-white dark:bg-[#1e1e1e] text-emerald-700 dark:text-emerald-400 shadow-xs"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
              }`}
            >
              <ArrowDownLeft className="h-3.5 w-3.5" />
              Ai Nợ Tôi ({lendDebts.length})
            </button>
            <button
              onClick={() => setActiveTab("borrow")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "borrow"
                  ? "bg-white dark:bg-[#1e1e1e] text-rose-600 dark:text-rose-400 shadow-xs"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
              }`}
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
              Tôi Nợ Ai ({borrowDebts.length})
            </button>
          </div>

          {/* Search bar */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên người, lý do nợ, số điện thoại..."
              className="h-10 w-full rounded-2xl border border-[#f0ede6] dark:border-[#2a2a2a] bg-[#fafaf7] dark:bg-[#252525] pl-10 pr-4 text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                statusFilter === "all"
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setStatusFilter("unpaid")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                statusFilter === "unpaid"
                  ? "bg-amber-500 text-white"
                  : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              Chưa trả
            </button>
            <button
              onClick={() => setStatusFilter("partial")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                statusFilter === "partial"
                  ? "bg-blue-500 text-white"
                  : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              Trả 1 phần
            </button>
            <button
              onClick={() => setStatusFilter("paid")}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                statusFilter === "paid"
                  ? "bg-emerald-600 text-white"
                  : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              Đã trả hết
            </button>
          </div>
        </div>
      </div>

      {/* Debt Records Cards Grid */}
      {filteredDebts.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-[#1e1e1e] rounded-3xl border border-[#f0ede6] dark:border-[#2a2a2a] p-8 shadow-warm">
          <div className="h-14 w-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-2xl mx-auto mb-3">
            🤝
          </div>
          <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-1">
            Không có khoản nợ nào trong danh sách
          </h4>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-4">
            Bấm "Ghi Khoản Nợ Mới" để tạo khoản theo dõi cho vay hoặc đi vay.
          </p>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            + Ghi Khoản Nợ Mới
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDebts.map((debt) => {
            const isLend = debt.type === "lend";
            const isPaid = debt.status === "paid";
            const isPartial = debt.status === "partial";

            return (
              <div
                key={debt.id}
                onClick={() => setSelectedDebt(debt)}
                className="p-5 rounded-3xl bg-white dark:bg-[#1e1e1e] border border-[#f0ede6] dark:border-[#2a2a2a] hover:border-emerald-300 dark:hover:border-emerald-700 transition-all shadow-warm cursor-pointer space-y-4 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-neutral-400">
                      {isLend ? "Người mượn tiền" : "Chủ nợ"}
                    </span>
                    <Badge
                      variant={isPaid ? "paid" : isPartial ? "locked" : "open"}
                      className="text-[10px]"
                    >
                      {isPaid ? "Đã trả hết" : isPartial ? "Trả một phần" : "Chưa trả"}
                    </Badge>
                  </div>

                  <h3 className="text-base font-black text-neutral-900 dark:text-neutral-100">
                    {debt.personName}
                  </h3>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                    {debt.reason}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400">Số nợ còn lại:</span>
                    <span
                      className={`font-black text-base ${
                        isPaid
                          ? "line-through text-neutral-400"
                          : isLend
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-500"
                      }`}
                    >
                      {formatCurrencyVND(debt.remainAmount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1 border-t border-neutral-200/50 dark:border-neutral-700/50">
                    <span>Số tiền gốc: {formatCurrencyVND(debt.amount)}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Hạn: {debt.dueDate}
                    </span>
                  </div>
                </div>

                {/* Quick actions on card */}
                <div className="flex items-center gap-2 pt-1">
                  {isLend && !isPaid && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => handleCopyReminder(e, debt)}
                      className="flex-1 rounded-xl text-xs font-bold border-[#e8e4dc] dark:border-[#333] hover:bg-neutral-100 dark:hover:bg-neutral-800 gap-1"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Nhắc Nợ
                    </Button>
                  )}

                  {!isPaid && (
                    <Button
                      size="sm"
                      onClick={(e) => handleQuickMarkPaid(e, debt)}
                      className="flex-1 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Đã Trả Xong
                    </Button>
                  )}

                  {isPaid && (
                    <div className="w-full text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 py-1 flex items-center justify-center gap-1">
                      <CheckCircle2 className="h-4 w-4" /> Đã hoàn tất thanh toán
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <CreateDebtModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <DebtDetailModal
        debt={selectedDebt}
        isOpen={Boolean(selectedDebt)}
        onClose={() => setSelectedDebt(null)}
      />
    </div>
  );
}
