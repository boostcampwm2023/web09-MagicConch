import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TarotCardPack } from './entities/tarot-card-pack.entity';
import { TarotCard } from './entities/tarot-card.entity';
import { TarotResult } from './entities/tarot-result.entity';
import { TarotController } from './tarot.controller';
import { TarotService } from './tarot.service';

@Module({
  imports: [TypeOrmModule.forFeature([TarotCard, TarotResult, TarotCardPack])],
  controllers: [TarotController],
  providers: [TarotService],
})
export class TarotModule {}
