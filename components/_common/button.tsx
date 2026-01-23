import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/tailwindHelper";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 버튼 variant
   * - default: 기본 스타일 (흰색 배경, 테두리)
   * - point: 강조 스타일 (primary green 배경)
   * - secondary: 보조 스타일 (회색 배경)
   * - deactivate: 비활성화 스타일 (회색 배경)
   */
  variant?: "default" | "point" | "secondary" | "deactivate";
  /**
   * 버튼 크기
   */
  size?: "sm" | "md" | "lg";
  /**
   * 전체 너비 사용 여부
   */
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || variant === "deactivate"}
        className={cn(
          // 기본 스타일
          "inline-flex items-center justify-center rounded-lg transition-colors",
          "focus-visible:ring-primary-50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          "disabled:pointer-events-none disabled:opacity-50",

          // Variant 스타일
          {
            // default: 흰색 배경, 테두리
            "text-neutral-0 border-neutral-90 border bg-neutral-100":
              variant === "default",

            // point: primary green 배경
            "bg-primary-50 hover:bg-primary-70 text-neutral-100":
              variant === "point",

            // secondary: 회색 배경, 활성화 상태
            "bg-neutral-80 hover:bg-neutral-70 text-neutral-100":
              variant === "secondary",

            // deactivate: 회색 배경, 비활성화
            "bg-neutral-90 text-neutral-60 cursor-not-allowed":
              variant === "deactivate",
          },

          // Size 스타일
          {
            "px-3 py-1.5 text-sm": size === "sm",
            "px-4 py-2 text-base": size === "md",
            "px-6 py-3 text-lg": size === "lg",
          },

          // 전체 너비
          {
            "w-full": fullWidth,
          },

          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
