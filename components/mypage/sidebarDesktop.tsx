"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/tailwindHelper";
import { MYPAGE_MENU_SECTIONS } from "@/lib/constants/mypage";

interface SidebarDesktopProps {
  onLogout: () => void;
}

export default function SidebarDesktop({ onLogout }: SidebarDesktopProps) {
  const pathname = usePathname();

  return (
    <aside className="border-surface-98 hidden h-fit w-[248px] shrink-0 flex-col gap-5 rounded-xl border bg-white p-8 lg:flex">
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
    </aside>
  );
}
