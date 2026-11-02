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
import { addDebtAction } from "@stores/reducers/finance";
import { toast } from "sonner";
import { DebtType } from "@interfaces/finance";
import { BookOpen, User, Calendar, Phone, DollarSign } from "lucide-react";

interface CreateDebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: DebtType;
}

export function CreateDebtModal({
  isOpen,
  onClose,
  defaultType = "lend",
}: CreateDebtModalProps) {
  const dispatch = useAppDispatch();
  const [type, setType] = useState<DebtType>(defaultType);
  const [personName, setPersonName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("2026-10-25");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      toast.error("Vui lòng nhập số tiền nợ hợp lệ!");
      return;
    }
    if (!personName.trim()) {
      toast.error("Vui lòng nhập tên người vay / chủ nợ!");
      return;
    }

    setIsSubmitting(true);
    dispatch(
      addDebtAction({
        type,
        personName,
        phoneNumber,
        amount: parsedAmount,
        dueDate,
        reason,
      })
    );

    toast.success(
      type === "lend"
        ? `Đã ghi nhận: ${personName} nợ bạn ${new Intl.NumberFormat("vi-VN").format(parsedAmount)} ₫`
        : `Đã ghi nhận: Bạn nợ ${personName} ${new Intl.NumberFormat("vi-VN").format(parsedAmount)} ₫`
    );

    setIsSubmitting(false);
    onClose();

    // Reset
    setPersonName("");
    setPhoneNumber("");
    setAmount("");
    setReason("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          {/* Segmented Type Toggle */}
          <div className="flex rounded-2xl bg-neutral-100 dark:bg-neutral-800 p-1 mb-2">
            <button
              type="button"
              onClick={() => setType("lend")}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                type === "lend"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-neutral-600 dark:text-neutral-400"
              }`}
            >
              📥 Người Khác Nợ Tôi (Cho Vay)
            </button>
            <button
              type="button"
              onClick={() => setType("borrow")}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                type === "borrow"
                  ? "bg-rose-500 text-white shadow-xs"
                  : "text-neutral-600 dark:text-neutral-400"
              }`}
            >
              📤 Tôi Đang Nợ Người Ta (Đi Vay)
            </button>
          </div>

          <DialogTitle className="text-xl font-black">
            {type === "lend" ? "Ghi Khoản Cho Vay Mới" : "Ghi Khoản Vay Nợ Mới"}
          </DialogTitle>
          <DialogDescription>
            Theo dõi chính xác ai nợ ai để nhắc nợ đúng hẹn, không bị quên.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-1">
          <div>
            <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1 block">
              {type === "lend" ? "Tên Người Nợ Bạn *" : "Tên Chủ Nợ (Người Bạn Nợ) *"}
            </label>
            <Input
              placeholder="VD: Hoàng Nam, Chị Mai, Tuấn Anh..."
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1 block">
                Số Tiền (VNĐ) *
              </label>
              <Input
                type="number"
                placeholder="VD: 1500000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1 block">
                Số Điện Thoại
              </label>
              <Input
                placeholder="0908 xxx xxx"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1 block">
              Hạn Trả Tiền
            </label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-1 block">
              Lý Do / Nội Dung Vay Mượn
            </label>
            <Input
              placeholder="VD: Mượn đóng tiền học, Ăn trưa trả hộ, Vay gấp..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button
              type="submit"
              className={type === "lend" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-rose-500 hover:bg-rose-600 text-white"}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang lưu..." : "Lưu Vào Sổ Nợ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
