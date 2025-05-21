"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashtagsModule = void 0;
const common_1 = require("@nestjs/common");
const hashtags_service_1 = require("./hashtags.service");
const hashtags_controller_1 = require("./hashtags.controller");
const prisma_service_1 = require("../common/prisma.service");
let HashtagsModule = class HashtagsModule {
};
exports.HashtagsModule = HashtagsModule;
exports.HashtagsModule = HashtagsModule = __decorate([
    (0, common_1.Module)({
        controllers: [hashtags_controller_1.HashtagsController],
        providers: [hashtags_service_1.HashtagsService, prisma_service_1.PrismaService],
        exports: [hashtags_service_1.HashtagsService],
    })
], HashtagsModule);
//# sourceMappingURL=hashtags.module.js.map