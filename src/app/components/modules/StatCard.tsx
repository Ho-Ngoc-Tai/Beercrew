import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@commons/utils/cn";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
}

export function StatCard({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  iconColor = "text-[#ff8c42]",
  iconBg = "bg-[#fff4ed] dark:bg-[#2e1e14]",
}: StatCardProps) {
  return (
    <div className="p-6 rounded-3xl border border-[#f0ede6] dark:border-[#2a2a2a] bg-white dark:bg-[#1e1e1e] shadow-warm flex flex-col justify-between transition-all hover:translate-y-[-2px]">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          {title}
        </span>
        <div className={cn("h-11 w-11 rounded-2xl flex items-center justify-center", iconBg)}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-black tracking-tight text-neutral-900 dark:text-neutral-50">
          {value}
        </span>
        {change && (
          <span
            className={cn(
              "text-xs font-bold px-2 py-0.5 rounded-full",
              isPositive
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
            )}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
