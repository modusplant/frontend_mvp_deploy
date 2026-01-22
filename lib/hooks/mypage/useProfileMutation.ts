import { useMutation, useQueryClient } from "@tanstack/react-query";
import { memberApi } from "@/lib/api/client/member";
import { ProfileData } from "@/lib/types/member";
import { ApiResponse } from "@/lib/types/common";
import { useAuthStore } from "@/lib/store/authStore";

interface ProfileMutationVariables {
  userId: string;
  formData: FormData;
}

/**
 * 프로필 수정 React Query Mutation 훅
 *
 * @returns useMutation 결과 객체
 */
export function useProfileMutation() {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  return useMutation<ApiResponse<ProfileData>, Error, ProfileMutationVariables>(
    {
      mutationFn: ({ userId, formData }) => {
        return memberApi.updateProfile(userId, formData);
      },
      onSuccess: (data, variables) => {
        // 1. 프로필 쿼리 캐시 무효화 (최신 데이터 다시 가져오기)
        queryClient.invalidateQueries({
          queryKey: ["profile", variables.userId],
        });

        // 2. authStore의 user 정보 업데이트
        if (data.data) {
          updateUser({
            nickname: data.data.nickname,
            image: data.data.imageUrl,
            introduction: data.data.introduction,
          });
        }
      },
      onError: (error) => {
        console.error("프로필 수정 실패:", error);
      },
      retry: 0,
    }
  );
}
