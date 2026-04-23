import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { TenantScoped } from '../common/decorators/tenant-scoped.decorator';
import { AuthenticatedUser } from '../common/interfaces/request-with-user.interface';
import { CreateFarmDto } from './dto/create-farm.dto';
import { ListFarmsQueryDto } from './dto/list-farms-query.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { FarmsService } from './farms.service';

@ApiTags('Farms')
@ApiBearerAuth('bearer')
@TenantScoped()
@Controller('farms')
export class FarmsController {
  constructor(private readonly farmsService: FarmsService) {}

  @Post()
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER)
  create(@Body() dto: CreateFarmDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.farmsService.create(dto, actor);
  }

  @Get()
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER, UserRole.FIELD_OFFICER)
  findAll(@CurrentUser() actor: AuthenticatedUser, @Query() query: ListFarmsQueryDto) {
    return this.farmsService.findAll(actor, query);
  }

  @Get(':id')
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER, UserRole.FIELD_OFFICER)
  findOne(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.farmsService.findOne(id, actor);
  }

  @Patch(':id')
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateFarmDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.farmsService.update(id, dto, actor);
  }

  @Patch(':id/delete')
  @Roles(UserRole.TENANT_OWNER)
  remove(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.farmsService.remove(id, actor);
  }
}
