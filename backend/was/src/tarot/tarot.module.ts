import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'src/logger/logger.module';
import { LoggerService } from 'src/logger/logger.service';
import { TarotCardPack } from './entities/tarot-card-pack.entity';
import { TarotCard } from './entities/tarot-card.entity';
import { TarotResult } from './entities/tarot-result.entity';
import { TarotController } from './tarot.controller';
import { TarotService } from './tarot.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TarotCard, TarotResult, TarotCardPack]),
    LoggerModule,
  ],
  controllers: [TarotController],
  providers: [TarotService, LoggerService],
})
export class TarotModule {}
