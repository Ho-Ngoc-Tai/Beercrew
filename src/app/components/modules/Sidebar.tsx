"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  Users,
  LogOut,
  TrendingUp,
  WalletCards,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@commons/utils/cn";
import {
  DASHBOARD_PAGE,
  EXPENSES_PAGE,
  DEBTS_PAGE,
} from "@routes/web";
import { useAppDispatch, useAppSelector } from "@stores/index";
import { logoutAction, authSelector } from "@stores/reducers/auth";
import { financeSelector } from "@stores/reducers/finance";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { formatCurrencyVND } from "@commons/utils/format";

export function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(authSelector);
  const { transactions, debts, summary } = useAppSelector(financeSelector);

  const activeDebtsCount = debts.filter((d) => d.status !== "paid").length;

  const navItems = [
    {
      title: "Bảng Điều Khiển",
      href: DASHBOARD_PAGE,
      icon: LayoutDashboard,
      badge: null,
    },
    {
      title: "Nhật Ký Thu Chi",
      href: EXPENSES_PAGE,
      icon: Receipt,
      badge: transactions.length > 0 ? `${transactions.length}` : null,
    },
    {
      title: "Sổ Nợ & Cho Vay",
      href: DEBTS_PAGE,
      icon: Users,
      badge: activeDebtsCount > 0 ? `${activeDebtsCount}` : null,
    },
  ];

  const handleLogout = () => {
    dispatch(logoutAction());
  };

  return (
    <aside className="w-72 shrink-0 border-r border-[#f0ede6] dark:border-[#2a2a2a] bg-white dark:bg-[#181818] flex flex-col justify-between h-screen sticky top-0 transition-colors">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center gap-3 border-b border-[#f0ede6] dark:border-[#2a2a2a]">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-warm">
            <WalletCards className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base tracking-tight text-neutral-900 dark:text-white">
                FinFlow
              </span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                PRO
              </span>
            </div>
            <span className="text-xs font-medium text-neutral-400">
              Sổ Thu Chi & Quản Lý Nợ
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-4 space-y-1.5">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Quản Lý Tài Chính
          </div>
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== DASHBOARD_PAGE && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all group",
                  isActive
                    ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 shadow-xs"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isActive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"
                    )}
                  />
                  <span>{item.title}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      "px-2 py-0.5 text-[11px] font-bold rounded-full",
                      isActive
                        ? "bg-emerald-600 text-white"
                        : "bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Financial Health Score & Profile */}
      <div className="p-4 border-t border-[#f0ede6] dark:border-[#2a2a2a] space-y-3">
        {/* Số Dư Hiện Tại */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-[#132820] dark:to-[#10241c] border border-emerald-200/50 dark:border-emerald-900/30">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
              Số Dư Tháng Này
            </span>
          </div>
          <div className="text-base font-black text-emerald-700 dark:text-emerald-400">
            {formatCurrencyVND(summary.balance || 0)}
          </div>
          <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 mt-2 pt-2 border-t border-emerald-100 dark:border-emerald-900/20">
            <span className="flex items-center gap-0.5 text-emerald-600">
              <ArrowDownLeft className="h-3 w-3" /> Thu: +{formatCurrencyVND(summary.totalIncome)}
            </span>
            <span className="flex items-center gap-0.5 text-rose-500">
              <ArrowUpRight className="h-3 w-3" /> Chi: -{formatCurrencyVND(summary.totalExpense)}
            </span>
          </div>
        </div>

        {/* User Mini Profile */}
        <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate max-w-[120px]">
                {user?.name || "Nguyễn Hải Đăng"}
              </span>
              <span className="text-xs text-neutral-400">
                Chủ Tài Khoản
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Đăng xuất"
            className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
