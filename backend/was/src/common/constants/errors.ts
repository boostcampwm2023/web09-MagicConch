export const ERR_MSG = {
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
