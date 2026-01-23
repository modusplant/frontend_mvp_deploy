import { Metadata } from "next";
import { notFound } from "next/navigation";
import PostDetail from "@/components/community/detail/postDetail";
import { postApi } from "@/lib/api/post";
import { dummyPostDetail } from "@/lib/data/postDetail";

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
  try {
    const response = await postApi.getPostDetail(params.id);

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
  try {
    // 실제 API 호출
    // const response = await postApi.getPostDetail(params.id);

    // if (!response.data) {
    //   notFound();
    // }

    // 더미 데이터 사용
    const response = { data: dummyPostDetail };

    // 조회수 증가 (비동기, 에러 무시)
    postApi.incrementViewCount(params.id).catch(() => {
      // 조회수 증가 실패는 무시
    });

    return <PostDetail postId={params.id} initialData={response.data} />;
  } catch (error) {
    notFound();
  }
}
