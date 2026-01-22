/**
 * 인증 관련 상수
 */

/** AccessToken 쿠키 이름 */
export const ACCESS_TOKEN_COOKIE_NAME = "accessToken";

/** AccessToken 쿠키 만료 시간 (30분, 초 단위) */
export const ACCESS_TOKEN_MAX_AGE = 30 * 60;

/** RememberMe 쿠키 만료 시간 (1주일, 초 단위) */
export const REMEMBER_ME_MAX_AGE = 7 * 24 * 60 * 60;

/** RefreshToken 쿠키 만료 시간 (7일, 초 단위) */
export const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60;
