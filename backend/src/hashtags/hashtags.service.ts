import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class HashtagsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.hashtag.findMany();
  }

  async findOne(id: string) {
    return this.prisma.hashtag.findUnique({
      where: { id },
      include: {
        userHashtags: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async create(data: any) {
    return this.prisma.hashtag.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return this.prisma.hashtag.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.hashtag.delete({
      where: { id },
    });
  }

  async findByName(name: string) {
    return this.prisma.hashtag.findUnique({
      where: { name },
    });
  }

  async findTrending() {
    // This would typically involve more complex queries with aggregations
    // For prototype purposes, we'll return all hashtags
    return this.prisma.hashtag.findMany({
      take: 10,
    });
  }

  async findByUser(userId: string) {
    return this.prisma.userHashtag.findMany({
      where: { userId },
      include: {
        hashtag: true,
      },
    });
  }

  async addUserHashtag(userId: string, hashtagId: string, strength: number = 1.0) {
    return this.prisma.userHashtag.create({
      data: {
        userId,
        hashtagId,
        strength,
      },
      include: {
        hashtag: true,
      },
    });
  }

  async removeUserHashtag(userId: string, hashtagId: string) {
    return this.prisma.userHashtag.deleteMany({
      where: {
        userId,
        hashtagId,
      },
    });
  }

  async updateUserHashtagStrength(userId: string, hashtagId: string, strength: number) {
    return this.prisma.userHashtag.updateMany({
      where: {
        userId,
        hashtagId,
      },
      data: {
        strength,
      },
    });
  }
}
