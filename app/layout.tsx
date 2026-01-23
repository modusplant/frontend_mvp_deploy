export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { Nanum_Myeongjo } from "next/font/google";
import localFont from "next/font/local";
import AuthInitializer from "@/components/_layout/authInitializer";
import ConditionalLayout from "@/components/_layout/conditionalLayout";
import QueryProvider from "@/components/_layout/queryProvider";
import "./globals.css";

// Emphasis 폰트: Nanum Myeongjo (제목, 강조)
const nanumMyeongjo = Nanum_Myeongjo({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-nanum-myeongjo",
  display: "swap",
});

// Body 폰트: Pretendard (본문, 일반 텍스트)
const pretendard = localFont({
  src: [
    {
      path: "../public/fonts/Pretendard-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Pretendard-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Pretendard-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Pretendard-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-pretendard",
  display: "swap",
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "system-ui",
    "Roboto",
    "sans-serif",
  ],
});

export const metadata: Metadata = {
  title: "모두의식물",
  description: "식물에 관심 있는 사용자들을 위한 정보 제공 플랫폼",
  icons: {
    icon: "/logo_favicon/favicon_green.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${pretendard.className} ${nanumMyeongjo.variable} antialiased`}
      >
        <QueryProvider>
          <AuthInitializer />
          <ConditionalLayout>{children}</ConditionalLayout>
        </QueryProvider>
      </body>
    </html>
  );
}
