import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/guard';
import { MemberDto } from './dto/member.dto';
import { FindMemberByEmailDecorator } from './members.decorators';
import { MembersService } from './members.service';

@UseGuards(JwtAuthGuard)
@Controller('/members')
@ApiTags('✅ Members API')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  @FindMemberByEmailDecorator('사용자 정보', MemberDto)
  async findMemberByEmail(@Req() req: any): Promise<MemberDto> {
    return await this.membersService.findMemberByEmail(
      req.user.email,
      req.user.providerId,
    );
  }
}
