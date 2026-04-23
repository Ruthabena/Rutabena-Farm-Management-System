import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { TenantScoped } from '../common/decorators/tenant-scoped.decorator';
import { AuthenticatedUser } from '../common/interfaces/request-with-user.interface';
import { CreateYieldRecordDto } from './dto/create-yield-record.dto';
import { ListYieldRecordsQueryDto } from './dto/list-yield-records-query.dto';
import { UpdateYieldRecordDto } from './dto/update-yield-record.dto';
import { YieldsService } from './yields.service';

@ApiTags('Yields')
@ApiBearerAuth('bearer')
@TenantScoped()
@Controller('yields')
export class YieldsController {
  constructor(private readonly yieldsService: YieldsService) {}

  @Post()
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER, UserRole.FIELD_OFFICER)
  create(@Body() dto: CreateYieldRecordDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.yieldsService.create(dto, actor);
  }

  @Get()
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER, UserRole.FIELD_OFFICER, UserRole.ACCOUNTANT)
  findAll(@CurrentUser() actor: AuthenticatedUser, @Query() query: ListYieldRecordsQueryDto) {
    return this.yieldsService.findAll(actor, query);
  }

  @Get(':id')
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER, UserRole.FIELD_OFFICER, UserRole.ACCOUNTANT)
  findOne(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.yieldsService.findOne(id, actor);
  }

  @Patch(':id')
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER, UserRole.FIELD_OFFICER)
  update(@Param('id') id: string, @Body() dto: UpdateYieldRecordDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.yieldsService.update(id, dto, actor);
  }

  @Patch(':id/delete')
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER)
  remove(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.yieldsService.remove(id, actor);
  }
}
