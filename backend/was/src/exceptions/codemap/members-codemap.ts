import { ExceptionCodemap } from './type';

export const MEMBERS_CODEMAP: ExceptionCodemap = {
  NOT_FOUND: {
    status: 404,
    message: '사용자를 찾을 수 없습니다.',
    code: 'MME001',
    description:
      '해당 이메일에 해당하는 사용자가 존재하지 않습니다. 쿠키에 들어있는 email, providerId가 올바른지 확인해주세요.',
  },
};
