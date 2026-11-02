"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { formatCurrencyVND } from "@commons/utils/format";
import { DebtRecord } from "@interfaces/finance";
import {
  CheckCircle2,
  Trash2,
  Phone,
  Copy,
  Calendar,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { useAppDispatch } from "@stores/index";
import { updateDebtAction, deleteDebtAction } from "@stores/reducers/finance";
import { toast } from "sonner";
import { Input } from "@components/ui/input";

interface DebtDetailModalProps {
  debt: DebtRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DebtDetailModal({
  debt,
  isOpen,
  onClose,
}: DebtDetailModalProps) {
  const dispatch = useAppDispatch();
  const [partialAmount, setPartialAmount] = useState("");
  const [showPartialInput, setShowPartialInput] = useState(false);

  if (!debt) return null;

  const isLend = debt.type === "lend";
  const isPaid = debt.status === "paid";

  const handleMarkPaid = () => {
    dispatch(updateDebtAction({ id: debt.id, status: "paid" }));
    toast.success("Đã đánh dấu khoản nợ là: ĐÃ TRẢ XONG!");
    onClose();
  };

  const handlePayPartial = () => {
    const p = Number(partialAmount);
    if (!p || p <= 0) {
      toast.error("Vui lòng nhập số tiền đã trả hợp lệ!");
      return;
    }
    const newPaidTotal = debt.paidAmount + p;
    dispatch(updateDebtAction({ id: debt.id, paidAmount: newPaidTotal }));
    toast.success(`Đã cập nhật trả thêm: ${new Intl.NumberFormat("vi-VN").format(p)} ₫`);
    setPartialAmount("");
    setShowPartialInput(false);
    onClose();
  };

  const handleCopyReminder = () => {
    const text = `Alo ${debt.personName} ơi, khoản tiền ${formatCurrencyVND(
      debt.remainAmount
    )} hôm trước hẹn đến ${debt.dueDate || "nay"} trả đó, có gì chuyển khoản giúp mình nha! Cảm ơn bạn.`;
    navigator.clipboard.writeText(text);
    toast.success("Đã sao chép tin nhắn nhắc nợ vào bộ nhớ tạm!");
  };

  const handleDelete = () => {
    if (confirm(`Bạn có chắc chắn muốn xóa bản ghi nợ của "${debt.personName}"?`)) {
      dispatch(deleteDebtAction(debt.id));
      toast.success("Đã xóa khỏi sổ nợ!");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-neutral-400">
              {debt.id}
            </span>
            <Badge
              variant={isPaid ? "paid" : isLend ? "open" : "cancelled"}
            >
              {isPaid
                ? "✅ Đã trả xong"
                : debt.status === "partial"
                ? "⏳ Đã trả một phần"
                : isLend
                ? "⏳ Chưa trả (Cần thu)"
                : "⚠️ Chưa trả (Cần trả)"}
            </Badge>
          </div>
          <DialogTitle className="text-xl font-black">
            {debt.personName}
          </DialogTitle>
          <DialogDescription>
            {isLend ? "Người này đang nợ bạn" : "Bạn đang nợ người này"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Card số tiền nợ */}
          <div className="p-5 rounded-3xl bg-neutral-50 dark:bg-[#252525] border border-[#f0ede6] dark:border-[#2a2a2a] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-neutral-400 block mb-0.5">
                  Số tiền còn lại phải {isLend ? "thu" : "trả"}
                </span>
                <span
                  className={`text-2xl font-black ${
                    isPaid
                      ? "text-neutral-400 line-through"
                      : isLend
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-500"
                  }`}
                >
                  {formatCurrencyVND(debt.remainAmount)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-neutral-400 block mb-0.5">
                  Tổng nợ gốc
                </span>
                <span className="text-sm font-bold text-neutral-700 dark:text-neutral-200">
                  {formatCurrencyVND(debt.amount)}
                </span>
              </div>
            </div>

            {debt.paidAmount > 0 && (
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-between text-xs text-neutral-500">
                <span>Đã thanh toán trước đó:</span>
                <span className="font-bold text-emerald-600">
                  {formatCurrencyVND(debt.paidAmount)}
                </span>
              </div>
            )}
          </div>

          {/* Chi tiết thông tin */}
          <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-300">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Lý do vay mượn:</span>
              <span className="font-bold text-neutral-800 dark:text-neutral-200">
                {debt.reason || "Không ghi chú"}
              </span>
            </div>
            {debt.phoneNumber && (
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Số điện thoại:</span>
                <span className="font-bold">{debt.phoneNumber}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Hạn thanh toán:</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {debt.dueDate || "Không có"}
              </span>
            </div>
          </div>

          {/* Khối nhập trả một phần */}
          {showPartialInput && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 space-y-2">
              <label className="text-xs font-bold text-emerald-800 dark:text-emerald-200 block">
                Nhập số tiền đã trả đợt này (VNĐ):
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="VD: 500000"
                  value={partialAmount}
                  onChange={(e) => setPartialAmount(e.target.value)}
                  className="bg-white dark:bg-[#1e1e1e]"
                />
                <Button size="sm" onClick={handlePayPartial} className="bg-emerald-600">
                  Lưu
                </Button>
              </div>
            </div>
          )}

          {/* Các nút hành động */}
          <div className="space-y-2 pt-2">
            {!isPaid && (
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleMarkPaid}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Đã Trả Hết</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPartialInput(!showPartialInput)}
                  className="w-full text-xs font-bold"
                >
                  <span>Trả Một Phần</span>
                </Button>
              </div>
            )}

            {isLend && !isPaid && (
              <Button
                variant="outline"
                onClick={handleCopyReminder}
                className="w-full text-xs font-bold gap-1.5 border-dashed border-amber-500/50 text-amber-700 dark:text-amber-300"
              >
                <Copy className="h-4 w-4" />
                <span>Sao Chép Mẫu Tin Nhắn Nhắc Nợ</span>
              </Button>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                className="text-xs gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Xóa Khoản Nợ</span>
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                Đóng
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
