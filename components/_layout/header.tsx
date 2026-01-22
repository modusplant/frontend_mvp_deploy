"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/_common/button";
import { cn } from "@/lib/utils/tailwindHelper";
import { useAuthStore } from "@/lib/store/authStore";
import { usePathname } from "next/navigation";
import Profile from "@/components/_common/profileImage";
import { User } from "@/lib/types/auth";

export interface HeaderProps {
  className?: string;
  initialUser: User | null;
}

export default function Header({ className, initialUser }: HeaderProps) {
  const { isAuthenticated, user: storeUser } = useAuthStore();
  const pathname = usePathname();
  const isRootPath = pathname.endsWith("/");

  // Use store user if authenticated, otherwise use initialUser
  const user = isAuthenticated ? storeUser : initialUser;

  const logo = isRootPath
    ? "/logo_favicon/Logo_v2_white.svg"
    : "/logo_favicon/Logo_v2_black.svg";

  return (
    <header
      className={cn(isRootPath ? "sticky top-0" : "", "z-50 w-full", className)}
    >
      <div
        className={cn(
          "flex h-14 w-full items-center justify-between px-2 md:px-4 lg:px-6",
          !isRootPath && "border-b border-[#000000]/10"
        )}
      >
        {/* 로고 */}
        <Link href="/" className="transition-opacity hover:opacity-80">
          <Image src={logo} alt="모두의식물 로고" width={117} height={26} />
        </Link>

        {/* 로그인 상태에 따른 버튼 */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {/* 프로필 아이콘 (추후 드롭다운 추가) */}
              <Link href="/mypage">
                <div className="relative h-10 w-10">
                  <Profile imageSrc={user?.image} />
                </div>
              </Link>
              {/* 글쓰기 버튼 */}
              <Link href="/community/write">
                <Button variant="point" size="sm" className="h-10 rounded-full">
                  글쓰기
                </Button>
              </Link>
            </>
          ) : (
            <>
              {/* 로그인/회원가입 버튼 */}
              <Link href="/login">
                <Button
                  variant="default"
                  size="sm"
                  className="cursor-pointer rounded-full"
                >
                  로그인
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="point"
                  size="sm"
                  className="cursor-pointer rounded-full"
                >
                  회원가입
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
