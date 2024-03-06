import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@auth/guard';
import { MemberDto } from './dto/member.dto';
import { MembersService } from './members.service';

@UseGuards(JwtAuthGuard)
@Controller('/members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  async findMemberByEmail(@Req() req: any): Promise<MemberDto> {
    return await this.membersService.findMemberByEmail(
      req.user.email,
      req.user.providerId,
    );
  }
}
