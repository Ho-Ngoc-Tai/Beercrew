"use client";

import React from "react";
import { Search, Bell, Sun, Moon, Plus } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@components/ui/button";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  createButtonLabel?: string;
  onOpenCreateModal?: () => void;
}

export function Header({
  title = "Bảng Điều Khiển",
  subtitle = "Sổ thu chi thực tế, tổng hợp theo ngày tháng & quản lý sổ nợ",
  createButtonLabel = "Ghi Chi Tiêu",
  onOpenCreateModal,
}: HeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-20 px-8 border-b border-[#f0ede6] dark:border-[#2a2a2a] bg-white/80 dark:bg-[#181818]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between transition-colors">
      <div className="flex flex-col">
        <h1 className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          {title}
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Search */}
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3.5 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Tìm khoản chi, ghi chú, người nợ..."
            className="h-10 w-64 rounded-2xl border border-[#f0ede6] dark:border-[#2a2a2a] bg-[#fafaf7] dark:bg-[#202020] pl-10 pr-4 text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>

        {/* Dark/Light Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-10 w-10 rounded-2xl border border-[#f0ede6] dark:border-[#2a2a2a] flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          title="Chuyển giao diện sáng/tối"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-neutral-700" />
          )}
        </button>

        {/* Notifications */}
        <button
          className="relative h-10 w-10 rounded-2xl border border-[#f0ede6] dark:border-[#2a2a2a] flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          title="Thông báo"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-900" />
        </button>

        {/* Quick CTA */}
        {onOpenCreateModal && (
          <Button
            onClick={onOpenCreateModal}
            className="gap-2 shadow-warm text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="h-4 w-4" />
            <span>{createButtonLabel}</span>
          </Button>
        )}
      </div>
    </header>
  );
}
