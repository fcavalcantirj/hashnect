import { UsersService } from './users.service';
import { Request } from 'express';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(req: Request): Promise<{
        message: string;
        data?: undefined;
    } | {
        data: {
            id: any;
            email: any;
            fullName: any;
            avatar: any;
            joinedDate: any;
            verificationLevel: any;
            isActive: any;
            createdAt: any;
            updatedAt: any;
        };
        message?: undefined;
    }>;
    getProfile(id: string): Promise<{
        id: string;
        email: string;
        fullName: string;
        username: string;
        avatar: string;
        bio: string;
        joinedDate: string;
        verificationLevel: number;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
        socialAccounts: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            provider: string;
            providerId: string;
            accessToken: string | null;
            refreshToken: string | null;
        }[];
        hashtags: {
            id: string;
            name: string;
            description: string;
            strength: number;
        }[];
        connectionsCount: any;
        hashtagsCount: any;
        subdomainsCount: any;
    }>;
    updateProfile(id: string, body: {
        bio?: string;
    }): Promise<{
        success: boolean;
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
    }>;
}
