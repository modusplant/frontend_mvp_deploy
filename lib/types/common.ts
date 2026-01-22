/**
 * API 공통 응답 구조
 */
export interface ApiResponse<T = any> {
  status: number;
  code: string;
  message: string;
  data?: T;
}

/**
 * API 에러
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}
