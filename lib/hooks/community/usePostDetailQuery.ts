import { useQuery } from "@tanstack/react-query";
import { postApi } from "@/lib/api/client/post";
import { PostDetail } from "@/lib/types/post";

export default function usePostDetailQuery({ postId }: { postId: string }) {
  return useQuery<PostDetail>({
    queryKey: ["postDetail", postId],
    queryFn: async () => {
      try {
        const response = await postApi.getPostDetail(postId);
        if (response.status !== 200 || !response.data) {
          throw new Error(
            response.message || "게시글 상세 정보를 불러오는데 실패했습니다."
          );
        }
        return response.data;
      } catch (error) {
        throw new Error("게시글 상세 정보를 불러오는데 실패했습니다.");
      }
    },
    gcTime: 1000 * 60 * 5, // 5분
  });
}
