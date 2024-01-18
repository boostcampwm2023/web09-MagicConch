import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities';
import { MembersService } from './members.service';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  providers: [MembersService],
})
export class MembersModule {}
