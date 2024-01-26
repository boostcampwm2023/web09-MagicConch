import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config();

@Global()
@Module({})
export class JwtConfigModule {
  static register(): DynamicModule {
    return {
      module: JwtConfigModule,
      imports: [
        JwtModule.registerAsync({
          useFactory: (): JwtModule => {
            return {
              secret: process.env.JWT_SECRET_KEY,
              signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
            };
          },
        }),
      ],
      exports: [JwtModule],
    };
  }
}
