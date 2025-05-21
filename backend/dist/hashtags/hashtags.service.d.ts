import { PrismaService } from '../common/prisma.service';
export declare class HashtagsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
    }[]>;
    findOne(id: string): Promise<{
        userHashtags: ({
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
            hashtagId: string;
            strength: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
    }>;
    create(data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
    }>;
    findByName(name: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
    }>;
    findTrending(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
    }[]>;
    findByUser(userId: string): Promise<({
        hashtag: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        hashtagId: string;
        strength: number;
    })[]>;
    addUserHashtag(userId: string, hashtagId: string, strength?: number): Promise<{
        hashtag: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        hashtagId: string;
        strength: number;
    }>;
    removeUserHashtag(userId: string, hashtagId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    updateUserHashtagStrength(userId: string, hashtagId: string, strength: number): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
