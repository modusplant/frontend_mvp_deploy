import { Metadata } from "next";
import { notFound } from "next/navigation";
import PostDetail from "@/components/community/detail/postDetail";
import { postApi } from "@/lib/api/client/post";

interface PostPageProps {
  params: {
    id: string;
  };
}

/**
 * 게시글 상세 페이지 메타데이터 생성
 */
export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const response = await postApi.getPostDetail(id);
    if (!response.data) {
      return {
        title: "게시글을 찾을 수 없습니다 | 모두의식물",
      };
    }

    return {
      title: `${response.data.title} | 모두의식물`,
      description: response.data.content
        .filter((c) => c.type === "text")
        .map((c) => c.data)
        .join(" ")
        .slice(0, 150),
    };
  } catch (error) {
    return {
      title: "게시글 | 모두의식물",
    };
  }
}

/**
 * 게시글 상세 페이지
 */
export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  try {
    return <PostDetail postId={id} />;
  } catch (error) {
    notFound();
  }
}
