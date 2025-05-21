import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateOAuthLogin(profile: any, provider: string): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            fullName: any;
            avatar: any;
        };
    }>;
    generateToken(user: any): {
        access_token: string;
        user: {
            id: any;
            email: any;
            fullName: any;
            avatar: any;
        };
    };
}
