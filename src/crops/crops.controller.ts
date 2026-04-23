import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { TenantScoped } from '../common/decorators/tenant-scoped.decorator';
import { AuthenticatedUser } from '../common/interfaces/request-with-user.interface';
import { CropsService } from './crops.service';
import { CreateCropPlanDto } from './dto/create-crop-plan.dto';
import { ListCropPlansQueryDto } from './dto/list-crop-plans-query.dto';
import { UpdateCropPlanDto } from './dto/update-crop-plan.dto';

@ApiTags('Crops')
@ApiBearerAuth('bearer')
@TenantScoped()
@Controller('crops')
export class CropsController {
  constructor(private readonly cropsService: CropsService) {}

  @Post()
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER, UserRole.FIELD_OFFICER)
  create(@Body() dto: CreateCropPlanDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.cropsService.create(dto, actor);
  }

  @Get()
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER, UserRole.FIELD_OFFICER, UserRole.ACCOUNTANT)
  findAll(@CurrentUser() actor: AuthenticatedUser, @Query() query: ListCropPlansQueryDto) {
    return this.cropsService.findAll(actor, query);
  }

  @Get(':id')
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER, UserRole.FIELD_OFFICER, UserRole.ACCOUNTANT)
  findOne(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.cropsService.findOne(id, actor);
  }

  @Patch(':id')
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER, UserRole.FIELD_OFFICER)
  update(@Param('id') id: string, @Body() dto: UpdateCropPlanDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.cropsService.update(id, dto, actor);
  }

  @Patch(':id/delete')
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER)
  remove(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.cropsService.remove(id, actor);
  }
}
