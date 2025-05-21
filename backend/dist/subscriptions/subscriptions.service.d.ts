import { PrismaService } from '../common/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class SubscriptionsService {
    private prisma;
    private configService;
    private stripe;
    constructor(prisma: PrismaService, configService: ConfigService);
    findAll(): Promise<({
        user: {
            id: string;
            email: string;
            fullName: string | null;
            phone: string | null;
            avatar: string | null;
            joinedDate: Date;
            verificationLevel: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            bio: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        planType: string;
        status: string;
        startDate: Date;
        endDate: Date | null;
        stripeCustomerId: string | null;
        stripeSubscriptionId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            email: string;
            fullName: string | null;
            phone: string | null;
            avatar: string | null;
            joinedDate: Date;
            verificationLevel: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            bio: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        planType: string;
        status: string;
        startDate: Date;
        endDate: Date | null;
        stripeCustomerId: string | null;
        stripeSubscriptionId: string | null;
    }>;
    findByUser(userId: string): Promise<({
        user: {
            id: string;
            email: string;
            fullName: string | null;
            phone: string | null;
            avatar: string | null;
            joinedDate: Date;
            verificationLevel: number;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            bio: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        planType: string;
        status: string;
        startDate: Date;
        endDate: Date | null;
        stripeCustomerId: string | null;
        stripeSubscriptionId: string | null;
    })[]>;
    createCheckoutSession(userId: string, planType: string): Promise<{
        sessionId: string;
        url: string;
    }>;
    handleWebhook(event: any): Promise<import(".prisma/client").Prisma.BatchPayload | {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        planType: string;
        status: string;
        startDate: Date;
        endDate: Date | null;
        stripeCustomerId: string | null;
        stripeSubscriptionId: string | null;
    }>;
    private handleCheckoutSessionCompleted;
    private handleSubscriptionUpdated;
    private handleSubscriptionDeleted;
    cancelSubscription(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        planType: string;
        status: string;
        startDate: Date;
        endDate: Date | null;
        stripeCustomerId: string | null;
        stripeSubscriptionId: string | null;
    }>;
}
