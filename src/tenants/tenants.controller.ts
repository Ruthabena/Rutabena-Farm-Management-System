import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TenantStatus, UserRole } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthenticatedUser } from '../common/interfaces/request-with-user.interface';
import { OnboardTenantDto } from './dto/onboard-tenant.dto';
import { TenantListQueryDto } from './dto/tenant-list-query.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { UpdateTenantSettingsDto } from './dto/update-tenant-settings.dto';
import { TenantsService } from './tenants.service';

@ApiTags('Tenants')
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Public()
  @Post('onboard')
  @ApiOperation({ summary: 'Onboard a tenant and create the tenant owner' })
  @ApiCreatedResponse({ description: 'Tenant onboarded successfully.' })
  onboard(@Body() dto: OnboardTenantDto) {
    return this.tenantsService.onboard(dto);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth('bearer')
  @ApiOkResponse({ description: 'Tenants returned successfully.' })
  findAll(@Query() query: TenantListQueryDto) {
    return this.tenantsService.findAll(query);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER)
  @ApiBearerAuth('bearer')
  findOne(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.tenantsService.getAccessibleTenant(id, actor);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER)
  @ApiBearerAuth('bearer')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTenantDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.tenantsService.update(id, dto, actor);
  }

  @Patch(':id/settings')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_OWNER)
  @ApiBearerAuth('bearer')
  updateSettings(
    @Param('id') id: string,
    @Body() dto: UpdateTenantSettingsDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.tenantsService.updateSettings(id, dto, actor);
  }

  @Patch(':id/activate')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth('bearer')
  activate(@Param('id') id: string) {
    return this.tenantsService.setStatus(id, TenantStatus.ACTIVE);
  }

  @Patch(':id/deactivate')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth('bearer')
  deactivate(@Param('id') id: string) {
    return this.tenantsService.setStatus(id, TenantStatus.INACTIVE);
  }
}
