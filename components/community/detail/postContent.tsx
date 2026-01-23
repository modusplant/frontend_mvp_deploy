"use client";

import { useState } from "react";
import Image from "next/image";
import { ContentPart } from "@/lib/types/post";
import ImageModal from "./imageModal";

interface PostContentProps {
  content: ContentPart[];
}

// URL을 감지하고 링크로 변환하는 함수
function parseTextWithLinks(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      try {
        const url = new URL(part);
        const displayText = url.hostname.replace(/^www\./, "");

        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-50 hover:text-primary-40 break-all underline decoration-1 underline-offset-2 transition-colors"
          >
            {displayText}
          </a>
        );
      } catch {
        return part;
      }
    }
    return part;
  });
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
                className="text-neutral-20 mb-4 text-[16px] leading-relaxed break-words whitespace-pre-wrap"
              >
                {parseTextWithLinks(item.data || "")}
              </p>
            );
          }

          if (item.type === "image") {
            return (
              <div
                key={`image-${index}`}
                className="my-6 cursor-pointer"
                onClick={() => setSelectedImage(item.src || null)}
              >
                <Image
                  src={item.src || ""}
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
