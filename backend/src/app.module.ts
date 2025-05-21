import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConnectionsModule } from './connections/connections.module';
import { HashtagsModule } from './hashtags/hashtags.module';
import { SubdomainsModule } from './subdomains/subdomains.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { PrismaService } from './common/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    ConnectionsModule,
    HashtagsModule,
    SubdomainsModule,
    SubscriptionsModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
