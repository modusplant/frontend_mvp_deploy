import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "글쓰기 | 모두의식물",
  description: "모두의식물 글쓰기 페이지",
};

export default function WriteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-surface-98 min-h-screen">{children}</div>;
}
