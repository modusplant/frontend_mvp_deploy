import { useQuery } from "@tanstack/react-query";
import { commentApi } from "@/lib/api/comment";
import { Comment } from "@/lib/types/comment";

interface UseCommentsQueryProps {
  postId: string;
}

interface UseCommentsQueryReturn {
  comments: Comment[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useCommentsQuery({
  postId,
}: UseCommentsQueryProps): UseCommentsQueryReturn {
  const {
    data: comments = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const response = await commentApi.getComments(postId);
      return response.data || [];
    },
  });

  return {
    comments,
    isLoading,
    error: error as Error | null,
    refetch,
  };
}
