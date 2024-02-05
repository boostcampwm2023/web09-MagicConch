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
import { JwtAuthGuard } from 'src/auth/guard';
import {
  DeleteRoomDecorator,
  FindMessagesDecorator,
  FindRoomsDecorator,
  UpdateRoomDecorator,
} from './chat.decorators';
import { ChatService } from './chat.service';
import {
  ChattingMessageDto,
  ChattingRoomDto,
  UpdateChattingRoomDto,
} from './dto';

@UseGuards(JwtAuthGuard)
@Controller('chat')
@ApiTags('✅Chatting API')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('ai')
  @FindRoomsDecorator('채팅방', [ChattingRoomDto])
  async findRooms(@Req() req: any): Promise<ChattingRoomDto[]> {
    return await this.chatService.findRoomsByEmail(
      req.user.email,
      req.user.providerId,
    );
  }

  @Get('ai/:id')
  @FindMessagesDecorator('채팅 메시지', { type: 'uuid', name: 'id' }, [
    ChattingMessageDto,
  ])
  async findMessages(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
  ): Promise<ChattingMessageDto[]> {
    return await this.chatService.findMessagesById(
      id,
      req.user.email,
      req.user.providerId,
    );
  }

  @Patch('ai/:id')
  @UpdateRoomDecorator(
    '채팅방 제목',
    { type: 'uuid', name: 'id' },
    { type: UpdateChattingRoomDto },
  )
  async updateRoom(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
    @Body() updateChattingRoomDto: UpdateChattingRoomDto,
  ): Promise<void> {
    await this.chatService.updateRoom(
      id,
      req.user.email,
      req.user.providerId,
      updateChattingRoomDto,
    );
  }

  @Delete('ai/:id')
  @DeleteRoomDecorator('채팅방', { type: 'uuid', name: 'id' })
  async removeRoom(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
  ): Promise<void> {
    await this.chatService.removeRoom(id, req.user.email, req.user.providerId);
  }
}
