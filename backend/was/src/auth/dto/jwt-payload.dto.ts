export class JwtPayloadDto {
  readonly email: string;
  readonly providerId: number;
  readonly accessToken: string;

  static fromInfo(
    email: string,
    providerId: number,
    accessToken: string,
  ): JwtPayloadDto {
    return {
      email: email,
      providerId: providerId,
      accessToken: accessToken,
    };
  }
}
