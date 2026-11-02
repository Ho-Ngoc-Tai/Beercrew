import React, { ReactNode } from "react";
import { Wallet, Sparkles, CheckCircle2, TrendingUp, ShieldCheck } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#fafaf7] dark:bg-[#121212]">
      {/* Left Column: Brand Hero Showcase */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#064e3b] via-[#0f2e24] to-[#0a1813] text-white relative overflow-hidden">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-warm">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">FinFlow</h2>
            <p className="text-xs text-emerald-300">Sổ Thu Chi & Quản Lý Sổ Nợ Thực Tế</p>
          </div>
        </div>

        <div className="relative z-10 max-w-md my-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5" />
            Kiến Trúc BFF Doanh Nghiệp • Bảo Mật AES-256
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
            Quản Lý Thu Chi Hàng Ngày & Sổ Nợ Rõ Ràng, Thực Tế
          </h1>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Ghi chép cụ thể từng món tiền chi tiêu trong ngày (Ăn sáng, cà phê, cơm trưa, đổ xăng, siêu thị...), tự động tính tổng tháng, dòng tiền ròng và theo dõi sổ nợ hai chiều (Ai nợ tôi & Tôi nợ ai).
          </p>

          <div className="space-y-3 pt-4 border-t border-emerald-900/60">
            <div className="flex items-center gap-3 text-xs text-neutral-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Ghi chép chi tiêu từng món trong ngày chỉ mất 5 giây</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-neutral-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Tổng hợp Thu - Chi - Số dư tháng tự động theo thời gian thực</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-neutral-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Sổ nợ minh bạch: Ai nợ tôi & Tôi nợ ai kèm mẫu tin nhắc nợ</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-emerald-400/60 relative z-10">
          © 2026 FinFlow Enterprise. Quản lý tài chính cá nhân thực tế và hiệu quả.
        </div>
      </div>

      {/* Right Column: Form Container */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
