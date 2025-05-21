import { PrismaService } from '../common/prisma.service';
export declare class ConnectionsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        fromUser: {
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
        toUser: {
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
        strength: number;
        toUserId: string;
        fromUserId: string;
        isAccepted: boolean;
    })[]>;
    findOne(id: string): Promise<{
        fromUser: {
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
        toUser: {
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
        strength: number;
        toUserId: string;
        fromUserId: string;
        isAccepted: boolean;
    }>;
    create(data: any): Promise<{
        fromUser: {
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
        toUser: {
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
        strength: number;
        toUserId: string;
        fromUserId: string;
        isAccepted: boolean;
    }>;
    update(id: string, data: any): Promise<{
        fromUser: {
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
        toUser: {
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
        strength: number;
        toUserId: string;
        fromUserId: string;
        isAccepted: boolean;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        strength: number;
        toUserId: string;
        fromUserId: string;
        isAccepted: boolean;
    }>;
    findByUser(userId: string): Promise<({
        fromUser: {
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
        toUser: {
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
        strength: number;
        toUserId: string;
        fromUserId: string;
        isAccepted: boolean;
    })[]>;
    findPendingRequests(userId: string): Promise<({
        fromUser: {
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
        strength: number;
        toUserId: string;
        fromUserId: string;
        isAccepted: boolean;
    })[]>;
    acceptConnection(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        strength: number;
        toUserId: string;
        fromUserId: string;
        isAccepted: boolean;
    }>;
    updateStrength(id: string, strength: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        strength: number;
        toUserId: string;
        fromUserId: string;
        isAccepted: boolean;
    }>;
}
