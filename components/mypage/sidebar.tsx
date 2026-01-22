"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/tailwindHelper";
import { useAuthStore } from "@/lib/store/authStore";
import { MYPAGE_MENU_SECTIONS } from "@/lib/constants/mypage";
import { showModal } from "@/lib/store/modalStore";

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    showModal({
      type: "two-button",
      title: "로그아웃 하시겠습니까?",
      description: "메인페이지로 이동합니다.",
      buttonText: "로그아웃",
      onConfirm: () => {
        window.location.href = "/";
        setTimeout(() => {
          logout();
        }, 0);
      },
    });
  };

  return (
    <aside className="border-surface-98 flex h-fit w-[248px] flex-col gap-5 rounded-xl border bg-white p-8">
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
          onClick={handleLogout}
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
