import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@commons/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#ff8c42]/15 text-[#9b4500] border border-[#ff8c42]/30 dark:bg-[#ff8c42]/20 dark:text-[#ffb68d]",
        open:
          "bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
        locked:
          "bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
        paid:
          "bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
        cancelled:
          "bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800",
        outline:
          "border border-[#f0ede6] text-neutral-700 dark:border-[#2a2a2a] dark:text-neutral-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
