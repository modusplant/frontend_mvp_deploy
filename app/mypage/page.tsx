import { redirect } from "next/navigation";

export default function MypagePage() {
  // /mypage 접근 시 /mypage/profile로 리다이렉트
  redirect("/mypage/profile");
}
