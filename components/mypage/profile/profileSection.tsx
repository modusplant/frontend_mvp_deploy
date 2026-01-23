"use client";

import { useAuthStore } from "@/lib/store/authStore";
import { useProfileMutation } from "@/lib/hooks/mypage/useProfileMutation";
import { useProfileForm } from "@/lib/hooks/mypage/useProfileForm";
import ProfileImageUploader from "./profileImageUploader";
import ProfileFormFields from "./profileFormFields";
import Button from "@/components/_common/button";
import { showModal } from "@/lib/store/modalStore";

export default function ProfileSection() {
  const { user } = useAuthStore();
  const userId = user?.id || null;

  // 프로필 수정 Mutation
  const { mutate: updateProfile, isPending } = useProfileMutation();

  // 폼 상태 관리
  const {
    formData,
    hasChanges,
    handleNicknameChange,
    handleIntroductionChange,
    handleImageSelect,
    handleImageDelete,
    createFormData,
  } = useProfileForm();

  // 저장 핸들러
  const handleSave = () => {
    if (!userId) return;
    if (!hasChanges) return;

    const data = createFormData();
    updateProfile(
      { userId, formData: data },
      {
        onSuccess: () => {
          showModal({
            type: "snackbar",
            description: "프로필이 성공적으로 수정되었습니다.",
          });
        },
        onError: (error) => {
          showModal({
            type: "snackbar",
            description: error.message || "프로필 수정에 실패했습니다.",
          });
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 프로필 정보 카드 */}
      <div className="border-surface-98 flex flex-col gap-[30px] rounded-xl border bg-white p-10">
        <h2 className="text-neutral-5 text-[18px] leading-[1.2] font-semibold tracking-[-0.01em]">
          프로필 정보
        </h2>

        <div className="flex flex-col gap-11">
          {/* 프로필 이미지 업로더 */}
          <ProfileImageUploader
            imagePreview={formData.imagePreview}
            onImageSelect={handleImageSelect}
            onImageDelete={handleImageDelete}
          />

          {/* 닉네임 입력 필드 */}
          <ProfileFormFields
            nickname={formData.nickname}
            introduction={formData.introduction}
            onNicknameChange={handleNicknameChange}
            onIntroductionChange={handleIntroductionChange}
          />
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="border-surface-98 flex justify-end border-t pt-3">
        <Button
          variant={hasChanges && !isPending ? "point" : "deactivate"}
          size="md"
          onClick={handleSave}
          disabled={!hasChanges || isPending}
          className="h-[50px] rounded-full px-5 text-[15px] font-medium"
        >
          {isPending ? "저장 중..." : "변경사항 저장"}
        </Button>
      </div>
    </div>
  );
}
