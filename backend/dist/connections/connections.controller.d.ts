import { ConnectionsService } from './connections.service';
export declare class ConnectionsController {
    private readonly connectionsService;
    constructor(connectionsService: ConnectionsService);
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
        toUserId: string;
        fromUserId: string;
        strength: number;
        isAccepted: boolean;
    })[]>;
    create(createConnectionDto: any): Promise<{
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
        toUserId: string;
        fromUserId: string;
        strength: number;
        isAccepted: boolean;
    }>;
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
        toUserId: string;
        fromUserId: string;
        strength: number;
        isAccepted: boolean;
    }>;
    update(id: string, updateConnectionDto: any): Promise<{
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
        toUserId: string;
        fromUserId: string;
        strength: number;
        isAccepted: boolean;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        toUserId: string;
        fromUserId: string;
        strength: number;
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
        toUserId: string;
        fromUserId: string;
        strength: number;
        isAccepted: boolean;
    })[]>;
    findPendingRequests(body: {
        userId: string;
    }): Promise<({
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
        toUserId: string;
        fromUserId: string;
        strength: number;
        isAccepted: boolean;
    })[]>;
    acceptConnection(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        toUserId: string;
        fromUserId: string;
        strength: number;
        isAccepted: boolean;
    }>;
    updateStrength(id: string, body: {
        strength: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        toUserId: string;
        fromUserId: string;
        strength: number;
        isAccepted: boolean;
    }>;
}
