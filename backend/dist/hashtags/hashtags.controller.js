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
exports.HashtagsController = void 0;
const common_1 = require("@nestjs/common");
const hashtags_service_1 = require("./hashtags.service");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
let HashtagsController = class HashtagsController {
    constructor(hashtagsService) {
        this.hashtagsService = hashtagsService;
    }
    findAll() {
        return this.hashtagsService.findAll();
    }
    create(createHashtagDto) {
        return this.hashtagsService.create(createHashtagDto);
    }
    findOne(id) {
        return this.hashtagsService.findOne(id);
    }
    update(id, updateHashtagDto) {
        return this.hashtagsService.update(id, updateHashtagDto);
    }
    remove(id) {
        return this.hashtagsService.remove(id);
    }
    findTrending() {
        return this.hashtagsService.findTrending();
    }
    findByUser(userId) {
        return this.hashtagsService.findByUser(userId);
    }
    addUserHashtag(userId, body) {
        return this.hashtagsService.addUserHashtag(userId, body.hashtagId, body.strength);
    }
    removeUserHashtag(userId, hashtagId) {
        return this.hashtagsService.removeUserHashtag(userId, hashtagId);
    }
    updateUserHashtagStrength(userId, hashtagId, body) {
        return this.hashtagsService.updateUserHashtagStrength(userId, hashtagId, body.strength);
    }
};
exports.HashtagsController = HashtagsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all hashtags' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all hashtags' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HashtagsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create hashtag' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Hashtag has been created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HashtagsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get hashtag by id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return hashtag by id' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HashtagsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update hashtag' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Hashtag has been updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], HashtagsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete hashtag' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Hashtag has been deleted' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HashtagsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('trending'),
    (0, swagger_1.ApiOperation)({ summary: 'Get trending hashtags' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return trending hashtags' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HashtagsController.prototype, "findTrending", null);
__decorate([
    (0, common_1.Get)('users/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get hashtags by user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return hashtags by user' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HashtagsController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Post)('users/:userId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add hashtag to user' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Hashtag has been added to user' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], HashtagsController.prototype, "addUserHashtag", null);
__decorate([
    (0, common_1.Delete)('users/:userId/:hashtagId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Remove hashtag from user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Hashtag has been removed from user' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('hashtagId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], HashtagsController.prototype, "removeUserHashtag", null);
__decorate([
    (0, common_1.Patch)('users/:userId/:hashtagId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update user hashtag strength' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User hashtag strength has been updated' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('hashtagId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], HashtagsController.prototype, "updateUserHashtagStrength", null);
exports.HashtagsController = HashtagsController = __decorate([
    (0, swagger_1.ApiTags)('hashtags'),
    (0, common_1.Controller)('api/hashtags'),
    __metadata("design:paramtypes", [hashtags_service_1.HashtagsService])
], HashtagsController);
//# sourceMappingURL=hashtags.controller.js.map