import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { TenantScoped } from '../common/decorators/tenant-scoped.decorator';
import { AuthenticatedUser } from '../common/interfaces/request-with-user.interface';
import { CreateFieldDto } from './dto/create-field.dto';
import { ListFieldsQueryDto } from './dto/list-fields-query.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { FieldsService } from './fields.service';

@ApiTags('Fields')
@ApiBearerAuth('bearer')
@TenantScoped()
@Controller('fields')
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @Post()
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER, UserRole.FIELD_OFFICER)
  create(@Body() dto: CreateFieldDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.fieldsService.create(dto, actor);
  }

  @Get()
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER, UserRole.FIELD_OFFICER, UserRole.WORKER)
  findAll(@CurrentUser() actor: AuthenticatedUser, @Query() query: ListFieldsQueryDto) {
    return this.fieldsService.findAll(actor, query);
  }

  @Get(':id')
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER, UserRole.FIELD_OFFICER, UserRole.WORKER)
  findOne(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.fieldsService.findOne(id, actor);
  }

  @Patch(':id')
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER, UserRole.FIELD_OFFICER)
  update(@Param('id') id: string, @Body() dto: UpdateFieldDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.fieldsService.update(id, dto, actor);
  }

  @Patch(':id/delete')
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER)
  remove(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.fieldsService.remove(id, actor);
  }
}
