import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인 | 모두의식물",
  description: "모두의식물 로그인 페이지",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-surface-98 min-h-screen">{children}</div>;
}
