/**
 * 비밀번호 유효성 검사 함수
 */
export const validatePassword = (password: string) => {
  const minLength = password.length >= 8;
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[@$!%*?&#]/.test(password);

  return {
    isValid:
      minLength && hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar,
    requirements: {
      minLength,
      hasLowerCase,
      hasUpperCase,
      hasNumber,
      hasSpecialChar,
    },
  };
};
