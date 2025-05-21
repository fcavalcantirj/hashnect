import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class SubdomainsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.subdomain.findMany({
      include: {
        owner: true,
        members: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.subdomain.findUnique({
      where: { id },
      include: {
        owner: true,
        members: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async create(data: any) {
    const { ownerId, name, description, isPrivate } = data;
    
    // Create subdomain
    const subdomain = await this.prisma.subdomain.create({
      data: {
        name,
        description,
        isPrivate,
        ownerId,
      },
    });
    
    // Add owner as member with owner role
    await this.prisma.subdomainMember.create({
      data: {
        subdomainId: subdomain.id,
        userId: ownerId,
        role: 'owner',
      },
    });
    
    return this.findOne(subdomain.id);
  }

  async update(id: string, data: any) {
    return this.prisma.subdomain.update({
      where: { id },
      data,
      include: {
        owner: true,
        members: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.subdomain.delete({
      where: { id },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.subdomain.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        owner: true,
        members: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findByOwner(ownerId: string) {
    return this.prisma.subdomain.findMany({
      where: {
        ownerId,
      },
      include: {
        owner: true,
        members: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async addMember(subdomainId: string, userId: string, role: string = 'member') {
    return this.prisma.subdomainMember.create({
      data: {
        subdomainId,
        userId,
        role,
      },
      include: {
        user: true,
        subdomain: true,
      },
    });
  }

  async removeMember(subdomainId: string, userId: string) {
    return this.prisma.subdomainMember.deleteMany({
      where: {
        subdomainId,
        userId,
      },
    });
  }

  async updateMemberRole(subdomainId: string, userId: string, role: string) {
    return this.prisma.subdomainMember.updateMany({
      where: {
        subdomainId,
        userId,
      },
      data: {
        role,
      },
    });
  }
}
