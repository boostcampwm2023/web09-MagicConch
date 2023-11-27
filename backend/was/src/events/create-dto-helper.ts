import { CreateChattingMessageDto } from 'src/chat/dto/create-chatting-message.dto';
import { CreateTarotResultDto } from 'src/tarot/dto/create-tarot-result.dto';
import type { Chat } from './type';

const bucketUrl: string = 'https://kr.object.ncloudstorage.com/magicconch';

export function result2createTarotResultDto(cardIdx: number, result: string) {
  const createTarotResultDto = new CreateTarotResultDto();
  createTarotResultDto.cardUrl = `${bucketUrl}/basic/${cardIdx}.jpg`;
  createTarotResultDto.message = result;

  return createTarotResultDto;
}

export function chatLog2createChattingMessageDtos(
  chatLog: Chat[],
): CreateChattingMessageDto[] {
  const parsingMessage: CreateChattingMessageDto[] = chatLog
    .map(chat2MessageDTO)
    .filter(isCreateChattingMessageDto);

  return parsingMessage.slice(0, -2).concat(parsingMessage.slice(-1));
}

function chat2MessageDTO(message: Chat): CreateChattingMessageDto | undefined {
  const messageDto = new CreateChattingMessageDto();

  if (message.role === 'system') {
    return undefined;
  }
  messageDto.isHost = message.role === 'assistant';
  messageDto.message = message.content;

  return messageDto;
}

function isCreateChattingMessageDto(
  message: CreateChattingMessageDto | undefined,
): message is CreateChattingMessageDto {
  return message instanceof CreateChattingMessageDto;
}
