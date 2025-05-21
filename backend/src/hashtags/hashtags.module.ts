import { Module } from '@nestjs/common';
import { HashtagsService } from './hashtags.service';
import { HashtagsController } from './hashtags.controller';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [HashtagsController],
  providers: [HashtagsService, PrismaService],
  exports: [HashtagsService],
})
export class HashtagsModule {}
