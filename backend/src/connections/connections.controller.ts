import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('connections')
@Controller('api/connections')
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all connections' })
  @ApiResponse({ status: 200, description: 'Return all connections' })
  findAll() {
    return this.connectionsService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create connection' })
  @ApiResponse({ status: 201, description: 'Connection has been created' })
  create(@Body() createConnectionDto: any) {
    return this.connectionsService.create(createConnectionDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get connection by id' })
  @ApiResponse({ status: 200, description: 'Return connection by id' })
  findOne(@Param('id') id: string) {
    return this.connectionsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update connection' })
  @ApiResponse({ status: 200, description: 'Connection has been updated' })
  update(@Param('id') id: string, @Body() updateConnectionDto: any) {
    return this.connectionsService.update(id, updateConnectionDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete connection' })
  @ApiResponse({ status: 200, description: 'Connection has been deleted' })
  remove(@Param('id') id: string) {
    return this.connectionsService.remove(id);
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get connections by user' })
  @ApiResponse({ status: 200, description: 'Return connections by user' })
  findByUser(@Param('userId') userId: string) {
    return this.connectionsService.findByUser(userId);
  }

  @Get('requests')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get pending connection requests' })
  @ApiResponse({ status: 200, description: 'Return pending connection requests' })
  findPendingRequests(@Body() body: { userId: string }) {
    return this.connectionsService.findPendingRequests(body.userId);
  }

  @Patch(':id/accept')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept connection request' })
  @ApiResponse({ status: 200, description: 'Connection request has been accepted' })
  acceptConnection(@Param('id') id: string) {
    return this.connectionsService.acceptConnection(id);
  }

  @Patch(':id/strength')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update connection strength' })
  @ApiResponse({ status: 200, description: 'Connection strength has been updated' })
  updateStrength(@Param('id') id: string, @Body() body: { strength: number }) {
    return this.connectionsService.updateStrength(id, body.strength);
  }
}
