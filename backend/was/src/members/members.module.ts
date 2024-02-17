import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
})
export class MembersModule {}
