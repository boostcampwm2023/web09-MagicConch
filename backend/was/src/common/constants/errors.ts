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
   * database
   */
  NOT_UNIQUE: '이미 존재하는 데이터 입니다.',
  INVALID_FOREIGN_KEY: '유효하지 않은 외래키 입니다.',
  UNKNOWN_DATABASE: '알 수 없는 데이터베이스 오류가 발생했습니다.',
  OPTIMISTIC_LOCK: '다른 사용자에 의해 데이터가 변경되었습니다.',
  ETIMEOUT: '커넥션 타임아웃이 발생했습니다.',

  /**
   * chatbot
   */
  USER_INPUT_EMPTY: '사용자 입력이 비어있습니다.',
  USER_INPUT_TOO_LONG: '사용자 입력이 너무 깁니다.',
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

  /**
   * common
   */
  UNKNOWN: '알 수 없는 오류가 발생했습니다.',
};
