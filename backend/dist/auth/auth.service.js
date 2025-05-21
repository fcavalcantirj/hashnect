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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../common/prisma.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async validateOAuthLogin(profile, provider) {
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
        }
        else {
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
    generateToken(user) {
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map