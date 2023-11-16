import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TarotCard } from './entities/tarot-card.entity';
import { TarotResult } from './entities/tarot-result.entity';
import { TarotController } from './tarot.controller';
import { TarotService } from './tarot.service';

@Module({
  imports: [TypeOrmModule.forFeature([TarotCard, TarotResult])],
  controllers: [TarotController],
  providers: [TarotService],
})
export class TarotModule {}
