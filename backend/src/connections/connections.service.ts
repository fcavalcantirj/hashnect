import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class ConnectionsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.connection.findMany({
      include: {
        fromUser: true,
        toUser: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.connection.findUnique({
      where: { id },
      include: {
        fromUser: true,
        toUser: true,
      },
    });
  }

  async create(data: any) {
    return this.prisma.connection.create({
      data,
      include: {
        fromUser: true,
        toUser: true,
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.connection.update({
      where: { id },
      data,
      include: {
        fromUser: true,
        toUser: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.connection.delete({
      where: { id },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.connection.findMany({
      where: {
        OR: [
          { fromUserId: userId },
          { toUserId: userId },
        ],
      },
      include: {
        fromUser: true,
        toUser: true,
      },
    });
  }

  async findPendingRequests(userId: string) {
    return this.prisma.connection.findMany({
      where: {
        toUserId: userId,
        isAccepted: false,
      },
      include: {
        fromUser: true,
      },
    });
  }

  async acceptConnection(id: string) {
    return this.prisma.connection.update({
      where: { id },
      data: { isAccepted: true },
    });
  }

  async updateStrength(id: string, strength: number) {
    return this.prisma.connection.update({
      where: { id },
      data: { strength },
    });
  }
}
