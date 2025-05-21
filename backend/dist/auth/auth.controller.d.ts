import { AuthService } from './auth.service';
import { Response } from 'express';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    googleAuth(): Promise<void>;
    googleAuthCallback(req: any, res: Response): Promise<void>;
    facebookAuth(): Promise<void>;
    facebookAuthCallback(req: any, res: Response): Promise<void>;
    instagramAuth(): Promise<void>;
    instagramAuthCallback(req: any, res: Response): Promise<void>;
    linkedinAuth(): Promise<void>;
    linkedinAuthCallback(req: any, res: Response): Promise<void>;
}
