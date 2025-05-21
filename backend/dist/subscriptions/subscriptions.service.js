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
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const stripe_1 = require("stripe");
const config_1 = require("@nestjs/config");
let SubscriptionsService = class SubscriptionsService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.stripe = new stripe_1.default(this.configService.get('STRIPE_SECRET_KEY'), {
            apiVersion: '2025-04-30.basil',
        });
    }
    async findAll() {
        return this.prisma.subscription.findMany({
            include: {
                user: true,
            },
        });
    }
    async findOne(id) {
        return this.prisma.subscription.findUnique({
            where: { id },
            include: {
                user: true,
            },
        });
    }
    async findByUser(userId) {
        return this.prisma.subscription.findMany({
            where: { userId },
            include: {
                user: true,
            },
        });
    }
    async createCheckoutSession(userId, planType) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new Error('User not found');
        }
        let priceId;
        switch (planType) {
            case 'premium':
                priceId = 'price_premium';
                break;
            case 'enterprise':
                priceId = 'price_enterprise';
                break;
            default:
                throw new Error('Invalid plan type');
        }
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${this.configService.get('FRONTEND_URL')}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${this.configService.get('FRONTEND_URL')}/subscription/cancel`,
            customer_email: user.email,
            client_reference_id: userId,
        });
        return { sessionId: session.id, url: session.url };
    }
    async handleWebhook(event) {
        switch (event.type) {
            case 'checkout.session.completed':
                return this.handleCheckoutSessionCompleted(event.data.object);
            case 'customer.subscription.updated':
                return this.handleSubscriptionUpdated(event.data.object);
            case 'customer.subscription.deleted':
                return this.handleSubscriptionDeleted(event.data.object);
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
    }
    async handleCheckoutSessionCompleted(session) {
        const userId = session.client_reference_id;
        const stripeCustomerId = session.customer;
        const stripeSubscriptionId = session.subscription;
        return this.prisma.subscription.create({
            data: {
                userId,
                planType: 'premium',
                status: 'active',
                stripeCustomerId,
                stripeSubscriptionId,
            },
        });
    }
    async handleSubscriptionUpdated(subscription) {
        return this.prisma.subscription.updateMany({
            where: {
                stripeSubscriptionId: subscription.id,
            },
            data: {
                status: subscription.status,
            },
        });
    }
    async handleSubscriptionDeleted(subscription) {
        return this.prisma.subscription.updateMany({
            where: {
                stripeSubscriptionId: subscription.id,
            },
            data: {
                status: 'canceled',
                endDate: new Date(),
            },
        });
    }
    async cancelSubscription(id) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { id },
        });
        if (!subscription || !subscription.stripeSubscriptionId) {
            throw new Error('Subscription not found');
        }
        await this.stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
        return this.prisma.subscription.update({
            where: { id },
            data: {
                status: 'canceled',
                endDate: new Date(),
            },
        });
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map