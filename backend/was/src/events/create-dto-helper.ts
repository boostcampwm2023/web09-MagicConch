import { CreateChattingMessageDto } from 'src/chat/dto/create-chatting-message.dto';
import type { Chat } from './type';

export function chatLog2createChattingMessageDtos(
  chatLog: Chat[],
): CreateChattingMessageDto[] {
  const parsingMessage: CreateChattingMessageDto[] = chatLog
    .map(chat2MessageDTO)
    .filter(isCreateChattingMessageDto);

  return parsingMessage.slice(0, -2).concat(parsingMessage.slice(-1));
}

function chat2MessageDTO(message: Chat): CreateChattingMessageDto | undefined {
  if (message.role === 'system') {
    return undefined;
  }
  const messageDto: CreateChattingMessageDto = new CreateChattingMessageDto();
  messageDto.isHost = message.role === 'assistant';
  messageDto.message = message.content;
  return messageDto;
}

function isCreateChattingMessageDto(
  message: CreateChattingMessageDto | undefined,
): message is CreateChattingMessageDto {
  return message instanceof CreateChattingMessageDto;
}
