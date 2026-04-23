import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { TenantScoped } from '../common/decorators/tenant-scoped.decorator';
import { AuthenticatedUser } from '../common/interfaces/request-with-user.interface';
import { ChangeRoleDto } from './dto/change-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth('bearer')
@TenantScoped()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER)
  @ApiOperation({ summary: 'Create a user within the authenticated tenant' })
  @ApiCreatedResponse({ description: 'User created successfully.' })
  create(@Body() dto: CreateUserDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.usersService.create(dto, actor);
  }

  @Get()
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER)
  @ApiOkResponse({ description: 'Users returned successfully.' })
  findAll(
    @CurrentUser() actor: AuthenticatedUser,
    @Query() query: ListUsersQueryDto,
  ) {
    return this.usersService.findAll(actor, query);
  }

  @Get('me')
  findMyProfile(@CurrentUser() actor: AuthenticatedUser) {
    return this.usersService.findOne(actor.userId, actor);
  }

  @Get(':id')
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER)
  findOne(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.usersService.findOne(id, actor);
  }

  @Patch(':id')
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.usersService.update(id, dto, actor);
  }

  @Patch(':id/role')
  @Roles(UserRole.TENANT_OWNER)
  changeRole(
    @Param('id') id: string,
    @Body() dto: ChangeRoleDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.usersService.changeRole(id, dto, actor);
  }

  @Patch(':id/deactivate')
  @Roles(UserRole.TENANT_OWNER)
  deactivate(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.usersService.deactivate(id, actor);
  }
}
