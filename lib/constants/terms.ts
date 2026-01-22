/**
 * 약관 및 정책 내용 상수
 */

export interface TermsContent {
  title: string;
  items: string[];
}

/**
 * 서비스 이용약관
 */
export const TERMS_OF_SERVICE: TermsContent = {
  title: "[필수] 서비스 이용약관 동의",
  items: [
    "본 서비스는 회원 간 소통과 정보 공유를 위한 커뮤니티 플랫폼입니다.",
    "타인의 권리를 침해하거나 불법·부적절한 게시물은 제재될 수 있습니다.",
    "서비스 운영 정책 및 공지사항을 준수해야 합니다.",
  ],
};

/**
 * 개인정보 수집 및 이용 동의
 */
export const PRIVACY_POLICY: TermsContent = {
  title: "[필수] 개인정보 수집 및 이용 동의",
  items: [
    "회원가입 및 서비스 이용을 위해 닉네임, 이메일 등 기본 정보를 수집합니다.",
    "수집된 정보는 서비스 운영 및 고객 문의 응대에만 사용됩니다.",
    "개인정보는 회원 탈퇴 시 즉시 삭제됩니다.",
  ],
};

/**
 * 커뮤니티 운영정책
 */
export const COMMUNITY_GUIDELINES: TermsContent = {
  title: "[필수] 커뮤니티 운영정책 동의",
  items: [
    "욕설, 비방, 혐오, 음란, 광고성 콘텐츠는 등록이 제한됩니다.",
    "타인의 명예를 훼손하거나 불쾌감을 주는 활동은 금지됩니다.",
    "위반 시 게시물 삭제 및 이용 제한 등의 조치가 이루어질 수 있습니다.",
  ],
};

/**
 * 마케팅 정보 수신 동의 (선택)
 */
export const MARKETING_AGREEMENT: TermsContent = {
  title: "[선택] 마케팅 정보 수신 동의",
  items: [
    "신규 서비스, 이벤트, 혜택 등의 마케팅 정보를 제공받을 수 있습니다.",
    "마케팅 정보는 이메일, 앱 알림 등의 방법으로 전송됩니다.",
    "동의 철회는 언제든지 가능하며, 철회 시 마케팅 정보 제공이 중단됩니다.",
  ],
};

/**
 * 약관 정보 매핑
 */
export const TERMS_MAP = {
  terms: TERMS_OF_SERVICE,
  privacy: PRIVACY_POLICY,
  community: COMMUNITY_GUIDELINES,
  marketing: MARKETING_AGREEMENT,
} as const;

/**
 * 약관 레이블
 */
export const TERMS_LABELS = {
  terms: "[필수] 이용약관을 확인했으며 동의합니다.",
  privacy: "[필수] 개인정보처리방침을 확인했으며 동의합니다.",
  community: "[필수] 커뮤니티 운영정책을 확인했으며 동의합니다.",
  marketing: "[선택] 마케팅 정보 수신에 동의합니다.",
  all: "모든 약관 및 정책에 동의합니다.",
} as const;

/**
 * 필수 약관 목록
 */
export const REQUIRED_TERMS = ["terms", "privacy", "community"] as const;

/**
 * 선택 약관 목록
 */
export const OPTIONAL_TERMS = ["marketing"] as const;

/**
 * 전체 약관 목록
 */
export const ALL_TERMS = [...REQUIRED_TERMS, ...OPTIONAL_TERMS] as const;

export type TermsType = (typeof ALL_TERMS)[number];

/**
 * 약관 버전
 */
export const TERMS_VERSIONS = {
  termsOfUse: "v1.1.3",
  privacyPolicy: "v1.1.3",
  adInfoReceiving: "v2.0.7",
} as const;
