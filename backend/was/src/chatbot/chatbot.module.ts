import { Module } from '@nestjs/common';
import { ClovaStudioService } from './clova-studio/clova-studio.service';

@Module({
  providers: [{ provide: 'ChatbotService', useClass: ClovaStudioService }],
  exports: ['ChatbotService'],
})
export class ChatbotModule {}
