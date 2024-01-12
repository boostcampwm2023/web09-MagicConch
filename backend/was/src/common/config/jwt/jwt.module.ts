import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({})
export class JwtConfigModule {
  static register(): DynamicModule {
    return {
      module: JwtConfigModule,
      imports: [
        JwtModule.registerAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService): JwtModule => {
            return {
              secret: configService.get('JWT_SECRET_KEY'),
              signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
            };
          },
        }),
      ],
      exports: [JwtModule],
    };
  }
}
