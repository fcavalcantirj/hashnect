import { SubscriptionsService } from './subscriptions.service';
export declare class SubscriptionsController {
    private readonly subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
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
    createCheckoutSession(body: {
        userId: string;
        planType: string;
    }): Promise<{
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
