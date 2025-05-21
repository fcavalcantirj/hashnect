"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubdomainsModule = void 0;
const common_1 = require("@nestjs/common");
const subdomains_service_1 = require("./subdomains.service");
const subdomains_controller_1 = require("./subdomains.controller");
const prisma_service_1 = require("../common/prisma.service");
let SubdomainsModule = class SubdomainsModule {
};
exports.SubdomainsModule = SubdomainsModule;
exports.SubdomainsModule = SubdomainsModule = __decorate([
    (0, common_1.Module)({
        controllers: [subdomains_controller_1.SubdomainsController],
        providers: [subdomains_service_1.SubdomainsService, prisma_service_1.PrismaService],
        exports: [subdomains_service_1.SubdomainsService],
    })
], SubdomainsModule);
//# sourceMappingURL=subdomains.module.js.map