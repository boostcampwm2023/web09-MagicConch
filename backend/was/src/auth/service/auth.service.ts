import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMemberDto } from 'src/members/dto/create-member.dto';
import { UpdateMemberDto } from 'src/members/dto/update-member.dto';
import { Member } from 'src/members/entities/member.entity';
import { MembersService } from 'src/members/members.service';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { OAuthTokenDto } from '../dto/oauth-token.dto';
import { ProfileDto } from '../dto/profile.dto';

@Injectable()
export class AuthService {
  clientId: string;
  redirectUri: string;
  clientSecret: string;

  constructor(
    @InjectRepository(Member)
    readonly membersService: MembersService,
    readonly jwtService: JwtService,
    readonly configService: ConfigService,
  ) {}

  init(provider: string) {
    this.clientId = this.configService.get(`${provider}_CLIENT_ID`) ?? '';
    this.redirectUri = this.configService.get(`${provider}_REDIRECT_URI`) ?? '';
    this.clientSecret =
      this.configService.get(`${provider}_CLIENT_SECRET`) ?? '';
  }

  async signup(
    providerId: number,
    profile: ProfileDto,
    token: OAuthTokenDto,
  ): Promise<string> {
    const createMemberDto: CreateMemberDto = CreateMemberDto.fromProfile(
      providerId,
      token.refresh_token,
      profile,
    );
    await this.membersService.create(createMemberDto);
    return this.makeToken(profile.email, providerId, token.access_token);
  }

  async login(
    id: string,
    providerId: number,
    profile: ProfileDto,
    token: OAuthTokenDto,
  ): Promise<string> {
    await this.membersService.update(
      id,
      UpdateMemberDto.fromProfile(providerId, token.refresh_token, profile),
    );
    return this.makeToken(profile.email, providerId, token.access_token);
  }

  makeToken(email: string, providerId: number, accessToken: string): string {
    const payload: JwtPayloadDto = JwtPayloadDto.fromInfo(
      email,
      providerId,
      accessToken,
    );
    return this.signPayload(payload);
  }

  private signPayload(payload: JwtPayloadDto): string {
    return this.jwtService.sign(payload);
  }
}
