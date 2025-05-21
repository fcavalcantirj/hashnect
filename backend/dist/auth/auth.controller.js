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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async googleAuth() {
    }
    async googleAuthCallback(req, res) {
        const { access_token, user } = await this.authService.validateOAuthLogin(req.user, 'google');
        console.log('Generated JWT:', access_token);
        return res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${access_token}`);
    }
    async facebookAuth() {
    }
    async facebookAuthCallback(req, res) {
        const { access_token, user } = await this.authService.validateOAuthLogin(req.user, 'facebook');
        return res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${access_token}`);
    }
    async instagramAuth() {
    }
    async instagramAuthCallback(req, res) {
        const { access_token, user } = await this.authService.validateOAuthLogin(req.user, 'instagram');
        return res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${access_token}`);
    }
    async linkedinAuth() {
    }
    async linkedinAuthCallback(req, res) {
        const { access_token, user } = await this.authService.validateOAuthLogin(req.user, 'linkedin');
        return res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${access_token}`);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate Google OAuth flow' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    (0, swagger_1.ApiOperation)({ summary: 'Google OAuth callback' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully authenticated' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthCallback", null);
__decorate([
    (0, common_1.Get)('facebook'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('facebook')),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate Facebook OAuth flow' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "facebookAuth", null);
__decorate([
    (0, common_1.Get)('facebook/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('facebook')),
    (0, swagger_1.ApiOperation)({ summary: 'Facebook OAuth callback' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully authenticated' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "facebookAuthCallback", null);
__decorate([
    (0, common_1.Get)('instagram'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('instagram')),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate Instagram OAuth flow' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "instagramAuth", null);
__decorate([
    (0, common_1.Get)('instagram/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('instagram')),
    (0, swagger_1.ApiOperation)({ summary: 'Instagram OAuth callback' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully authenticated' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "instagramAuthCallback", null);
__decorate([
    (0, common_1.Get)('linkedin'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('linkedin')),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate LinkedIn OAuth flow' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "linkedinAuth", null);
__decorate([
    (0, common_1.Get)('linkedin/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('linkedin')),
    (0, swagger_1.ApiOperation)({ summary: 'LinkedIn OAuth callback' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully authenticated' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "linkedinAuthCallback", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('api/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map