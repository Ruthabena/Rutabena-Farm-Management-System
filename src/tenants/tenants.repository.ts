import { Injectable } from '@nestjs/common';
import { Tenant, TenantSettings, TenantStatus } from '@prisma/client';
import { INSENSITIVE_MODE } from '../common/constants/prisma.constants';
import { buildPagination } from '../common/utils/pagination.util';
import { PrismaService } from '../prisma/prisma.service';
import { TenantListQueryDto } from './dto/tenant-list-query.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { UpdateTenantSettingsDto } from './dto/update-tenant-settings.dto';
import { ITenantRepository, TenantWithSettings } from './domain/tenant-repository.interface';

@Injectable()
export class TenantsRepository implements ITenantRepository {
  constructor(private readonly prisma: PrismaService) {}

  findBySlug(slug: string): Promise<Tenant | null> {
    return this.prisma.tenant.findUnique({ where: { slug } });
  }

  findById(id: string): Promise<TenantWithSettings | null> {
    return this.prisma.tenant.findFirst({
      where: { id, deletedAt: null },
      include: { settings: true },
    });
  }

  async findMany(query: TenantListQueryDto): Promise<{ items: TenantWithSettings[]; total: number }> {
    const { skip, take, sortOrder } = buildPagination(query);
    const where = {
      deletedAt: null,
      ...(query.status ? { status: query.status } : {}),
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: INSENSITIVE_MODE } },
              { slug: { contains: query.search, mode: INSENSITIVE_MODE } },
              { email: { contains: query.search, mode: INSENSITIVE_MODE } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.tenant.findMany({ where, include: { settings: true }, skip, take, orderBy: { createdAt: sortOrder } }),
      this.prisma.tenant.count({ where }),
    ]);

    return { items, total };
  }

  update(id: string, dto: UpdateTenantDto): Promise<TenantWithSettings> {
    const { ownerFirstName, ownerLastName, ownerEmail, ownerPassword, ownerPhone, ...tenantUpdates } = dto;
    void ownerFirstName; void ownerLastName; void ownerEmail; void ownerPassword; void ownerPhone;

    return this.prisma.tenant.update({
      where: { id },
      data: {
        ...tenantUpdates,
        ...(dto.slug ? { slug: dto.slug.toLowerCase() } : {}),
      },
      include: { settings: true },
    });
  }

  upsertSettings(tenantId: string, dto: UpdateTenantSettingsDto): Promise<TenantSettings> {
    return this.prisma.tenantSettings.upsert({
      where: { tenantId },
      update: {
        currency: dto.currency,
        timezone: dto.timezone,
        financialYearStartMonth: dto.financialYearStartMonth,
        dateFormat: dto.dateFormat,
      },
      create: {
        tenantId,
        currency: dto.currency ?? 'NGN',
        timezone: dto.timezone ?? 'Africa/Lagos',
        financialYearStartMonth: dto.financialYearStartMonth ?? 1,
        dateFormat: dto.dateFormat ?? 'YYYY-MM-DD',
      },
    });
  }

  setStatus(id: string, status: TenantStatus): Promise<Tenant> {
    return this.prisma.tenant.update({
      where: { id },
      data: { status, isActive: status === TenantStatus.ACTIVE },
    });
  }
}
