import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { HashtagsService } from './hashtags.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('hashtags')
@Controller('api/hashtags')
export class HashtagsController {
  constructor(private readonly hashtagsService: HashtagsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all hashtags' })
  @ApiResponse({ status: 200, description: 'Return all hashtags' })
  findAll() {
    return this.hashtagsService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create hashtag' })
  @ApiResponse({ status: 201, description: 'Hashtag has been created' })
  create(@Body() createHashtagDto: any) {
    return this.hashtagsService.create(createHashtagDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get hashtag by id' })
  @ApiResponse({ status: 200, description: 'Return hashtag by id' })
  findOne(@Param('id') id: string) {
    return this.hashtagsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update hashtag' })
  @ApiResponse({ status: 200, description: 'Hashtag has been updated' })
  update(@Param('id') id: string, @Body() updateHashtagDto: any) {
    return this.hashtagsService.update(id, updateHashtagDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete hashtag' })
  @ApiResponse({ status: 200, description: 'Hashtag has been deleted' })
  remove(@Param('id') id: string) {
    return this.hashtagsService.remove(id);
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending hashtags' })
  @ApiResponse({ status: 200, description: 'Return trending hashtags' })
  findTrending() {
    return this.hashtagsService.findTrending();
  }

  @Get('users/:userId')
  @ApiOperation({ summary: 'Get hashtags by user' })
  @ApiResponse({ status: 200, description: 'Return hashtags by user' })
  findByUser(@Param('userId') userId: string) {
    return this.hashtagsService.findByUser(userId);
  }

  @Post('users/:userId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add hashtag to user' })
  @ApiResponse({ status: 201, description: 'Hashtag has been added to user' })
  addUserHashtag(
    @Param('userId') userId: string,
    @Body() body: { hashtagId: string; strength?: number },
  ) {
    return this.hashtagsService.addUserHashtag(
      userId,
      body.hashtagId,
      body.strength,
    );
  }

  @Delete('users/:userId/:hashtagId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove hashtag from user' })
  @ApiResponse({ status: 200, description: 'Hashtag has been removed from user' })
  removeUserHashtag(
    @Param('userId') userId: string,
    @Param('hashtagId') hashtagId: string,
  ) {
    return this.hashtagsService.removeUserHashtag(userId, hashtagId);
  }

  @Patch('users/:userId/:hashtagId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user hashtag strength' })
  @ApiResponse({ status: 200, description: 'User hashtag strength has been updated' })
  updateUserHashtagStrength(
    @Param('userId') userId: string,
    @Param('hashtagId') hashtagId: string,
    @Body() body: { strength: number },
  ) {
    return this.hashtagsService.updateUserHashtagStrength(
      userId,
      hashtagId,
      body.strength,
    );
  }
}
