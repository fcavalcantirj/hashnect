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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getMe(req) {
        if (!req.user) {
            return { message: 'User not found' };
        }
        const user = req.user;
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
    async getProfile(id) {
        const user = await this.usersService.findOne(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const prisma = this.usersService.prisma || this.usersService['prisma'];
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
    async updateProfile(id, body) {
        const data = {};
        if (body.bio !== undefined)
            data.bio = body.bio;
        const user = await this.usersService.update(id, data);
        return { success: true, user };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('self'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return current user' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getMe", null);
__decorate([
    (0, common_1.Get)(':id/profile'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user profile by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return user profile' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update user profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User profile updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('api/users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map