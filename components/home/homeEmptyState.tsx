import EmptyState from "../_common/emptyState";

export default function HomeEmptyState() {
  return (
    <EmptyState
      title="등록된 식물 이야기가 없어요."
      description="이 카테고리의 첫 번째 소식을 기다리고 있어요.\n나만의 소중한 식물 이야기를 가장 먼저 들려주세요!"
      buttonText="글쓰기"
      buttonHref="/community/write"
    />
  );
}
