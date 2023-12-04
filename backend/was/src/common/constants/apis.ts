/**
 * for Swagger
 */
export const CRUD = {
  SELECT: '조회',
  CREATE: '생성',
  UPDATE: '수정',
  DELETE: '삭제',
};

export const API_MSG = {
  UNAUTH: '인증 받지 않는 사용자',
  FORBIDDEN: '인가 받지 않은 사용자',
};

export type CrudOperation = (typeof CRUD)[keyof typeof CRUD];
