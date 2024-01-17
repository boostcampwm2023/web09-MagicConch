import { ChattingRoom } from 'src/chat/entities';
import { Member } from 'src/members/entities';
import { v4 as uuidv4 } from 'uuid';
import { memberMock } from '../members';

function makeRoomMock(roomId: string, memberMock: Member): ChattingRoom {
  const roomMock: ChattingRoom = new ChattingRoom();
  roomMock.id = roomId;
  roomMock.title = 'chatting room title';
  roomMock.participant = memberMock;
  return roomMock;
}

export const roomId: string = uuidv4();

export const wrongRoomId: string = uuidv4();

export const roomMock = makeRoomMock(roomId, memberMock);
