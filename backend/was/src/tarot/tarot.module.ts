import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TarotCard, TarotCardPack, TarotResult } from './entities';
import { TarotController } from './tarot.controller';
import { TarotService } from './tarot.service';

@Module({
  imports: [TypeOrmModule.forFeature([TarotCard, TarotResult, TarotCardPack])],
  controllers: [TarotController],
  providers: [TarotService],
})
export class TarotModule {}
