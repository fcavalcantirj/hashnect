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
exports.HashtagsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let HashtagsService = class HashtagsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.hashtag.findMany();
    }
    async findOne(id) {
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
    async create(data) {
        return this.prisma.hashtag.create({
            data,
        });
    }
    async update(id, data) {
        return this.prisma.hashtag.update({
            where: { id },
            data,
        });
    }
    async remove(id) {
        return this.prisma.hashtag.delete({
            where: { id },
        });
    }
    async findByName(name) {
        return this.prisma.hashtag.findUnique({
            where: { name },
        });
    }
    async findTrending() {
        return this.prisma.hashtag.findMany({
            take: 10,
        });
    }
    async findByUser(userId) {
        return this.prisma.userHashtag.findMany({
            where: { userId },
            include: {
                hashtag: true,
            },
        });
    }
    async addUserHashtag(userId, hashtagId, strength = 1.0) {
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
    async removeUserHashtag(userId, hashtagId) {
        return this.prisma.userHashtag.deleteMany({
            where: {
                userId,
                hashtagId,
            },
        });
    }
    async updateUserHashtagStrength(userId, hashtagId, strength) {
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
};
exports.HashtagsService = HashtagsService;
exports.HashtagsService = HashtagsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HashtagsService);
//# sourceMappingURL=hashtags.service.js.map