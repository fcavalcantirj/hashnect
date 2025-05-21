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
        strength: number;
        toUserId: string;
        fromUserId: string;
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
        strength: number;
        toUserId: string;
        fromUserId: string;
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
        strength: number;
        toUserId: string;
        fromUserId: string;
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
    updateStrength(id: string, body: {
        strength: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        strength: number;
        toUserId: string;
        fromUserId: string;
        isAccepted: boolean;
    }>;
}
