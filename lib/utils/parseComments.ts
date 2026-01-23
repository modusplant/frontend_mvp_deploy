import { Comment } from "@/lib/types/comment";

/**
 * 플랫 배열로 받은 댓글을 계층 구조(트리)로 변환
 * @param flatComments API에서 받은 플랫 배열 형태의 댓글 목록
 * @returns 트리 구조로 변환된 댓글 목록 (최상위 댓글만 포함)
 *
 * @example
 * // API 응답: [
 * //   { path: "0", content: "첫 댓글", ... },
 * //   { path: "0.1", content: "첫 댓글의 답글", ... },
 * //   { path: "0.1.2", content: "답글의 답글", ... },
 * //   { path: "1", content: "두 번째 댓글", ... }
 * // ]
 * //
 * // 결과: [
 * //   {
 * //     path: "0",
 * //     content: "첫 댓글",
 * //     depth: 0,
 * //     children: [
 * //       {
 * //         path: "0.1",
 * //         content: "첫 댓글의 답글",
 * //         depth: 1,
 * //         children: [
 * //           { path: "0.1.2", content: "답글의 답글", depth: 2, children: [] }
 * //         ]
 * //       }
 * //     ]
 * //   },
 * //   { path: "1", content: "두 번째 댓글", depth: 0, children: [] }
 * // ]
 */
export function buildCommentTree(flatComments: Comment[]): Comment[] {
  // 1단계: path를 키로 하는 맵 생성 + children/depth 초기화
  const commentMap = new Map<string, Comment>();
  const rootComments: Comment[] = [];

  flatComments.forEach((comment) => {
    commentMap.set(comment.path, {
      ...comment,
      children: [],
      depth: comment.path.split(".").length - 1,
    });
  });

  // 2단계: 부모-자식 관계 설정
  flatComments.forEach((comment) => {
    const pathSegments = comment.path.split(".");
    const currentComment = commentMap.get(comment.path)!;

    if (pathSegments.length === 1) {
      // 최상위 댓글 (depth: 0)
      rootComments.push(currentComment);
    } else {
      // 답글: 부모 찾아서 children에 추가
      const parentPath = pathSegments.slice(0, -1).join(".");
      const parentComment = commentMap.get(parentPath);

      if (parentComment) {
        parentComment.children!.push(currentComment);
      }
    }
  });

  return rootComments;
}

/**
 * 새 답글의 path 생성 (부모 path 기준)
 * @param parentPath 부모 댓글의 path (없으면 null = 최상위 댓글)
 * @param siblingCount 같은 depth의 형제 댓글 개수
 * @returns 새 댓글의 path
 *
 * @example
 * generateCommentPath(null, 0) // "0" (첫 번째 최상위 댓글)
 * generateCommentPath(null, 2) // "2" (세 번째 최상위 댓글)
 * generateCommentPath("0", 0) // "0.0" (0번 댓글의 첫 답글)
 * generateCommentPath("0.1", 2) // "0.1.2" (0.1번 댓글의 세 번째 답글)
 */
export function generateCommentPath(
  parentPath: string | null,
  siblingCount: number
): string {
  if (!parentPath) {
    // 최상위 댓글
    return siblingCount.toString();
  }

  // 답글
  return `${parentPath}.${siblingCount}`;
}

/**
 * 특정 path의 댓글이 속한 최상위 댓글의 path 반환
 * @param path 댓글 path
 * @returns 최상위 댓글 path
 *
 * @example
 * getRootPath("0") // "0"
 * getRootPath("0.1") // "0"
 * getRootPath("0.1.2") // "0"
 * getRootPath("3") // "3"
 */
export function getRootPath(path: string): string {
  return path.split(".")[0];
}

/**
 * 댓글 depth 계산 (UI 들여쓰기용)
 * @param path 댓글 path
 * @returns depth (0부터 시작)
 *
 * @example
 * getCommentDepth("0") // 0
 * getCommentDepth("0.1") // 1
 * getCommentDepth("0.1.2") // 2
 */
export function getCommentDepth(path: string): number {
  return path.split(".").length - 1;
}
