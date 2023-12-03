import { CreateChattingMessageDto } from 'src/chat/dto/create-chatting-message.dto';
import type { Chat, Message } from './type';

export function createChattingMessageDtos(
  roomId: string,
  chatLog: Chat[],
): CreateChattingMessageDto[] {
  const messages: Message[] = chatLog.map((chat: Chat): Message => {
    return {
      roomId: roomId,
      chat: chat,
    };
  });
  const parsingMessage: CreateChattingMessageDto[] = messages
    .map(createChattingMessageDto)
    .filter(isCreateChattingMessageDto);
  return parsingMessage.slice(0, -2).concat(parsingMessage.slice(-1));
}

function createChattingMessageDto(
  message: Message,
): CreateChattingMessageDto | undefined {
  if (message.chat.role === 'system') {
    return undefined;
  }
  return CreateChattingMessageDto.fromMessage(message);
}

function isCreateChattingMessageDto(
  message: CreateChattingMessageDto | undefined,
): message is CreateChattingMessageDto {
  return message instanceof CreateChattingMessageDto;
}
