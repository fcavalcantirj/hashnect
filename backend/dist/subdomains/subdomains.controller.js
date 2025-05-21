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
exports.SubdomainsController = void 0;
const common_1 = require("@nestjs/common");
const subdomains_service_1 = require("./subdomains.service");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
let SubdomainsController = class SubdomainsController {
    constructor(subdomainsService) {
        this.subdomainsService = subdomainsService;
    }
    findAll() {
        return this.subdomainsService.findAll();
    }
    create(createSubdomainDto) {
        return this.subdomainsService.create(createSubdomainDto);
    }
    findOne(id) {
        return this.subdomainsService.findOne(id);
    }
    update(id, updateSubdomainDto) {
        return this.subdomainsService.update(id, updateSubdomainDto);
    }
    remove(id) {
        return this.subdomainsService.remove(id);
    }
    findByUser(userId) {
        return this.subdomainsService.findByUser(userId);
    }
    findByOwner(ownerId) {
        return this.subdomainsService.findByOwner(ownerId);
    }
    addMember(id, body) {
        return this.subdomainsService.addMember(id, body.userId, body.role);
    }
    removeMember(id, userId) {
        return this.subdomainsService.removeMember(id, userId);
    }
    updateMemberRole(id, userId, body) {
        return this.subdomainsService.updateMemberRole(id, userId, body.role);
    }
};
exports.SubdomainsController = SubdomainsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all subdomains' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all subdomains' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SubdomainsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create subdomain' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Subdomain has been created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SubdomainsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get subdomain by id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return subdomain by id' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubdomainsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update subdomain' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subdomain has been updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SubdomainsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete subdomain' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subdomain has been deleted' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubdomainsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get subdomains by user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return subdomains by user' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubdomainsController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)('owner/:ownerId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get subdomains by owner' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return subdomains by owner' }),
    __param(0, (0, common_1.Param)('ownerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubdomainsController.prototype, "findByOwner", null);
__decorate([
    (0, common_1.Post)(':id/members'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add member to subdomain' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Member has been added to subdomain' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SubdomainsController.prototype, "addMember", null);
__decorate([
    (0, common_1.Delete)(':id/members/:userId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Remove member from subdomain' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Member has been removed from subdomain' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SubdomainsController.prototype, "removeMember", null);
__decorate([
    (0, common_1.Patch)(':id/members/:userId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update member role in subdomain' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Member role has been updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], SubdomainsController.prototype, "updateMemberRole", null);
exports.SubdomainsController = SubdomainsController = __decorate([
    (0, swagger_1.ApiTags)('subdomains'),
    (0, common_1.Controller)('api/subdomains'),
    __metadata("design:paramtypes", [subdomains_service_1.SubdomainsService])
], SubdomainsController);
//# sourceMappingURL=subdomains.controller.js.map