"use client";

import { useAuthStore } from "@/lib/store/authStore";
import { showModal } from "@/lib/store/modalStore";
import SidebarMobile from "./sidebarMobile";
import SidebarDesktop from "./sidebarDesktop";

export default function Sidebar() {
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
    <>
      <SidebarMobile onLogout={handleLogout} />
      <SidebarDesktop onLogout={handleLogout} />
    </>
  );
}
