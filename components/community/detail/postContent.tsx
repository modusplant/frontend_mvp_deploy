"use client";

import { useState } from "react";
import Image from "next/image";
import { PostContent as PostContentType } from "@/lib/types/post";
import ImageModal from "./imageModal";

interface PostContentProps {
  content: PostContentType[];
}

export default function PostContent({ content }: PostContentProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // 텍스트와 이미지를 분리하여 순서대로 렌더링
  const textContent = content.filter((item) => item.type === "text");
  const imageContent = content.filter((item) => item.type === "image");

  const postContent = [...textContent, ...imageContent];

  return (
    <>
      <div className="prose prose-lg max-w-none">
        {postContent.map((item, index) => {
          if (item.type === "text") {
            return (
              <p
                key={`text-${index}`}
                className="font-pretendard text-neutral-20 mb-4 text-lg leading-relaxed whitespace-pre-wrap"
              >
                {item.data}
              </p>
            );
          }

          if (item.type === "image") {
            return (
              <div
                key={`image-${index}`}
                className="my-6 cursor-pointer"
                onClick={() => setSelectedImage(item.data)}
              >
                <Image
                  src={`data:image/png;base64,${item.data}`}
                  alt={item.filename || `이미지 ${index + 1}`}
                  width={800}
                  height={600}
                  className="rounded-lg"
                  priority={index === 0}
                />
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* 이미지 풀스크린 모달 */}
      {selectedImage && (
        <ImageModal
          imageData={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
}
