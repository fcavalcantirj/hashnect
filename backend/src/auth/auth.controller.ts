import { Controller, Get, Post, UseGuards, Req, Res, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth flow' })
  async googleAuth() {
    // Initiates Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  @ApiResponse({ status: 200, description: 'Successfully authenticated' })
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const { access_token, user } = await this.authService.validateOAuthLogin(
      req.user,
      'google',
    );
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    return res.redirect(
      `${frontendUrl}/auth/callback?token=${access_token}`,
    );
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  @ApiOperation({ summary: 'Initiate Facebook OAuth flow' })
  async facebookAuth() {
    // Initiates Facebook OAuth flow
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  @ApiOperation({ summary: 'Facebook OAuth callback' })
  @ApiResponse({ status: 200, description: 'Successfully authenticated' })
  async facebookAuthCallback(@Req() req, @Res() res: Response) {
    const { access_token, user } = await this.authService.validateOAuthLogin(
      req.user,
      'facebook',
    );
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    return res.redirect(
      `${frontendUrl}/auth/callback?token=${access_token}`,
    );
  }

  @Get('instagram')
  @UseGuards(AuthGuard('instagram'))
  @ApiOperation({ summary: 'Initiate Instagram OAuth flow' })
  async instagramAuth() {
    // Initiates Instagram OAuth flow
  }

  @Get('instagram/callback')
  @UseGuards(AuthGuard('instagram'))
  @ApiOperation({ summary: 'Instagram OAuth callback' })
  @ApiResponse({ status: 200, description: 'Successfully authenticated' })
  async instagramAuthCallback(@Req() req, @Res() res: Response) {
    const { access_token, user } = await this.authService.validateOAuthLogin(
      req.user,
      'instagram',
    );
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    return res.redirect(
      `${frontendUrl}/auth/callback?token=${access_token}`,
    );
  }

  @Get('linkedin')
  @UseGuards(AuthGuard('linkedin'))
  @ApiOperation({ summary: 'Initiate LinkedIn OAuth flow' })
  async linkedinAuth() {
    // Initiates LinkedIn OAuth flow
  }

  @Get('linkedin/callback')
  @UseGuards(AuthGuard('linkedin'))
  @ApiOperation({ summary: 'LinkedIn OAuth callback' })
  @ApiResponse({ status: 200, description: 'Successfully authenticated' })
  async linkedinAuthCallback(@Req() req, @Res() res: Response) {
    const { access_token, user } = await this.authService.validateOAuthLogin(
      req.user,
      'linkedin',
    );
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    return res.redirect(
      `${frontendUrl}/auth/callback?token=${access_token}`,
    );
  }
}
