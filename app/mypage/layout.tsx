import { ReactNode } from "react";
import Sidebar from "@/components/mypage/sidebar";

interface MypageLayoutProps {
  children: ReactNode;
}

export default function MypageLayout({ children }: MypageLayoutProps) {
  return (
    <div className="bg-surface-98 min-h-screen">
      <div className="mx-auto flex w-full max-w-[1320px] gap-10 px-5 py-[30px]">
        {/* 사이드바 */}
        <Sidebar />

        {/* 메인 콘텐츠 영역 */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
