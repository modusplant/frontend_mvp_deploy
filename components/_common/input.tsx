import React, { forwardRef, useState } from "react";
import { cn } from "@/lib/utils/tailwindHelper";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  showPasswordToggle?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, showPasswordToggle = false, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType =
      showPasswordToggle && type === "password"
        ? showPassword
          ? "text"
          : "password"
        : type;

    const isError = !!error;

    if (showPasswordToggle && type === "password") {
      // 비밀번호 토글이 필요한 경우만 wrapper div 사용
      return (
        <div className="relative flex items-center">
          <input
            type={inputType}
            className={cn(
              "text-neutral-0 placeholder:text-neutral-70 w-full bg-transparent text-base",
              "rounded-lg border px-4 py-3 outline-none",
              isError ? "border-system-alert" : "border-surface-stroke-2",
              "focus:ring-primary-50 focus:border-primary-50 focus:ring-1",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-colors",
              className
            )}
            ref={ref}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-neutral-70 hover:text-neutral-20 absolute right-3 transition-colors"
            aria-label="비밀번호 표시/숨김"
          >
            {showPassword ? (
              <Eye width={16} height={16} stroke="currentColor" />
            ) : (
              <EyeOff width={16} height={16} stroke="currentColor" />
            )}
          </button>
        </div>
      );
    }

    // 일반 input의 경우 순수 input 태그만 반환
    return (
      <input
        type={inputType}
        className={cn(
          "text-neutral-0 placeholder:text-neutral-70 w-full bg-transparent text-base",
          "rounded-lg border px-4 py-3 outline-none",
          isError ? "border-system-alert" : "border-surface-stroke-2",
          "focus:ring-primary-50 focus:border-primary-50 focus:ring-1",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-colors",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
