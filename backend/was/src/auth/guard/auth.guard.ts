import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { ERR_MSG, JWT_ERR } from 'src/common/constants/errors';
import { JwtError } from 'src/common/errors/jwt.error';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: any = context.switchToHttp().getRequest();
    const token: string | null = req.cookies.magicconch;
    if (!token) {
      throw new UnauthorizedException(ERR_MSG.JWT_NOT_FOUND);
    }
    const decoded: JwtPayloadDto = this.verifyToken(token);
    req.user = decoded;
    return true;
  }

  private verifyToken(token: string): JwtPayloadDto {
    try {
      return this.jwtService.verify(token);
    } catch (err: unknown) {
      this.handleVerificationError(err);
      throw err;
    }
  }

  /**
   * https://github.com/auth0/node-jsonwebtoken?tab=readme-ov-file#errors--codes
   */
  private handleVerificationError(err: any): void {
    if (err.name)
      switch (err.name) {
        case JWT_ERR.TOKEN_EXPIRED.message:
          throw new JwtError(JWT_ERR.TOKEN_EXPIRED);
        case JWT_ERR.JSON_WEB_TOKEN.message:
          throw new JwtError(JWT_ERR.JSON_WEB_TOKEN);
        case JWT_ERR.NOT_BEFORE_ERROR.message:
          throw new JwtError(JWT_ERR.NOT_BEFORE_ERROR);
      }
  }
}
