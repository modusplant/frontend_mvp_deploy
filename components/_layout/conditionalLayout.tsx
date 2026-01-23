"use client";

import { usePathname } from "next/navigation";
import Header from "./header";
import Footer from "./footer";
import { User } from "@/lib/types/auth";

export default function ConditionalLayout({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: User | null;
}) {
  const pathname = usePathname();

  // auth 관련 페이지에서는 Header와 Footer를 표시하지 않음
  const isAuthPage =
    pathname?.startsWith("/login") || pathname?.startsWith("/signup");

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header initialUser={initialUser} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
