import Image from "next/image";
import { cn } from "@/lib/utils/tailwindHelper";

type ProfileProps = {
  className?: string;
  imageSrc?: string | null;
};

export default function ProfileImage({ className, imageSrc }: ProfileProps) {
  return imageSrc ? (
    <Image
      src={imageSrc}
      alt="프로필 이미지"
      className={cn("rounded-full object-cover", className)}
      fill
    />
  ) : (
    <Image
      src="/icon/default_profile.svg"
      alt="기본 프로필 이미지"
      className={cn("rounded-full object-cover", className)}
      fill
    />
  );
}
