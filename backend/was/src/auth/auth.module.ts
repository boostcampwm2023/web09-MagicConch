import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from 'src/members/entities/member.entity';
import { MembersService } from 'src/members/members.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET_KEY'),
          signOptions: { expiresIn: 'JWT_EXPIRES_IN' },
        };
      },
    }),
    TypeOrmModule.forFeature([Member]),
  ],
  controllers: [AuthController],
  providers: [AuthService, MembersService],
})
export class AuthModule {}
