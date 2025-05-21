import { Controller, Get, Req, UseGuards, Param, NotFoundException, Patch, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../common/prisma.service';

@ApiTags('users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly prisma: PrismaService) {}

  @Get('self')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, description: 'Return current user' })
  async getMe(@Req() req: Request) {
    if (!req.user) {
      return { message: 'User not found' };
    }
    const user = req.user as any;
    return {
      data: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        joinedDate: user.joinedDate?.toISOString(),
        verificationLevel: user.verificationLevel,
        isActive: user.isActive,
        createdAt: user.createdAt?.toISOString(),
        updatedAt: user.updatedAt?.toISOString()
      }
    };
  }

  @Get(':id/profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile by ID' })
  @ApiResponse({ status: 200, description: 'Return user profile' })
  async getProfile(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // Expose prisma via a public method
    const prisma = (this.usersService as any).prisma || this.usersService['prisma'];
    const [connectionsCount, hashtagsCount, subdomainsCount] = await Promise.all([
      prisma.connection.count({
        where: {
          OR: [
            { fromUserId: id },
            { toUserId: id }
          ]
        }
      }),
      prisma.userHashtag.count({ where: { userId: id } }),
      prisma.subdomain.count({ where: { members: { some: { id } } } })
    ]);
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      username: user.email ? user.email.split('@')[0] : undefined,
      avatar: user.avatar,
      bio: user.bio || '',
      joinedDate: user.joinedDate?.toISOString(),
      verificationLevel: user.verificationLevel,
      isActive: user.isActive,
      createdAt: user.createdAt?.toISOString(),
      updatedAt: user.updatedAt?.toISOString(),
      socialAccounts: user.socialAccounts,
      hashtags: user.userHashtags.map(uh => ({
        id: uh.hashtag.id,
        name: uh.hashtag.name,
        description: uh.hashtag.description,
        strength: uh.strength
      })),
      connectionsCount,
      hashtagsCount,
      subdomainsCount
    };
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'User profile updated' })
  async updateProfile(@Param('id') id: string, @Body() body: { bio?: string }) {
    const data: any = {};
    if (body.bio !== undefined) data.bio = body.bio;
    const user = await this.usersService.update(id, data);
    return { success: true, user };
  }

  @Get('graph')
  @ApiOperation({ summary: 'Get all users and all connections (friendship and hashtag-based)' })
  async getGraph() {
    // Get all users
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        avatar: true,
        joinedDate: true,
        verificationLevel: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Get all friendship connections
    const connections = await this.prisma.connection.findMany({
      where: { isAccepted: true },
      select: {
        fromUserId: true,
        toUserId: true,
        strength: true,
      },
    });

    // Get all hashtag-based connections
    const userHashtags = await this.prisma.userHashtag.findMany({
      select: {
        userId: true,
        hashtagId: true,
        strength: true,
      },
    });
    // Build hashtag-based links: for each hashtag, connect all users who share it
    const hashtagLinks: { source: string; target: string; hashtagId: string; strength: number }[] = [];
    const hashtagToUsers: Record<string, string[]> = {};
    userHashtags.forEach(uh => {
      if (!hashtagToUsers[uh.hashtagId]) hashtagToUsers[uh.hashtagId] = [];
      hashtagToUsers[uh.hashtagId].push(uh.userId);
    });
    Object.entries(hashtagToUsers).forEach(([hashtagId, userIds]) => {
      for (let i = 0; i < userIds.length; i++) {
        for (let j = i + 1; j < userIds.length; j++) {
          hashtagLinks.push({ source: userIds[i], target: userIds[j], hashtagId, strength: 1 });
        }
      }
    });

    return {
      users,
      connections,
      hashtagLinks,
    };
  }
}
