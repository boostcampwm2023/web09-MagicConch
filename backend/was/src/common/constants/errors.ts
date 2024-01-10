export const ERR_MSG = {
  /**
   * chat
   */
  CHATTING_ROOM_NOT_FOUND: '채팅방을 찾을 수 없습니다.',
  UPDATE_CHATTING_ROOM_FORBIDDEN: '채팅방을 수정할 수 없습니다.',
  DELETE_CHATTING_ROOM_FORBIDDEN: '채팅방을 삭제할 수 없습니다.',

  /**
   * tarot
   */
  TAROT_CARD_NOT_FOUND: '타로 카드를 찾을 수 없습니다.',
  TAROT_RESULT_NOT_FOUND: '타로 결과를 찾을 수 없습니다.',

  /**
   * oauth
   */
  OAUTH_KAKAO_AUTH_CODE_FAILED: '카카오 인가코드 발급에 실패했습니다',
  OAUTH_KAKAO_LOGOUT_FAILED: '카카오 로그아웃에 실패했습니다.',
  OAUTH_KAKAO_TOKEN_FAILED: '카카오 토큰 발급에 실패했습니다.',
  OAUTH_KAKAO_OIDC_USER_INFO_FAILED:
    '카카오 OIDC 사용자 정보 조회에 실패했습니다',
  OAUTH_KAKAO_USER_INFO_FAILED: '카카오 사용자 정보 조회에 실패했습니다.',

  /**
   * database
   */
  NOT_UNIQUE: '이미 존재하는 데이터 입니다.',
  INVALID_FOREIGN_KEY: '유효하지 않은 외래키 입니다.',
  UNKNOWN_DATABASE: '알 수 없는 데이터베이스 오류가 발생했습니다.',
  OPTIMISTIC_LOCK: '다른 사용자에 의해 데이터가 변경되었습니다.',
  ETIMEOUT: '커넥션 타임아웃이 발생했습니다.',

  /**
   * socket
   */
  SAVE_CHATTING_LOG: '채팅 로그를 저장하는 데 실패했습니다.',
  SAVE_TAROT_RESULT: '타로 결과를 저장하는 데 실패했습니다.',

  /**
   * common
   */
  UNKNOWN: '알 수 없는 오류가 발생했습니다.',
};
