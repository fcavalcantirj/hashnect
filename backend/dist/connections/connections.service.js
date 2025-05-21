"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let ConnectionsService = class ConnectionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.connection.findMany({
            include: {
                fromUser: true,
                toUser: true,
            },
        });
    }
    async findOne(id) {
        return this.prisma.connection.findUnique({
            where: { id },
            include: {
                fromUser: true,
                toUser: true,
            },
        });
    }
    async create(data) {
        return this.prisma.connection.create({
            data,
            include: {
                fromUser: true,
                toUser: true,
            },
        });
    }
    async update(id, data) {
        return this.prisma.connection.update({
            where: { id },
            data,
            include: {
                fromUser: true,
                toUser: true,
            },
        });
    }
    async remove(id) {
        return this.prisma.connection.delete({
            where: { id },
        });
    }
    async findByUser(userId) {
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
    async findPendingRequests(userId) {
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
    async acceptConnection(id) {
        return this.prisma.connection.update({
            where: { id },
            data: { isAccepted: true },
        });
    }
    async updateStrength(id, strength) {
        return this.prisma.connection.update({
            where: { id },
            data: { strength },
        });
    }
};
exports.ConnectionsService = ConnectionsService;
exports.ConnectionsService = ConnectionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ConnectionsService);
//# sourceMappingURL=connections.service.js.map