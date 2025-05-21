import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateOAuthLogin(profile: any, provider: string) {
    // Find or create user based on OAuth profile
    let user = await this.prisma.user.findFirst({
      where: {
        socialAccounts: {
          some: {
            provider,
            providerId: profile.id,
          },
        },
      },
    });

    if (!user) {
      // Create new user if not exists
      user = await this.prisma.user.create({
        data: {
          email: profile.emails[0].value,
          fullName: profile.displayName,
          avatar: profile.photos?.[0]?.value,
          socialAccounts: {
            create: {
              provider,
              providerId: profile.id,
              accessToken: profile.accessToken,
              refreshToken: profile.refreshToken,
            },
          },
        },
      });
    } else {
      // Update existing social account
      await this.prisma.socialAccount.updateMany({
        where: {
          userId: user.id,
          provider,
          providerId: profile.id,
        },
        data: {
          accessToken: profile.accessToken,
          refreshToken: profile.refreshToken,
        },
      });
    }

    return this.generateToken(user);
  }

  generateToken(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
      },
    };
  }
}
