import { Module, OnApplicationShutdown } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return {
          type: 'mysql',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT ?? '3306'),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          synchronize: true,
          autoLoadEntities: true,
          namingStrategy: new SnakeNamingStrategy(),
          logging: ['query', 'error'],
          logger: 'file',
        };
      },
    }),
  ],
})
export class MysqlModule implements OnApplicationShutdown {
  constructor(private readonly dataSource: DataSource) {}

  async onApplicationShutdown(signal?: string): Promise<void> {
    if (this.dataSource.isInitialized) {
      await this.dataSource.destroy();
    }
  }
}
