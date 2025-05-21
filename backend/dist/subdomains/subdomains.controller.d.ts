import { SubdomainsService } from './subdomains.service';
export declare class SubdomainsController {
    private readonly subdomainsService;
    constructor(subdomainsService: SubdomainsService);
    findAll(): Promise<({
        owner: {
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
        members: ({
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
            subdomainId: string;
            role: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isPrivate: boolean;
        ownerId: string;
    })[]>;
    create(createSubdomainDto: any): Promise<{
        owner: {
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
        members: ({
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
            subdomainId: string;
            role: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isPrivate: boolean;
        ownerId: string;
    }>;
    findOne(id: string): Promise<{
        owner: {
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
        members: ({
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
            subdomainId: string;
            role: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isPrivate: boolean;
        ownerId: string;
    }>;
    update(id: string, updateSubdomainDto: any): Promise<{
        owner: {
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
        members: ({
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
            subdomainId: string;
            role: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isPrivate: boolean;
        ownerId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isPrivate: boolean;
        ownerId: string;
    }>;
    findByUser(userId: string): Promise<({
        owner: {
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
        members: ({
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
            subdomainId: string;
            role: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isPrivate: boolean;
        ownerId: string;
    })[]>;
    findByOwner(ownerId: string): Promise<({
        owner: {
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
        members: ({
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
            subdomainId: string;
            role: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isPrivate: boolean;
        ownerId: string;
    })[]>;
    addMember(id: string, body: {
        userId: string;
        role?: string;
    }): Promise<{
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
        subdomain: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            isPrivate: boolean;
            ownerId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        subdomainId: string;
        role: string;
    }>;
    removeMember(id: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    updateMemberRole(id: string, userId: string, body: {
        role: string;
    }): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
