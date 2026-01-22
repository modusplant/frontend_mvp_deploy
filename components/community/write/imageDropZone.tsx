interface ImageDropZoneProps {
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export default function ImageDropZone({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
}: ImageDropZoneProps) {
  return (
    <div
      className={`mt-4 flex min-h-[120px] items-center justify-center rounded-lg border-2 border-dashed ${
        isDragging ? "border-primary-50 bg-primary-10" : "border-surface-stroke"
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <p className="text-neutral-60 text-sm">
        이미지를 드래그하여 업로드하거나 버튼을 클릭하세요
      </p>
    </div>
  );
}
