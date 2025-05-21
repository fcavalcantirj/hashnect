import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SubdomainsService } from './subdomains.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('subdomains')
@Controller('api/subdomains')
export class SubdomainsController {
  constructor(private readonly subdomainsService: SubdomainsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all subdomains' })
  @ApiResponse({ status: 200, description: 'Return all subdomains' })
  findAll() {
    return this.subdomainsService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create subdomain' })
  @ApiResponse({ status: 201, description: 'Subdomain has been created' })
  create(@Body() createSubdomainDto: any) {
    return this.subdomainsService.create(createSubdomainDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get subdomain by id' })
  @ApiResponse({ status: 200, description: 'Return subdomain by id' })
  findOne(@Param('id') id: string) {
    return this.subdomainsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update subdomain' })
  @ApiResponse({ status: 200, description: 'Subdomain has been updated' })
  update(@Param('id') id: string, @Body() updateSubdomainDto: any) {
    return this.subdomainsService.update(id, updateSubdomainDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete subdomain' })
  @ApiResponse({ status: 200, description: 'Subdomain has been deleted' })
  remove(@Param('id') id: string) {
    return this.subdomainsService.remove(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get subdomains by user' })
  @ApiResponse({ status: 200, description: 'Return subdomains by user' })
  findByUser(@Param('userId') userId: string) {
    return this.subdomainsService.findByUser(userId);
  }

  @Get('owner/:ownerId')
  @ApiOperation({ summary: 'Get subdomains by owner' })
  @ApiResponse({ status: 200, description: 'Return subdomains by owner' })
  findByOwner(@Param('ownerId') ownerId: string) {
    return this.subdomainsService.findByOwner(ownerId);
  }

  @Post(':id/members')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add member to subdomain' })
  @ApiResponse({ status: 201, description: 'Member has been added to subdomain' })
  addMember(
    @Param('id') id: string,
    @Body() body: { userId: string; role?: string },
  ) {
    return this.subdomainsService.addMember(id, body.userId, body.role);
  }

  @Delete(':id/members/:userId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove member from subdomain' })
  @ApiResponse({ status: 200, description: 'Member has been removed from subdomain' })
  removeMember(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return this.subdomainsService.removeMember(id, userId);
  }

  @Patch(':id/members/:userId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update member role in subdomain' })
  @ApiResponse({ status: 200, description: 'Member role has been updated' })
  updateMemberRole(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() body: { role: string },
  ) {
    return this.subdomainsService.updateMemberRole(id, userId, body.role);
  }
}
