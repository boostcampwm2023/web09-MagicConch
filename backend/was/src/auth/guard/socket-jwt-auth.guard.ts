import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { JwtPayloadDto } from '../dto';

@Injectable()
export class SocketJwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient();
    const cookie: string | null = client.handshake.headers.cookie;
    if (!cookie) {
      return true;
    }
    const token: string = cookie.replace('magicconch=', '');
    try {
      const decodedToken: JwtPayloadDto = this.verifyToken(token);
      client.user = {
        email: decodedToken.email,
        providerId: decodedToken.providerId,
      };
      return true;
    } catch (err: unknown) {
      throw err;
    }
  }

  private verifyToken(token: string): JwtPayloadDto {
    return this.jwtService.verify(token);
  }
}
