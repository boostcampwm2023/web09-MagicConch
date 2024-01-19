export const ERR_MSG = {
  /**
   * auth
   */
  UNAUTHORIZED_USER: '로그인이 필요한 서비스입니다.',

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
  OAUTH_KAKAO_TOKEN_FAILED: '카카오 토큰 발급에 실패했습니다.',
  OAUTH_KAKAO_USER_FAILED: '카카오 사용자 정보 조회에 실패했습니다.',
  OAUTH_KAKAO_ACCESS_TOKEN_INFO_KAKAO_ERROR:
    '카카오 플랫폼에서 일시적인 장애가 발생했습니다.',
  OAUTH_KAKAO_ACCESS_TOKEN_INFO_BAD_REQUEST:
    '카카오 액세스 토큰 정보 조회에 실패했습니다.',

  /**
   * chatbot
   */
  USER_CHAT_MESSAGE_INPUT_EMPTY: '사용자 입력한 채팅 메세지가 비어있습니다.',
  USER_CHAT_MESSAGE_INPUT_TOO_LONG: '사용자 입력한 채팅 메세지가 너무 깁니다.',
  TAROT_CARD_IDX_OUT_OF_RANGE: '타로 카드 인덱스가 범위를 벗어났습니다.',
  AI_API_KEY_NOT_FOUND: 'API 키를 찾을 수 없습니다.',
  AI_API_FAILED: '인공지능 API 호출에 실패했습니다.',
  AI_API_RESPONSE_EMPTY: '인공지능 API 응답이 비어있습니다.',

  /**
   * socket
   */
  CREATE_ROOM: '채팅방을 생성하는 데 실패했습니다.',
  SAVE_CHATTING_LOG: '채팅 로그를 저장하는 데 실패했습니다.',
  SAVE_TAROT_RESULT: '타로 결과를 저장하는 데 실패했습니다.',
  HANDLE_MESSAGE: '서버에서 메시지를 처리하는 데 실패했습니다.',

  /**
   * common
   */
  UNKNOWN: '알 수 없는 오류가 발생했습니다.',
};

export const JWT_ERR = {
  TOKEN_EXPIRED: { code: 4000, message: 'TokenExpiredError' },
  JSON_WEB_TOKEN: { code: 4000, message: 'JsonWebTokenError' },
  NOT_BEFORE_ERROR: { code: 4000, message: 'NotBeforeError' },
};
