import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/members/entities/member.entity';
import { MembersService } from 'src/members/members.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  controllers: [AuthController],
  providers: [AuthService, MembersService],
})
export class AuthModule {}
