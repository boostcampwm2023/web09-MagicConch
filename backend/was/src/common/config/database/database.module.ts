import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [],
          autoLoadEntities: true,
          namingStrategy: new SnakeNamingStrategy(),
          extra: {
            connectionLimit: 10,
            connectTimeout: 15000,
            acquireTimeout: 15000,
          },
        };
      },
    }),
  ],
})
export class DatabaseModule {}
