"use client";

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

export default function TitleInput({
  value,
  onChange,
  maxLength = 60,
}: TitleInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  return (
    <div className="border-surface-stroke flex items-center justify-between gap-68 self-stretch rounded-[10px] border px-4.5 py-4.5">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="제목을 입력해주세요."
        className="text-neutral-20 placeholder:text-neutral-60 flex-1 text-lg leading-normal font-normal tracking-[-0.01em] focus:outline-none"
      />
      <span className="text-[15px] leading-[1.4] font-normal tracking-[-0.04em] text-[#A9A9A9]">
        {value.length} / {maxLength}
      </span>
    </div>
  );
}
