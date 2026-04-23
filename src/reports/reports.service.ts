import { Injectable } from '@nestjs/common';
import { AuthenticatedUser } from '../common/interfaces/request-with-user.interface';
import { requireTenantScope } from '../common/utils/tenant-scope.util';
import { PrismaService } from '../prisma/prisma.service';
import { ReportQueryDto } from './dto/report-query.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  private buildTenantFilters(tenantId: string | undefined, query: ReportQueryDto) {
    return {
      tenantId,
      deletedAt: null,
      ...(query.farmId ? { farmId: query.farmId } : {}),
      ...(query.fieldId ? { fieldId: query.fieldId } : {}),
      ...(query.seasonId ? { seasonId: query.seasonId } : {}),
      ...(query.cropPlanId ? { cropPlanId: query.cropPlanId } : {}),
    };
  }

  async expenseSummary(actor: AuthenticatedUser, query: ReportQueryDto) {
    const tenantId = requireTenantScope(actor);
    const expenses = await this.prisma.expense.findMany({
      where: this.buildTenantFilters(tenantId, query),
      select: { amount: true, category: true, farmId: true, cropPlanId: true, seasonId: true },
    });

    const total = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
    const byCategory = expenses.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] ?? 0) + Number(item.amount);
      return acc;
    }, {});

    return { total, byCategory, count: expenses.length };
  }

  async yieldSummary(actor: AuthenticatedUser, query: ReportQueryDto) {
    const tenantId = requireTenantScope(actor);
    const yields = await this.prisma.yieldRecord.findMany({
      where: this.buildTenantFilters(tenantId, query),
      select: { quantity: true, cropPlanId: true, fieldId: true, farmId: true, qualityGrade: true },
    });

    const totalQuantity = yields.reduce((sum, item) => sum + Number(item.quantity), 0);
    const byField = yields.reduce<Record<string, number>>((acc, item) => {
      acc[item.fieldId] = (acc[item.fieldId] ?? 0) + Number(item.quantity);
      return acc;
    }, {});

    return { totalQuantity, byField, count: yields.length };
  }

  async activitySummary(actor: AuthenticatedUser, query: ReportQueryDto) {
    const tenantId = requireTenantScope(actor);
    const activities = await this.prisma.farmActivity.findMany({
      where: this.buildTenantFilters(tenantId, query),
      select: { activityType: true, status: true, actualCost: true },
    });

    const byType = activities.reduce<Record<string, number>>((acc, item) => {
      acc[item.activityType] = (acc[item.activityType] ?? 0) + 1;
      return acc;
    }, {});

    const byStatus = activities.reduce<Record<string, number>>((acc, item) => {
      acc[item.status] = (acc[item.status] ?? 0) + 1;
      return acc;
    }, {});

    const totalActualCost = activities.reduce(
      (sum, item) => sum + Number(item.actualCost ?? 0),
      0,
    );

    return { byType, byStatus, totalActualCost };
  }

  async dashboard(actor: AuthenticatedUser, query: ReportQueryDto) {
    const [expenses, yields, activities] = await Promise.all([
      this.expenseSummary(actor, query),
      this.yieldSummary(actor, query),
      this.activitySummary(actor, query),
    ]);

    return {
      expenses,
      yields,
      activities,
      profitabilityEstimate: yields.totalQuantity - expenses.total,
    };
  }
}
