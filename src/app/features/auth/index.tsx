"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@stores/index";
import { authSelector, loginAction } from "@stores/reducers/auth";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@components/ui/card";
import { Wallet, ArrowRight, Lock, Mail, Sparkles, ShieldCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { DASHBOARD_PAGE } from "@routes/web";
import { toast } from "sonner";

export function AuthSignInFeature() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || DASHBOARD_PAGE;

  const { status, error, isAuthenticated } = useAppSelector(authSelector);
  const [email, setEmail] = useState("haidang.wealth@gmail.com");
  const [password, setPassword] = useState("123456");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    toast.info("Đang xác thực thông tin đăng nhập...");
    dispatch(loginAction({ email, password }));
  };

  React.useEffect(() => {
    if (hasSubmitted && isAuthenticated) {
      toast.success("Đăng nhập thành công! Đang vào hệ thống...");
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 300);
    }
  }, [hasSubmitted, isAuthenticated, redirectUrl]);

  const handleDemoLogin = () => {
    setEmail("haidang.wealth@gmail.com");
    setPassword("123456");
    setHasSubmitted(true);
    toast.info("Đang đăng nhập chế độ Demo...");
    dispatch(loginAction({ email: "haidang.wealth@gmail.com", password: "123456" }));
  };

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="space-y-1.5 px-0">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white mb-2 shadow-warm">
          <Wallet className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
          FinFlow - Sổ Thu Chi & Sổ Nợ
        </CardTitle>
        <CardDescription>
          Đăng nhập để ghi chép chi tiêu từng ngày, tính tổng thu chi tháng và quản lý sổ nợ hai chiều thực tế.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-0 pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {Boolean(error) && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-300 font-semibold">
              {String(error)}
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
              Email Tài Khoản
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                type="email"
                placeholder="haidang.wealth@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-11"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
              Mật Khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-11"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-sm font-bold shadow-warm mt-2 bg-[#10b981] hover:bg-[#059669] text-white"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Đang xác thực..." : "Đăng Nhập Ngay"}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>

          {/* Quick Demo Access */}
          <div className="pt-4 border-t border-[#f0ede6] dark:border-[#2a2a2a]">
            <Button
              type="button"
              variant="outline"
              onClick={handleDemoLogin}
              className="w-full text-xs font-bold py-2.5 flex items-center justify-center gap-2 border-dashed border-[#10b981]/50 text-[#047857] dark:text-[#34d399]"
            >
              <Sparkles className="h-4 w-4 text-[#10b981]" />
              <span>Đăng nhập nhanh 1-Click (Tài khoản Demo)</span>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400 pt-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>Dữ liệu tài chính được bảo mật mã hóa AES-256</span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
