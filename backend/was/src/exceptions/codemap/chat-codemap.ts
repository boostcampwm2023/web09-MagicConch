import { ExceptionCodemap } from './type';

export const CHAT_CODEMAP: ExceptionCodemap = {
  ROOM_NOT_FOUND: {
    status: 404,
    message: '채팅방을 찾을 수 없습니다.',
    code: 'MCE001',
    description: '요청에 포함된 채팅방 아이디가 존재하지 않습니다.',
  },
  ROOM_UPDATE_FORBIDDEN: {
    status: 403,
    message: '채팅방을 수정할 수 없습니다.',
    code: 'MCE002',
    description:
      '요청한 사용자가 해당 채팅방의 수정 권한을 가지고 있지 않습니다.',
  },
  ROOM_DELETE_FORBIDDEN: {
    status: 403,
    message: '채팅방을 삭제할 수 없습니다.',
    code: 'MCE003',
    description:
      '요청한 사용자가 해당 채팅방의 삭제 권한을 가지고 있지 않습니다.',
  },
};
