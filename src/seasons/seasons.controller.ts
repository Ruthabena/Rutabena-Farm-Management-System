import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { TenantScoped } from '../common/decorators/tenant-scoped.decorator';
import { AuthenticatedUser } from '../common/interfaces/request-with-user.interface';
import { CreateSeasonDto } from './dto/create-season.dto';
import { ListSeasonsQueryDto } from './dto/list-seasons-query.dto';
import { UpdateSeasonDto } from './dto/update-season.dto';
import { SeasonsService } from './seasons.service';

@ApiTags('Seasons')
@ApiBearerAuth('bearer')
@TenantScoped()
@Controller('seasons')
export class SeasonsController {
  constructor(private readonly seasonsService: SeasonsService) {}

  @Post()
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER)
  create(@Body() dto: CreateSeasonDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.seasonsService.create(dto, actor);
  }

  @Get()
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER, UserRole.FIELD_OFFICER, UserRole.ACCOUNTANT)
  findAll(@CurrentUser() actor: AuthenticatedUser, @Query() query: ListSeasonsQueryDto) {
    return this.seasonsService.findAll(actor, query);
  }

  @Get(':id')
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER, UserRole.FIELD_OFFICER, UserRole.ACCOUNTANT)
  findOne(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.seasonsService.findOne(id, actor);
  }

  @Patch(':id')
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER)
  update(@Param('id') id: string, @Body() dto: UpdateSeasonDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.seasonsService.update(id, dto, actor);
  }

  @Patch(':id/delete')
  @Roles(UserRole.TENANT_OWNER)
  remove(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.seasonsService.remove(id, actor);
  }
}
