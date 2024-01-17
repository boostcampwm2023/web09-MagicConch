import { ChattingMessage, ChattingRoom } from 'src/chat/entities';
import { Message } from 'src/events/type';
import { v4 as uuidv4 } from 'uuid';
import { roomMock } from './chatting-room.mocks';

function makeMessageMock(
  messageId: string,
  message: Message,
  roomMock: ChattingRoom,
): ChattingMessage {
  const messageMock: ChattingMessage = new ChattingMessage();
  messageMock.id = messageId;
  messageMock.isHost = message.chat.role === 'assistant';
  messageMock.message = message.chat.content;
  messageMock.room = roomMock;
  return messageMock;
}

const messageId: string = uuidv4();

export const message: Message = {
  roomId: roomMock.id,
  chat: {
    role: 'user',
    content: 'chatting message content',
  },
};

export const messageMock = makeMessageMock(messageId, message, roomMock);
