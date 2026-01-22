import Link from "next/link";
import { Input } from "@/components/_common/input";
import { Button } from "@/components/_common/button";
import { formatDate } from "@/lib/utils/formatTime";

interface EmailInfoSectionProps {
  email: string;
  createdAt?: string;
  onChangeEmail?: () => void;
}

/**
 * 이메일 정보 섹션
 * - 이메일 표시 (읽기 전용)
 * - 가입일 표시
 * - 이메일 변경 버튼
 */
export default function EmailInfoSection({
  email,
  createdAt,
  onChangeEmail,
}: EmailInfoSectionProps) {
  return (
    <div className="border-surface-98 flex flex-col gap-[30px] rounded-xl border bg-white p-10">
      <h2 className="text-neutral-5 text-[17px] leading-[1.2] font-semibold tracking-[-0.01em]">
        이메일 정보
      </h2>

      <div className="flex flex-col gap-3">
        <label className="text-neutral-0 text-base leading-normal font-medium tracking-[-0.02em]">
          이메일
        </label>
        <Input type="email" value={email} disabled className="flex-1" />
        <p className="text-neutral-60 text-sm leading-normal">
          가입일: {createdAt ? formatDate(createdAt) : "-"}
        </p>
        <hr className="border-surface-stroke-2" />
        <div>
          <Button variant="point2" size="md" onClick={onChangeEmail}>
            이메일 변경하기
          </Button>
        </div>
      </div>
    </div>
  );
}
