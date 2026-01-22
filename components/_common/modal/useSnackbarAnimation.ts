import { useEffect, useState } from "react";

export function useSnackbarAnimation(
  isVisible: boolean,
  hideModal: () => void
) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // 나타나는 애니메이션
      setIsAnimating(true);

      // 3초 후 사라지는 애니메이션 시작
      const hideTimer = setTimeout(() => {
        setIsAnimating(false);
      }, 3000);

      // 애니메이션 완료 후 실제로 숨김 (0.3초 애니메이션 시간)
      const removeTimer = setTimeout(() => {
        hideModal();
      }, 3300);

      return () => {
        clearTimeout(hideTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [isVisible, hideModal]);

  return isAnimating;
}
