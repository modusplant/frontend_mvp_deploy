"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // 스크롤 위치 감지
  useEffect(() => {
    const toggleVisibility = () => {
      // 300px 이상 스크롤 시 버튼 표시
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  // 최상단으로 스크롤
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="bg-primary-50 hover:bg-primary-70 fixed right-8 bottom-8 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:shadow-xl active:scale-95 md:right-10 md:bottom-10 lg:right-12 lg:bottom-12"
          aria-label="맨 위로 이동"
        >
          <ArrowUp className="h-6 w-6 text-white" strokeWidth={2.5} />
        </button>
      )}
    </>
  );
}
