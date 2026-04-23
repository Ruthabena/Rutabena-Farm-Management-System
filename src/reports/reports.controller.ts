import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { TenantScoped } from '../common/decorators/tenant-scoped.decorator';
import { AuthenticatedUser } from '../common/interfaces/request-with-user.interface';
import { ReportQueryDto } from './dto/report-query.dto';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@ApiBearerAuth('bearer')
@TenantScoped()
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('expenses')
  @Roles(UserRole.TENANT_OWNER, UserRole.ACCOUNTANT, UserRole.FARM_MANAGER)
  expenses(@CurrentUser() actor: AuthenticatedUser, @Query() query: ReportQueryDto) {
    return this.reportsService.expenseSummary(actor, query);
  }

  @Get('yields')
  @Roles(UserRole.TENANT_OWNER, UserRole.ACCOUNTANT, UserRole.FARM_MANAGER, UserRole.FIELD_OFFICER)
  yields(@CurrentUser() actor: AuthenticatedUser, @Query() query: ReportQueryDto) {
    return this.reportsService.yieldSummary(actor, query);
  }

  @Get('activities')
  @Roles(UserRole.TENANT_OWNER, UserRole.FARM_MANAGER, UserRole.FIELD_OFFICER)
  activities(@CurrentUser() actor: AuthenticatedUser, @Query() query: ReportQueryDto) {
    return this.reportsService.activitySummary(actor, query);
  }

  @Get('dashboard')
  @Roles(UserRole.TENANT_OWNER, UserRole.ACCOUNTANT, UserRole.FARM_MANAGER)
  dashboard(@CurrentUser() actor: AuthenticatedUser, @Query() query: ReportQueryDto) {
    return this.reportsService.dashboard(actor, query);
  }
}
