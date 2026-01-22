"use client";

import { Input } from "@/components/_common/input";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import Button from "@/components/_common/button";
import { authApi } from "@/lib/api/client/auth";
import { ApiError } from "@/lib/types/common";
import { showModal } from "@/lib/store/modalStore";
import { z } from "zod";
import { emailSchema } from "@/lib/constants/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const requestEmailSchema = z.object({
  email: emailSchema,
});

type EmailFormValues = z.infer<typeof requestEmailSchema>;
/**
 * 비밀번호 재설정 이메일 요청 폼
 * - 사용자의 이메일을 입력받아 비밀번호 재설정 메일을 발송합니다
 */
export default function RequestEmailForm() {
  const { user } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(requestEmailSchema),
    defaultValues: {
      email: user?.email || "",
    },
  });

  const onSubmit = async (data: EmailFormValues) => {
    try {
      const response = await authApi.requestPasswordResetEmail(data.email);
      if (response.status === 200) {
        showModal({
          type: "snackbar",
          description: "비밀번호 재설정 메일이 발송되었습니다.",
        });
      }
    } catch (err) {
      const error = err as ApiError;
      if (error.code === "invalid_input") {
        setError("email", { message: "입력을 확인해주세요." });
        return;
      }

      if (error.code === "member_not_found_with_email") {
        setError("email", { message: "등록된 이메일이 아닙니다." });
        return;
      }

      setError("email", {
        message: "비밀번호 재설정 메일 발송에 실패했습니다. 다시 시도해주세요.",
      });
    }
  };

  return (
    <div className="mx-auto w-[480px] p-10">
      {/* 뒤로가기 버튼 */}
      <div>
        <button
          onClick={() => router.back()}
          className="border-neutral-90 hover:bg-surface-98 mb-4 rounded-full border p-2 transition-colors"
          aria-label="뒤로가기"
        >
          <ArrowLeft className="text-neutral-20 h-4 w-4" />
        </button>
      </div>

      {/* 페이지 제목 */}
      <div className="mt-6 mb-10 flex flex-col gap-6 text-center">
        <h1 className="text-2xl font-bold">비밀번호 재설정</h1>

        <h2 className="text-neutral-20">
          가입 시 등록했던 이메일로 <br /> 비밀번호를 변경할 수 있는 메일을
          보내드릴게요.
        </h2>
      </div>

      {/* 이메일 요청 폼 */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-10"
      >
        <div className="space-y-2">
          <p>이메일</p>
          <Input
            type="email"
            {...register("email")}
            placeholder="이메일을 입력해주세요."
          />
          {errors.email && (
            <div className="text-system-alert mt-1 text-sm">
              {errors.email.message}
            </div>
          )}
        </div>

        <Button
          type="submit"
          variant="point"
          size="lg"
          className="rounded-lg"
          disabled={isSubmitting || isSubmitSuccessful}
        >
          전송하기
        </Button>
      </form>
    </div>
  );
}
