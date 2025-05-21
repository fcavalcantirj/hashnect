import { PrismaService } from '../common/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
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
    }[]>;
    findOne(id: string): Promise<{
        socialAccounts: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            provider: string;
            providerId: string;
            accessToken: string | null;
            refreshToken: string | null;
            userId: string;
        }[];
        userHashtags: ({
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
        })[];
    } & {
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
    }>;
    update(id: string, data: any): Promise<{
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
    }>;
    remove(id: string): Promise<{
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
    }>;
    findByEmail(email: string): Promise<{
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
    }>;
    updateVerificationLevel(id: string, level: number): Promise<{
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
    }>;
}
