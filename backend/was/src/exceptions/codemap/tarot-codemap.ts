import { ExceptionCodemap } from './type';

export const TAROT_CODEMAP: ExceptionCodemap = {
  CARD_NOT_FOUND: {
    status: 404,
    message: '타로 카드를 찾을 수 없습니다.',
    code: 'MTE001',
    description:
      '요청에 포함된 타로 카드 번호가 존재하지 않습니다. 해당 번호가 타로 카드 범위 내에 속하는지 확인해주세요.',
  },
  RESULT_NOT_FOUND: {
    status: 404,
    message: '타로 결과를 찾을 수 없습니다.',
    code: 'MTE002',
    description: '요청에 포함된 타로 결과 아이디가 존재하지 않습니다.',
  },
};
