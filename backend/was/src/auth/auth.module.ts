import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/members/entities/member.entity';
import { MembersModule } from 'src/members/members.module';
import { MembersService } from 'src/members/members.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './guard/auth.guard';
import { AuthService } from './service/auth.service';
import { KakaoAuthService } from './service/kakao.auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Member]), MembersModule],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, KakaoAuthService, MembersService],
})
export class AuthModule {}
