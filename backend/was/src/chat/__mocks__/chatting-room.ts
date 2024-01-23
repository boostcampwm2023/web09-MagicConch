import { UpdateChattingRoomDto } from 'src/chat/dto';
import { ChattingRoom } from 'src/chat/entities';
import { Member } from 'src/members/entities';
import { memberMock } from '../../mocks/members';

function makeRoomMock(roomId: string, memberMock: Member): ChattingRoom {
  const roomMock: ChattingRoom = new ChattingRoom();
  roomMock.id = roomId;
  roomMock.title = 'chatting room title';
  roomMock.participant = memberMock;
  return roomMock;
}

function makeUpdateRoomDtoMock(title: string): UpdateChattingRoomDto {
  const updateRoomDto: UpdateChattingRoomDto = new UpdateChattingRoomDto();
  updateRoomDto.title = title;
  return updateRoomDto;
}

export const roomId: string = '12345678-1234-5678-1234-567812345678';

export const wrongRoomId: string = '12345678-1234-5678-1234-567812345679';

export const roomMock: ChattingRoom = makeRoomMock(roomId, memberMock);

export const roomMocks: ChattingRoom[] = [roomMock];

export const updateRoomDtoMock: UpdateChattingRoomDto =
  makeUpdateRoomDtoMock('revised title');
