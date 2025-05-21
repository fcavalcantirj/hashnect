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
exports.ConnectionsController = void 0;
const common_1 = require("@nestjs/common");
const connections_service_1 = require("./connections.service");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
let ConnectionsController = class ConnectionsController {
    constructor(connectionsService) {
        this.connectionsService = connectionsService;
    }
    findAll() {
        return this.connectionsService.findAll();
    }
    create(createConnectionDto) {
        return this.connectionsService.create(createConnectionDto);
    }
    findOne(id) {
        return this.connectionsService.findOne(id);
    }
    update(id, updateConnectionDto) {
        return this.connectionsService.update(id, updateConnectionDto);
    }
    remove(id) {
        return this.connectionsService.remove(id);
    }
    findByUser(userId) {
        return this.connectionsService.findByUser(userId);
    }
    findPendingRequests(body) {
        return this.connectionsService.findPendingRequests(body.userId);
    }
    acceptConnection(id) {
        return this.connectionsService.acceptConnection(id);
    }
    updateStrength(id, body) {
        return this.connectionsService.updateStrength(id, body.strength);
    }
};
exports.ConnectionsController = ConnectionsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all connections' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all connections' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConnectionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create connection' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Connection has been created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConnectionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get connection by id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return connection by id' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ConnectionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update connection' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Connection has been updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ConnectionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete connection' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Connection has been deleted' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ConnectionsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get connections by user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return connections by user' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ConnectionsController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)('requests'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending connection requests' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return pending connection requests' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConnectionsController.prototype, "findPendingRequests", null);
__decorate([
    (0, common_1.Patch)(':id/accept'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Accept connection request' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Connection request has been accepted' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ConnectionsController.prototype, "acceptConnection", null);
__decorate([
    (0, common_1.Patch)(':id/strength'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update connection strength' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Connection strength has been updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ConnectionsController.prototype, "updateStrength", null);
exports.ConnectionsController = ConnectionsController = __decorate([
    (0, swagger_1.ApiTags)('connections'),
    (0, common_1.Controller)('api/connections'),
    __metadata("design:paramtypes", [connections_service_1.ConnectionsService])
], ConnectionsController);
//# sourceMappingURL=connections.controller.js.map