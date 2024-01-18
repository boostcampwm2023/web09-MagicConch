import { ChattingRoom } from 'src/chat/entities';
import { Member } from 'src/members/entities';
import { memberMock } from '../members';

function makeRoomMock(roomId: string, memberMock: Member): ChattingRoom {
  const roomMock: ChattingRoom = new ChattingRoom();
  roomMock.id = roomId;
  roomMock.title = 'chatting room title';
  roomMock.participant = memberMock;
  return roomMock;
}

export const roomId: string = 'roomId';

export const wrongRoomId: string = 'wrongRoomId';

export const roomMock = makeRoomMock(roomId, memberMock);
