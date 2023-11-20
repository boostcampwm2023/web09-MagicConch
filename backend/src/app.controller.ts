// import { Controller, Get, Req, Res } from '@nestjs/common';
// import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
// import { Request, Response } from 'express';
// import { Member } from './members/entities/member.entity';

// //import { MembersService } from './members/members.service';

// @Controller()
// @ApiTags('✅Main API')
// export class AppController {
//   constructor(private readonly membersService: MembersService) {}

//   @Get()
//   @ApiOperation({ summary: '메인 페이지 접속' })
//   @ApiOkResponse({
//     description:
//       '7일간 접속 이력이 없는 사용자는 새롭게 레코드 생성 후 쿠키 부착',
//   })
//   async startPage(@Req() req: Request, @Res() res: Response): Promise<any> {
//     const magicConch: string | undefined = req.cookies.magicConch;
//     if (magicConch) {
//       res.cookie('magicConch', magicConch, {
//         httpOnly: true,
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//       });
//       return res.sendStatus(200);
//     }
//     const member: Member = await this.membersService.create();
//     res.cookie('magicConch', member.id, {
//       httpOnly: true,
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });
//     return res.sendStatus(200);
//   }
// }
