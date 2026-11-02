"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { useAppDispatch } from "@stores/index";
import { addTransactionAction } from "@stores/reducers/finance";
import { toast } from "sonner";
import {
  TransactionType,
  TransactionCategory,
  PaymentMethod,
} from "@interfaces/finance";
import {
  Receipt,
  Utensils,
  Car,
  ShoppingBag,
  Zap,
  Home,
  Coffee,
  HeartPulse,
  Coins,
  Banknote,
  CreditCard,
  QrCode,
} from "lucide-react";

interface CreateTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: TransactionType;
}

const expenseCategories = [
  { key: "food", label: "Ăn Uống", icon: Utensils },
  { key: "transport", label: "Đi Lại / Xăng", icon: Car },
  { key: "shopping", label: "Mua Sắm", icon: ShoppingBag },
  { key: "bills", label: "Hóa Đơn / Mạng", icon: Zap },
  { key: "housing", label: "Tiền Nhà", icon: Home },
  { key: "entertainment", label: "Cafe / Giải Trí", icon: Coffee },
  { key: "health", label: "Y Tế / Thuốc", icon: HeartPulse },
  { key: "other_expense", label: "Khác", icon: Receipt },
];

const incomeCategories = [
  { key: "salary", label: "Tiền Lương", icon: Banknote },
  { key: "bonus", label: "Tiền Thưởng", icon: Coins },
  { key: "freelance", label: "Làm Thêm / Dự Án", icon: Receipt },
  { key: "investment", label: "Lãi Tiết Kiệm / Đầu Tư", icon: Coins },
  { key: "other_income", label: "Thu Nhập Khác", icon: Banknote },
];

const paymentMethods: { key: PaymentMethod; label: string; icon: any }[] = [
  { key: "cash", label: "Tiền mặt", icon: Banknote },
  { key: "bank_transfer", label: "Chuyển khoản", icon: QrCode },
  { key: "credit_card", label: "Thẻ tín dụng", icon: CreditCard },
  { key: "e_wallet", label: "Ví điện tử", icon: QrCode },
];

export function CreateTransactionModal({
  isOpen,
  onClose,
  defaultType = "expense",
}: CreateTransactionModalProps) {
  const dispatch = useAppDispatch();
  const [type, setType] = useState<TransactionType>(defaultType);
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<TransactionCategory>(
    defaultType === "expense" ? "food" : "salary"
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bank_transfer");
  const [date, setDate] = useState("2026-10-08");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      toast.error("Vui lòng nhập số tiền hợp lệ lớn hơn 0!");
      return;
    }
    if (!title.trim()) {
      toast.error("Vui lòng nhập nội dung chi tiêu!");
      return;
    }

    setIsSubmitting(true);
    dispatch(
      addTransactionAction({
        type,
        amount: parsedAmount,
        title,
        category,
        paymentMethod,
        date,
        notes,
      })
    );

    toast.success(
      type === "expense"
        ? `Đã ghi nhận khoản chi: ${title} (${new Intl.NumberFormat("vi-VN").format(parsedAmount)} ₫)`
        : `Đã ghi nhận khoản thu: ${title} (${new Intl.NumberFormat("vi-VN").format(parsedAmount)} ₫)`
    );

    setIsSubmitting(false);
    onClose();

    // Reset
    setAmount("");
    setTitle("");
    setNotes("");
  };

  const categories = type === "expense" ? expenseCategories : incomeCategories;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          {/* Segmented Type Toggle */}
          <div className="flex rounded-2xl bg-neutral-100 dark:bg-neutral-800 p-1 mb-2">
            <button
              type="button"
              onClick={() => {
                setType("expense");
                setCategory("food");
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                type === "expense"
                  ? "bg-rose-500 text-white shadow-xs"
                  : "text-neutral-600 dark:text-neutral-400"
              }`}
            >
              💸 Khoản Chi Tiêu
            </button>
            <button
              type="button"
              onClick={() => {
                setType("income");
                setCategory("salary");
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                type === "income"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-neutral-600 dark:text-neutral-400"
              }`}
            >
              💰 Khoản Thu Nhập
            </button>
          </div>
          <DialogTitle className="text-xl font-black">
            {type === "expense" ? "Ghi Chép Chi Tiêu Mới" : "Ghi Nhận Khoản Thu Mới"}
          </DialogTitle>
          <DialogDescription>
            Nhập số tiền và nội dung để ghi lại ngay vào sổ thu chi hàng ngày.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-1">
          {/* Amount Input */}
          <div>
            <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1 block">
              Số Tiền (VNĐ) *
            </label>
            <div className="relative">
              <Input
                type="number"
                placeholder="VD: 55000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg font-black h-14 pl-4 text-emerald-600 dark:text-emerald-400"
                required
                autoFocus
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                VNĐ
              </span>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1 block">
              Chi Tiêu Cái Gì / Nội Dung *
            </label>
            <Input
              placeholder={
                type === "expense"
                  ? "VD: Ăn trưa bún bò, Đổ xăng, Mua đồ siêu thị..."
                  : "VD: Nhận lương tháng 10, Tiền làm ngoài giờ..."
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Category Chips */}
          <div>
            <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1.5 block">
              Danh Mục *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {categories.map((c) => {
                const Icon = c.icon;
                const isSelected = category === c.key;
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setCategory(c.key as TransactionCategory)}
                    className={`p-2 rounded-2xl border text-[11px] font-bold flex flex-col items-center gap-1 transition-all ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                        : "border-[#f0ede6] dark:border-[#2a2a2a] bg-neutral-50 dark:bg-[#252525] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="truncate max-w-full">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Method & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1 block">
                Nguồn Tiền / Phương Thức
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="flex h-12 w-full rounded-2xl border border-[#f0ede6] dark:border-[#2a2a2a] bg-white dark:bg-[#1e1e1e] px-3 py-2 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {paymentMethods.map((m) => (
                  <option key={m.key} value={m.key}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1 block">
                Ngày Chi Tiêu
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1 block">
              Ghi Chú Thêm
            </label>
            <Input
              placeholder="VD: Mua chung với bạn, Mã giảm giá..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button
              type="submit"
              className={type === "expense" ? "bg-rose-500 hover:bg-rose-600 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang lưu..." : "Lưu Giao Dịch"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
