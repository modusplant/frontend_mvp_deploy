import EmptyState from "@/components/_common/emptyState";

/**
 * Next.js 전역 404 페이지
 * 존재하지 않는 경로 접근 시 자동으로 렌더링됨
 */
export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
      <EmptyState
        imageSrc="/character_sad.svg"
        title="페이지를 찾을 수 없어요"
        description="요청하신 페이지가 존재하지 않거나\n이동되었을 수 있습니다."
        buttonText="홈으로 가기"
        buttonHref="/"
      />
    </div>
  );
}
