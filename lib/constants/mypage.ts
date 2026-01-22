/**
 * 마이페이지 사이드바 메뉴 구조
 */

export interface MenuItem {
  label: string;
  href: string;
  disabled?: boolean;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export const MYPAGE_MENU_SECTIONS: MenuSection[] = [
  {
    title: "내 정보",
    items: [
      { label: "프로필 설정", href: "/mypage/profile" },
      { label: "계정 설정", href: "/mypage/account" },
    ],
  },
  {
    title: "내 활동",
    items: [
      { label: "최근에 본 글", href: "/mypage/recent" },
      { label: "내가 쓴 글", href: "/mypage/posts" },
      { label: "내 댓글", href: "/mypage/comments" },
      { label: "좋아요", href: "/mypage/likes" },
      { label: "북마크", href: "/mypage/bookmarks" },
    ],
  },
];
