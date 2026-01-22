import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/tailwindHelper";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Badge variant
   * - default: 기본 스타일 (neutral 색상)
   * - primary: primary green 색상
   * - outline: 테두리만 있는 스타일
   */
  variant?: "default" | "primary" | "outline";
  /**
   * Badge 크기
   */
  size?: "sm" | "md" | "lg";
}

export default function Badge({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        // 기본 스타일
        "inline-flex items-center rounded-lg font-medium transition-colors",

        // Variant 스타일
        {
          // default: neutral 회색 배경
          "bg-surface-98 text-neutral-20": variant === "default",

          // primary: green 배경
          "bg-primary-10 text-primary-70": variant === "primary",

          // outline: 테두리만
          "border-surface-stroke border bg-transparent text-neutral-50":
            variant === "outline",
        },

        // Size 스타일
        {
          "px-1 py-0.5 text-xs": size === "sm",
          "px-1.5 py-1 text-sm": size === "md",
          "px-3 py-1.5 text-base": size === "lg",
        },

        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
