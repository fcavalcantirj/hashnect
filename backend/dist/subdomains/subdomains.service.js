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
exports.SubdomainsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let SubdomainsService = class SubdomainsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async findOne(id) {
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
    async create(data) {
        const { ownerId, name, description, isPrivate } = data;
        const subdomain = await this.prisma.subdomain.create({
            data: {
                name,
                description,
                isPrivate,
                ownerId,
            },
        });
        await this.prisma.subdomainMember.create({
            data: {
                subdomainId: subdomain.id,
                userId: ownerId,
                role: 'owner',
            },
        });
        return this.findOne(subdomain.id);
    }
    async update(id, data) {
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
    async remove(id) {
        return this.prisma.subdomain.delete({
            where: { id },
        });
    }
    async findByUser(userId) {
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
    async findByOwner(ownerId) {
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
    async addMember(subdomainId, userId, role = 'member') {
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
    async removeMember(subdomainId, userId) {
        return this.prisma.subdomainMember.deleteMany({
            where: {
                subdomainId,
                userId,
            },
        });
    }
    async updateMemberRole(subdomainId, userId, role) {
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
};
exports.SubdomainsService = SubdomainsService;
exports.SubdomainsService = SubdomainsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubdomainsService);
//# sourceMappingURL=subdomains.service.js.map