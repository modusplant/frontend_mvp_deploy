"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/tailwindHelper";
import { MYPAGE_MENU_SECTIONS } from "@/lib/constants/mypage";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface SidebarMobileProps {
  onLogout: () => void;
}

export default function SidebarMobile({ onLogout }: SidebarMobileProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-5 w-full lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="border-surface-98 flex w-full items-center justify-between rounded-xl border bg-white p-4"
      >
        <span className="text-neutral-20 text-base font-semibold">메뉴</span>
        <ChevronDown
          className={cn(
            "text-neutral-60 h-5 w-5 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="border-surface-98 mt-2 rounded-xl border bg-white p-6">
          {MYPAGE_MENU_SECTIONS.map((section, sectionIndex) => (
            <div key={section.title} className="flex flex-col gap-2.5">
              {/* 섹션 제목 */}
              <div className="px-0 py-1">
                <span className="text-sm leading-[1.2] font-medium tracking-[-0.02em] text-neutral-50">
                  {section.title}
                </span>
              </div>

              {/* 메뉴 아이템 */}
              <div className="flex flex-col">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const isDisabled = item.disabled;

                  return (
                    <Link
                      key={item.href}
                      href={isDisabled ? "#" : item.href}
                      className={cn(
                        "flex rounded-[10px] px-0 py-[13px]",
                        "text-[15px] leading-[1.19] font-medium tracking-[-0.02em]",
                        "transition-colors",
                        isActive && "text-neutral-5 font-semibold",
                        !isActive && !isDisabled && "text-neutral-30",
                        isDisabled && "text-neutral-60 cursor-not-allowed"
                      )}
                      onClick={(e) => {
                        if (isDisabled) {
                          e.preventDefault();
                        } else {
                          setIsOpen(false);
                        }
                      }}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* 구분선 */}
              {sectionIndex < MYPAGE_MENU_SECTIONS.length - 1 && (
                <div className="bg-surface-stroke h-px" />
              )}
            </div>
          ))}

          {/* 로그아웃 버튼 */}
          <div className="flex flex-col">
            <div className="bg-surface-stroke h-px" />
            <button
              onClick={onLogout}
              className={cn(
                "mt-2.5 flex rounded-[10px] px-0 py-[13px]",
                "text-[15px] leading-[1.19] font-medium tracking-[-0.02em]",
                "text-neutral-30"
              )}
            >
              로그아웃
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
