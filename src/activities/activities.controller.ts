import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { TenantScoped } from '../common/decorators/tenant-scoped.decorator';
import { AuthenticatedUser } from '../common/interfaces/request-with-user.interface';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ListActivitiesQueryDto } from './dto/list-activities-query.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@ApiTags('Activities')
@ApiBearerAuth('bearer')
@TenantScoped()
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER, UserRole.FIELD_OFFICER)
  create(@Body() dto: CreateActivityDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.activitiesService.create(dto, actor);
  }

  @Get()
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER, UserRole.FIELD_OFFICER, UserRole.WORKER)
  findAll(@CurrentUser() actor: AuthenticatedUser, @Query() query: ListActivitiesQueryDto) {
    return this.activitiesService.findAll(actor, query);
  }

  @Get(':id')
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER, UserRole.FIELD_OFFICER, UserRole.WORKER)
  findOne(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.activitiesService.findOne(id, actor);
  }

  @Patch(':id')
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER, UserRole.FIELD_OFFICER)
  update(@Param('id') id: string, @Body() dto: UpdateActivityDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.activitiesService.update(id, dto, actor);
  }

  @Patch(':id/delete')
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER)
  remove(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.activitiesService.remove(id, actor);
  }
}
