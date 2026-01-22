import PostList from "@/components/home/postList";
import HeroBanner from "@/components/home/heroBanner";
import ScrollToTop from "@/components/home/scrollToTop";

export default function Home() {
  return (
    <div className="-mt-16">
      {/* Hero Banner (히어로 이미지) */}
      <HeroBanner />

      {/* Post List Section */}
      <section className="relative w-full py-8 md:py-12 lg:py-16">
        <div className="mx-auto flex w-full max-w-[1320px] flex-col px-4 md:px-6 lg:px-8">
          {/* 섹션 타이틀 */}
          <div className="flex flex-col gap-2.5">
            <span className="font-emphasis text-primary-50 text-xl font-bold">
              ModusConnect
            </span>
            <span className="font-emphasis text-3xl font-bold">
              우리들의 식물 이야기
            </span>
          </div>
          <PostList />
        </div>
      </section>
      <ScrollToTop />
    </div>
  );
}
