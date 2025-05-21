import { Module } from '@nestjs/common';
import { SubdomainsService } from './subdomains.service';
import { SubdomainsController } from './subdomains.controller';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [SubdomainsController],
  providers: [SubdomainsService, PrismaService],
  exports: [SubdomainsService],
})
export class SubdomainsModule {}
