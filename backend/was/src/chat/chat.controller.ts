import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuard } from 'src/common/auth/auth.guard';
import {
  DeleteRoomDecorator,
  FindMessagesDecorator,
  FindRoomsDecorator,
  UpdateRoomDecorator,
} from 'src/common/decorators/swagger/chat.decorator';
import { ChatService } from './chat.service';
import { ChattingMessageResponseDto } from './dto/chatting-messag-response.dto';
import { ChattingRoomResponseDto } from './dto/chatting-room-response.dto';
import { UpdateChattingRoomDto } from './dto/update-chatting-room.dto';

@UseGuards(AuthGuard)
@Controller('chat')
@ApiTags('✅Chatting API')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('ai')
  @FindRoomsDecorator('채팅방', [ChattingRoomResponseDto])
  async findRooms(@Req() req: Request): Promise<ChattingRoomResponseDto[]> {
    return await this.chatService.findRoomsById(req.cookies.magicConch);
  }

  @Get('ai/:id')
  @FindMessagesDecorator('채팅 메시지', [ChattingMessageResponseDto], {
    type: 'uuid',
    name: 'id',
  })
  async findMessages(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ChattingMessageResponseDto[]> {
    return await this.chatService.findMessagesById(id);
  }

  @Patch('ai/:id')
  @UpdateRoomDecorator(
    '채팅방 제목',
    { type: 'uuid', name: 'id' },
    UpdateChattingRoomDto,
  )
  async updateRoom(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
    @Body() updateChattingRoomDto: UpdateChattingRoomDto,
  ): Promise<void> {
    await this.chatService.updateRoom(
      id,
      req.cookies.magicConch,
      updateChattingRoomDto,
    );
  }

  @Delete('ai/:id')
  @DeleteRoomDecorator('채팅방', { type: 'uuid', name: 'id' })
  async removeRoom(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ): Promise<void> {
    await this.chatService.removeRoom(id, req.cookies.magicConch);
  }
}
